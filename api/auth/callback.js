// GET /api/auth/callback?code=&state= — finish the OAuth flow: exchange the
// code, verify the ID token, set the session cookie, and redirect back.
import {
  parseCookies,
  redirectUri,
  exchangeCode,
  verifyGoogleIdToken,
  createSession,
  sessionCookie,
  clearStateCookie,
} from "../../lib/server.js";

export default async function handler(req, res) {
  try {
    const { code, state } = req.query;
    const saved = parseCookies(req.headers.cookie).oauth_state || "";
    const [nonce, retB64] = saved.split(".");

    if (!code || !state || !nonce || state !== nonce) {
      res.writeHead(302, { Location: "/?auth_error=1" });
      return res.end();
    }

    let returnTo = "/";
    try {
      const decoded = Buffer.from(retB64 || "", "base64url").toString();
      if (decoded.startsWith("/") && !decoded.startsWith("//")) returnTo = decoded;
    } catch {}

    const tokens = await exchangeCode(code, redirectUri(req));
    const user = await verifyGoogleIdToken(tokens.id_token);
    const session = await createSession(user);

    res.setHeader("Set-Cookie", [clearStateCookie(), sessionCookie(session)]);
    res.writeHead(302, { Location: returnTo });
    res.end();
  } catch (err) {
    console.error("oauth callback failed:", err.message);
    res.writeHead(302, { Location: "/?auth_error=1" });
    res.end();
  }
}
