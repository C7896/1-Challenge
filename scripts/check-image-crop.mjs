#!/usr/bin/env node
// Catches images that get silently cropped.
//
// React Native defaults Image and ImageBackground to resizeMode "cover", which
// fills the box and throws away whatever does not fit. If the style box has a
// different shape from the artwork, the picture is quietly cut off. That is what
// flattened all three stat clouds on Home: near square art in a box 2.6 times
// wider than tall.
//
// This walks every Image and ImageBackground in the app, works out the box shape
// from the stylesheet, reads the real pixel size out of the PNG header, and
// reports anything that will crop.
//
// Usage: node scripts/check-image-crop.mjs

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SEARCH_DIRS = ["screens", "components"];
const TOLERANCE = 0.15; // 15% shape difference before it is worth reporting

function walk(dir, out = []) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full, out);
        else if (name.endsWith(".js")) out.push(full);
    }
    return out;
}

// PNG intrinsic size lives in the IHDR chunk, bytes 16..24. No dependency needed.
function pngSize(path) {
    const buf = readFileSync(path);
    if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// Pull `name: { ... }` blocks out of a StyleSheet.create call.
function parseStyles(src) {
    const styles = {};
    const start = src.indexOf("StyleSheet.create(");
    if (start < 0) return styles;
    const body = src.slice(start);
    const re = /(\w+)\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let m;
    while ((m = re.exec(body))) {
        const [, name, block] = m;
        const num = (key) => {
            const hit = block.match(new RegExp(`${key}\\s*:\\s*("?[\\d.%]+"?)`));
            if (!hit) return null;
            const raw = hit[1].replace(/"/g, "");
            if (raw.endsWith("%")) return { percent: parseFloat(raw) };
            const v = parseFloat(raw);
            return Number.isNaN(v) ? null : v;
        };
        const ratio = block.match(/aspectRatio\s*:\s*([\d.]+)\s*\/\s*([\d.]+)/)
            || block.match(/aspectRatio\s*:\s*([\d.]+)/);
        styles[name] = {
            width: num("width"),
            height: num("height"),
            aspectRatio: ratio ? (ratio[2] ? parseFloat(ratio[1]) / parseFloat(ratio[2]) : parseFloat(ratio[1])) : null,
        };
    }
    return styles;
}

function requirePaths(src) {
    const map = {};
    const re = /const\s+(\w+)\s*=\s*require\(\s*["']([^"']+)["']\s*\)/g;
    let m;
    while ((m = re.exec(src))) map[m[1]] = m[2];
    return map;
}

const findings = [];
const checked = [];

for (const dir of SEARCH_DIRS) {
    let files;
    try { files = walk(join(ROOT, dir)); } catch { continue; }

    for (const file of files) {
        const src = readFileSync(file, "utf8");
        const styles = parseStyles(src);
        const reqs = requirePaths(src);
        const rel = file.slice(ROOT.length + 1);

        const tagRe = /<(Image|ImageBackground)\b([^>]*)>/g;
        let m;
        while ((m = tagRe.exec(src))) {
            const [, tag, attrs] = m;
            const line = src.slice(0, m.index).split("\n").length;

            const srcMatch = attrs.match(/source=\{(\w+)\}/);
            if (!srcMatch) continue;
            const assetRel = reqs[srcMatch[1]];
            if (!assetRel) continue;

            const assetPath = resolve(dirname(file), assetRel);
            let size;
            try { size = pngSize(assetPath); } catch { continue; }
            if (!size) continue;

            const resizeMode = (attrs.match(/resizeMode=["{]?["']?(\w+)/) || [])[1] || "cover";

            // gather every style name referenced, plus any inline aspectRatio
            const names = [...attrs.matchAll(/styles\.(\w+)/g)].map((x) => x[1]);
            const inline = attrs.match(/aspectRatio:\s*([\d.]+)\s*\/\s*([\d.]+)/);
            let box = { width: null, height: null, aspectRatio: inline ? parseFloat(inline[1]) / parseFloat(inline[2]) : null };
            for (const n of names) {
                const s = styles[n];
                if (!s) continue;
                if (s.width != null) box.width = s.width;
                if (s.height != null) box.height = s.height;
                if (s.aspectRatio != null) box.aspectRatio = s.aspectRatio;
            }

            const assetAspect = size.width / size.height;
            let boxAspect = box.aspectRatio;
            if (boxAspect == null && typeof box.width === "number" && typeof box.height === "number") {
                boxAspect = box.width / box.height;
            }

            const entry = { rel, line, tag, asset: assetRel, resizeMode, assetAspect, boxAspect };
            checked.push(entry);

            if (resizeMode === "contain") continue; // cannot crop
            if (boxAspect == null) {
                if (box.width && box.width.percent && typeof box.height === "number") {
                    findings.push({ ...entry, why: "percentage width with a fixed height, shape depends on the screen, and resizeMode is not contain" });
                }
                continue;
            }
            const drift = Math.abs(boxAspect - assetAspect) / assetAspect;
            if (drift > TOLERANCE) {
                findings.push({ ...entry, drift, why: `box is ${boxAspect.toFixed(2)} wide to tall, artwork is ${assetAspect.toFixed(2)}, so ${Math.round(drift * 100)}% gets cropped away` });
            }
        }
    }
}

console.log(`Checked ${checked.length} image${checked.length === 1 ? "" : "s"} across ${SEARCH_DIRS.join(", ")}.\n`);

if (findings.length === 0) {
    console.log("No cropped images found.");
    process.exit(0);
}

for (const f of findings) {
    console.log(`${f.rel}:${f.line}  <${f.tag} source=${f.asset} resizeMode="${f.resizeMode}">`);
    console.log(`   ${f.why}`);
    console.log(`   fix: set resizeMode="contain", or match the box to the artwork's ${f.assetAspect.toFixed(3)} ratio\n`);
}
console.log(`${findings.length} image${findings.length === 1 ? "" : "s"} will be cropped.`);
process.exit(1);
