// Shared server helpers for the /api functions.
//
// Auth: standard server-side Google OAuth 2.0 authorization-code flow.
// /api/auth/google redirects to Google; /api/auth/callback exchanges the code
// (using the client secret) for an ID token, verifies it, and sets our own
// long-lived httpOnly session cookie. Every later request authenticates with
// that cookie — no Google token in the browser, no popup, no unprompted OAuth.

import { SignJWT, jwtVerify, createRemoteJWKSet } from "jose";
import { neon } from "@neondatabase/serverless";

export const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const SESSION_COOKIE = "sid";
const STATE_COOKIE = "oauth_state";
const SESSION_DAYS = 90;

function clientSecret() {
  const s = process.env.GOOGLE_CLIENT_SECRET;
  if (!s) throw new Error("GOOGLE_CLIENT_SECRET is not set");
  return s;
}

function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
}

// --- Cookies ---
export function parseCookies(header) {
  const out = {};
  (header || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

// localhost is treated as a secure context, so `Secure` is fine there too.
const cookie = (name, value, maxAge) =>
  `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;

export const sessionCookie = (token) => cookie(SESSION_COOKIE, token, SESSION_DAYS * 86400);
export const clearSessionCookie = () => cookie(SESSION_COOKIE, "", 0);
export const stateCookie = (value) => cookie(STATE_COOKIE, value, 600);
export const clearStateCookie = () => cookie(STATE_COOKIE, "", 0);

// --- Session (our own JWT) ---
export async function createSession(user) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(sessionSecret());
}

export async function readSession(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload;
  } catch {
    return null;
  }
}

// --- Google OAuth (authorization-code flow) ---
export function originFromReq(req) {
  const host = req.headers.host;
  const proto =
    req.headers["x-forwarded-proto"] ||
    (host?.startsWith("localhost") || host?.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

export const redirectUri = (req) => `${originFromReq(req)}/api/auth/callback`;

// Only allow same-origin relative paths as a post-login redirect target.
// Must start with a single "/" — rejects "//host" and "/\host" (browsers
// normalize "\" to "/", so "/\host" would become a cross-origin redirect).
export function safeReturnTo(path) {
  return typeof path === "string" && /^\/(?![/\\])/.test(path) ? path : "/";
}

export function googleAuthUrl(state, redirect_uri) {
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

export async function exchangeCode(code, redirect_uri) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: clientSecret(),
      redirect_uri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status} ${await res.text()}`);
  return await res.json(); // { id_token, access_token, ... }
}

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export async function verifyGoogleIdToken(idToken) {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
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
// Lazily create the client so a missing DATABASE_URL surfaces as a clean error
// at call time (handled by the route) rather than an opaque import-time crash.
let _sql = null;
export function sql(...args) {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql(...args);
}

let schemaReady = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS progress (
        sub        TEXT PRIMARY KEY,
        data       JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}
