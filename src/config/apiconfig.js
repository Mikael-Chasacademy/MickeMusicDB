export const API_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/api/auth/callback/token",
  scopes: ["user-read-email", "user-read-private", "user-library-read", "user-library-modify", "playlist-read-private", "playlist-modify-public", "playlist-modify-private"].join(" "),
};
