export function friendlyAuthError(error) {
  switch (error?.code) {
    case 'auth/network-request-failed':
      return { title: "No connection", body: "Check your internet connection and try again." };
    case 'auth/too-many-requests':
      return { title: "Too many attempts", body: "Please wait a few minutes and try again." };
    case 'auth/invalid-email':
      return { title: "That email does not look right", body: "Check the address and try again." };
    default:
      return { title: "Sign in failed", body: "That email and password combination did not work. Check them and try again, or use Forgot password." };
  }
}
