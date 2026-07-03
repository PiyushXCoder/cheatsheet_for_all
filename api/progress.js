// GET  /api/progress        -> { user, data }   (401 if no session)
// POST /api/progress { data } -> 204              (upsert this user's progress)
import { readSession, sql, ensureSchema } from "../lib/server.js";

export default async function handler(req, res) {
  const session = await readSession(req);
  if (!session) return res.status(401).json({ error: "no session" });

  try {
    await ensureSchema();

    if (req.method === "GET") {
      const rows = await sql`SELECT data FROM progress WHERE sub = ${session.sub}`;
      return res.status(200).json({
        user: {
          sub: session.sub,
          email: session.email,
          name: session.name,
          picture: session.picture,
        },
        data: rows[0]?.data ?? {},
      });
    }

    if (req.method === "POST") {
      const data = req.body?.data;
      if (data == null || typeof data !== "object") {
        return res.status(400).json({ error: "invalid data" });
      }
      await sql`
        INSERT INTO progress (sub, data, updated_at)
        VALUES (${session.sub}, ${JSON.stringify(data)}::jsonb, now())
        ON CONFLICT (sub)
        DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      `;
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method not allowed" });
  } catch (err) {
    console.error("progress error:", err.message);
    return res.status(500).json({ error: "server error" });
  }
}
