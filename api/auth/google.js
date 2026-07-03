// GET /api/auth/google?returnTo=/path — start the Google OAuth redirect flow.
import { redirectUri, googleAuthUrl, stateCookie, safeReturnTo } from "../../lib/server.js";

export default function handler(req, res) {
  const nonce = globalThis.crypto.randomUUID();
  const returnTo = safeReturnTo(req.query.returnTo);
  const value = `${nonce}.${Buffer.from(returnTo).toString("base64url")}`;

  res.setHeader("Set-Cookie", stateCookie(value));
  res.writeHead(302, { Location: googleAuthUrl(nonce, redirectUri(req)) });
  res.end();
}
