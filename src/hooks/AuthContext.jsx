import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

// Auth: standard server-side Google OAuth. `login()` navigates to
// /api/auth/google, which redirects to Google and back to /api/auth/callback;
// the server verifies the ID token and sets a long-lived httpOnly session
// cookie. Every later request authenticates with that cookie — no Google token
// in the browser, no popup, nothing fires on load.

const USER_KEY = "auth-user"; // cached profile, for instant UI on reload
const STORE_KEY = "practice-done"; // local fallback progress (signed out)
const SAVE_DEBOUNCE_MS = 800;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  });
  const [notice, setNotice] = useState(null); // { type: "error"|"info", message }

  const dismissNotice = useCallback(() => setNotice(null), []);
  const notify = useCallback((message, type = "error") => setNotice({ type, message }), []);

  const isLoggedIn = !!user;

  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const bootstrapRef = useRef(null);

  const setUserPersist = useCallback((u) => {
    setUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const readLocal = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch {
      return {};
    }
  }, []);

  const writeLocal = useCallback((data) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }, []);

  const api = useCallback((path, opts = {}) => {
    return fetch(path, {
      credentials: "include",
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    });
  }, []);

  const fetchProgress = useCallback(async () => {
    const res = await api("/api/progress");
    if (res.status === 401) {
      setUserPersist(null);
      return { user: null, data: null };
    }
    if (!res.ok) throw new Error(`progress ${res.status}`);
    const json = await res.json();
    setUserPersist(json.user);
    return json;
  }, [api, setUserPersist]);

  // Bootstrap: validate the session cookie and, on first login, merge any
  // local (signed-out) progress into the account.
  useEffect(() => {
    bootstrapRef.current = (async () => {
      let json;
      try {
        json = await fetchProgress();
      } catch {
        return { user: null, data: null };
      }
      if (json.user) {
        const local = readLocal();
        if (Object.keys(local).length > 0) {
          const merged = { ...(json.data || {}), ...local };
          try {
            await api("/api/progress", { method: "POST", body: JSON.stringify({ data: merged }) });
            localStorage.removeItem(STORE_KEY);
            json = { ...json, data: merged };
          } catch {}
        }
      }
      return json;
    })();
  }, [fetchProgress, readLocal, api]);

  // Surface an auth error passed back on the redirect (?auth_error=1).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth_error")) {
      setNotice({ type: "error", message: "Google sign-in failed. Please try again." });
      params.delete("auth_error");
      const qs = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash,
      );
    }
  }, []);

  const loadPracticeData = useCallback(async () => {
    try {
      const boot = bootstrapRef.current;
      bootstrapRef.current = null;
      const json = boot ? await boot : await fetchProgress();
      if (json.user && json.data != null) return json.data;
      return readLocal();
    } catch (err) {
      console.error("Failed to load progress:", err.message);
      setNotice({ type: "error", message: "Couldn't load your progress. Showing local progress." });
      return readLocal();
    }
  }, [fetchProgress, readLocal]);

  const syncToServer = useCallback(async (data) => {
    try {
      const res = await api("/api/progress", { method: "POST", body: JSON.stringify({ data }) });
      if (res.status === 401) {
        setUserPersist(null);
        writeLocal(data);
        setNotice({ type: "error", message: "Session expired. Progress saved locally — sign in again to sync." });
        return;
      }
      if (!res.ok && res.status !== 204) throw new Error(`save ${res.status}`);
    } catch (err) {
      writeLocal(data);
      console.error("Failed to save progress:", err.message);
      setNotice({ type: "error", message: "Couldn't save to your account. Saved locally instead." });
    }
  }, [api, writeLocal, setUserPersist]);

  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const data = pendingSaveRef.current;
    if (data == null) return Promise.resolve();
    pendingSaveRef.current = null;
    return syncToServer(data);
  }, [syncToServer]);

  const savePracticeData = useCallback((data) => {
    if (isLoggedIn) {
      pendingSaveRef.current = data;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        const latest = pendingSaveRef.current;
        pendingSaveRef.current = null;
        if (latest != null) syncToServer(latest);
      }, SAVE_DEBOUNCE_MS);
    } else {
      writeLocal(data);
    }
  }, [isLoggedIn, syncToServer, writeLocal]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") flushPendingSave();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushPendingSave);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushPendingSave);
    };
  }, [flushPendingSave]);

  // Redirect to Google, returning to the current page afterwards.
  const login = useCallback(() => {
    const returnTo = window.location.pathname + window.location.search;
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
  }, []);

  const logout = useCallback(async () => {
    await flushPendingSave();
    try {
      await api("/api/logout", { method: "POST" });
    } catch {}
    setUserPersist(null);
  }, [api, flushPendingSave, setUserPersist]);

  const value = {
    isLoggedIn,
    user,
    notice,
    dismissNotice,
    notify,
    login,
    logout,
    loadPracticeData,
    savePracticeData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
