// POST /api/logout — clear the session cookie.
import { clearSessionCookie } from "../lib/server.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }
  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(204).end();
}
