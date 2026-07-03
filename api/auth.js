// POST /api/auth  { credential }  — exchange a Google ID token for a session.
import { verifyGoogleIdToken, createSession, setSessionCookie } from "../lib/server.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }
  try {
    const credential = req.body?.credential;
    if (!credential) return res.status(400).json({ error: "missing credential" });

    const user = await verifyGoogleIdToken(credential);
    const token = await createSession(user);
    setSessionCookie(res, token);
    return res.status(200).json({ user });
  } catch (err) {
    console.error("auth failed:", err.message);
    return res.status(401).json({ error: "invalid credential" });
  }
}
