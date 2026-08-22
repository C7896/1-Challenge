#!/usr/bin/env node
// Static UI checks for the bug classes this app has actually shipped, so each
// one is a regression guard rather than a generic lint rule. Every rule below
// exists because the thing it checks for was a real defect at some point.
//
//   1  width "100%" on a child of a centring ancestor   -> collapses to zero width
//   2  Image/ImageBackground box vs artwork aspect      -> silent cropping
//   3  tintColor on an Image                            -> silently no-ops on some PNGs
//   4  white text on a light background token           -> unreadable
//   5  fixed-height read-only TextInput                 -> hides content with no affordance
//   6  a screen with a TabBar but no safe bottom pad    -> content under the floating bar
//   7  em dash in a user-facing string                  -> house style
//   8  unguarded counter reads on the stats screen      -> renders NaN
//
// Usage: node scripts/check-ui.mjs [--json]

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, resolve, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIRS = ["screens", "components"];
const JSON_OUT = process.argv.includes("--json");

const LIGHT_BACKGROUNDS = ["#FFFFFF", "#FFF", "#E9F4ED", "#FFF1E9", "#FFF7E6", "#A1D5AE", "#FFCF5B", "#FFC0A2", "#92C1D2"];

function walk(dir, out = []) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full, out);
        else if (name.endsWith(".js")) out.push(full);
    }
    return out;
}

