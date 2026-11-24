// Google's public web client identifier is also rendered on the sign-in page.
export const googleClientId = process.env.GOOGLE_CLIENT_ID || '815344839028-tjev09os092tefiufs3v0gg7ji3lcv59.apps.googleusercontent.com';
export function validSignInRequest(cookie, submitted) {
  return typeof cookie === 'string' && cookie.length > 0 && cookie === submitted;
}
