// GET /api/auth/google?returnTo=/path — start the Google OAuth redirect flow.
import { redirectUri, googleAuthUrl, stateCookie } from "../../lib/server.js";

export default function handler(req, res) {
  const nonce = globalThis.crypto.randomUUID();
  const rawReturn = typeof req.query.returnTo === "string" ? req.query.returnTo : "/";
  // Only allow same-site relative returns.
  const returnTo = rawReturn.startsWith("/") && !rawReturn.startsWith("//") ? rawReturn : "/";
  const value = `${nonce}.${Buffer.from(returnTo).toString("base64url")}`;

  res.setHeader("Set-Cookie", stateCookie(value));
  res.writeHead(302, { Location: googleAuthUrl(nonce, redirectUri(req)) });
  res.end();
}