function pngSize(path) {
    const buf = readFileSync(path);
    if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function parseStyles(src) {
    const styles = {};
    const start = src.indexOf("StyleSheet.create(");
    if (start < 0) return styles;
    const body = src.slice(start);
    const re = /(\w+)\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let m;
    while ((m = re.exec(body))) styles[m[1]] = m[2];
    return styles;
}

const findings = [];
const add = (file, line, rule, message) =>
    findings.push({ file: relative(ROOT, file), line, rule, message });

const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

for (const dir of DIRS) {
    let files;
    try { files = walk(join(ROOT, dir)); } catch { continue; }

    for (const file of files) {
        const src = readFileSync(file, "utf8");
        const styles = parseStyles(src);

        // 1: a child stretching to 100% under a parent that shrink-wraps it
        const centring = new Set();
        for (const [name, block] of Object.entries(styles)) {
            if (/alignItems:\s*["'](center|flex-start|flex-end)["']/.test(block)) centring.add(name);
        }
        for (const [name, block] of Object.entries(styles)) {
            if (!/width:\s*["']100%["']/.test(block)) continue;
            // flag only when this style is used as a child inside a centring parent
            const usedWith = [...src.matchAll(new RegExp(`styles\\.(\\w+)[^>]{0,120}styles\\.${name}\\b`, "g"))];
            for (const u of usedWith) {
                if (centring.has(u[1])) {
                    add(file, lineOf(src, u.index), "width-collapse",
                        `styles.${name} uses width "100%" inside styles.${u[1]}, which centres its children and will shrink-wrap it`);
                }
            }
        }

        // 2: image box shape vs the artwork's real shape
        const reqs = {};
        for (const m of src.matchAll(/const\s+(\w+)\s*=\s*require\(\s*["']([^"']+)["']\s*\)/g)) reqs[m[1]] = m[2];
        // Any component given a source, not just a literal Image: the stat clouds
        // render through StatCloud, and scanning only Image tags is exactly how
        // this rule missed the cropping bug it was written for.
        for (const m of src.matchAll(/<([A-Z]\w*)\b([^>]*)>/g)) {
            const tag = m[1];
            const attrs = m[2];
            const sm = attrs.match(/source=\{(\w+)\}/);
            if (!sm || !reqs[sm[1]]) continue;
            let size;
            try { size = pngSize(resolve(dirname(file), reqs[sm[1]])); } catch { continue; }
            if (!size) continue;
            let mode = (attrs.match(/resizeMode=["{]?["']?(\w+)/) || [])[1];
            if (!mode && tag !== "Image" && tag !== "ImageBackground") {
                // a wrapper component: the real resizeMode lives in its own file
                const compFile = join(ROOT, "components", tag[0].toLowerCase() + tag.slice(1) + ".js");
                try {
                    mode = (readFileSync(compFile, "utf8").match(/resizeMode=["{]?["']?(\w+)/) || [])[1];
                } catch { /* not a local component */ }
            }
            mode = mode || "cover";
            if (mode === "contain" || mode === "stretch") continue;
            // matches both the JSX prop aspectRatio={195 / 118} and the style
            // object form aspectRatio: 195 / 118
            const inline = attrs.match(/aspectRatio\s*[:=]\s*\{?\s*([\d.]+)\s*\/\s*([\d.]+)/);
            let boxAspect = inline ? parseFloat(inline[1]) / parseFloat(inline[2]) : null;
            if (boxAspect == null) {
                for (const sn of [...attrs.matchAll(/styles\.(\w+)/g)].map((x) => x[1])) {
                    const b = styles[sn];
                    if (!b) continue;
                    const w = b.match(/width:\s*(\d+)/), h = b.match(/height:\s*(\d+)/);
                    if (w && h) boxAspect = parseFloat(w[1]) / parseFloat(h[1]);
                }
            }
            if (boxAspect == null) continue;
            const art = size.width / size.height;
            const drift = Math.abs(boxAspect - art) / art;
            if (drift > 0.15) {
                add(file, lineOf(src, m.index), "image-crop",
                    `${reqs[sm[1]]} box is ${boxAspect.toFixed(2)} wide to tall but the artwork is ${art.toFixed(2)}; resizeMode "${mode}" will crop about ${Math.round(drift * 100)}%`);
            }
        }

        // 3: tintColor silently does nothing on some of this app's PNGs
        for (const m of src.matchAll(/tintColor\s*:/g)) {
            add(file, lineOf(src, m.index), "tint-color",
                "tintColor applied to an image; it silently no-ops on several PNGs here, so ship a coloured asset instead");
        }

        // 4: white text on a light surface
        for (const [name, block] of Object.entries(styles)) {
            if (!/color:\s*["']white["']|color:\s*["']#FFF{1,3}["']/i.test(block)) continue;
            const bg = block.match(/backgroundColor:\s*["'](#[0-9A-Fa-f]{3,8})["']/);
            if (bg && LIGHT_BACKGROUNDS.some((c) => c.toLowerCase() === bg[1].toLowerCase())) {
                add(file, 0, "contrast",
                    `styles.${name} puts white text on ${bg[1]}, which is a light surface`);
            }
        }

        // 5: read-only TextInput with a fixed height hides its own content
        for (const m of src.matchAll(/<TextInput\b([\s\S]{0,400}?)\/>/g)) {
            const block = m[1];
            if (!/readOnly|editable=\{false\}/.test(block)) continue;
            const hasFixedHeight = /height:\s*\d+/.test(block) ||
                [...block.matchAll(/styles\.(\w+)/g)].some((x) => styles[x[1]] && /height:\s*\d+/.test(styles[x[1]]));
            if (hasFixedHeight) {
                add(file, lineOf(src, m.index), "hidden-content",
                    "read-only TextInput with a fixed height scrolls internally with no affordance; render text that grows instead");
            }
        }

        // 6: a screen that shows the floating tab bar must reserve room for it
        if (/<TabBar\b/.test(src) && /<ScrollView\b/.test(src)) {
            const reserves = Object.values(styles).some((b) => {
                const pb = b.match(/paddingBottom:\s*(\d+)/);
                const mb = b.match(/marginBottom:\s*(\d+)/);
                return (pb && +pb[1] >= 105) || (mb && +mb[1] >= 105);
            });
            if (!reserves) {
                add(file, 0, "tabbar-overlap",
                    "screen renders a TabBar over a ScrollView but no style reserves at least 105pt at the bottom, so content can sit under the floating bar");
            }
        }

        // 7: house style
        for (const m of src.matchAll(/["'`][^"'`\n]*—[^"'`\n]*["'`]/g)) {
            add(file, lineOf(src, m.index), "em-dash", "em dash in a user-facing string");
        }

        // 8: counters must never reach the exponent unguarded
        for (const m of src.matchAll(/1\.01\s*\*\*\s*([^)]+)\)/g)) {
            if (!/\?\?/.test(m[1])) {
                add(file, lineOf(src, m.index), "nan-risk",
                    "1.01 ** an unguarded field; if it is undefined this renders the literal string NaN");
            }
        }
    }
}

if (JSON_OUT) {
    console.log(JSON.stringify({ findings }, null, 2));
    process.exit(findings.length ? 1 : 0);
}

const RULES = ["width-collapse", "image-crop", "tint-color", "contrast", "hidden-content", "tabbar-overlap", "em-dash", "nan-risk"];
console.log(`UI check across ${DIRS.join(", ")}: ${RULES.length} rules, ${findings.length} finding${findings.length === 1 ? "" : "s"}.\n`);

if (findings.length === 0) {
    console.log("All clear.");
    process.exit(0);
}
for (const f of findings) {
    console.log(`${f.file}${f.line ? ":" + f.line : ""}  [${f.rule}]`);
    console.log(`   ${f.message}\n`);
}
process.exit(1);
