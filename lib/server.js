// Shared server helpers for the /api functions.
// Auth model: the browser gets a Google ID token once (via Google Identity
// Services), we verify it here and mint our OWN long-lived session cookie.
// Every later request authenticates with that httpOnly cookie — no Google
// token per request, so there is never an unprompted OAuth popup.

import { SignJWT, jwtVerify, createRemoteJWKSet } from "jose";
import { neon } from "@neondatabase/serverless";

export const CLIENT_ID =
  "336840902598-cvkin3qnfkr37p04cc5eglcuq0ashmek.apps.googleusercontent.com";

const COOKIE_NAME = "sid";
const SESSION_DAYS = 90;

// --- Session cookie (our own JWT, HS256) ---
function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function createSession(user) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(sessionSecret());
}

function parseCookies(header) {
  const out = {};
  (header || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

// Returns the session payload { sub, email, name, picture } or null.
export async function readSession(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86400}`,
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  );
}

// --- Google ID token verification (JWKS, no extra dependency) ---
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export async function verifyGoogleIdToken(credential) {
  const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: CLIENT_ID,
  });
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

// --- Neon (Postgres) ---
export const sql = neon(process.env.DATABASE_URL);

let schemaReady = null;
export function ensureSchema() {
  // Run the DDL once per warm instance, not on every request.
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS progress (
        sub        TEXT PRIMARY KEY,
        data       JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.catch((e) => {
      schemaReady = null; // allow a retry on the next request
      throw e;
    });
  }
  return schemaReady;
}
