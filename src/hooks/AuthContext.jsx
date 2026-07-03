import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

// Auth model: Google Identity Services gives us an ID token once (on an explicit
// sign-in click). We POST it to /api/auth, which verifies it and sets a
// long-lived httpOnly session cookie. Every later request authenticates with
// that cookie — there is NO Google access token in the browser and no per-request
// token refresh, so the app never opens an unprompted OAuth popup on load.

const CLIENT_ID = "336840902598-cvkin3qnfkr37p04cc5eglcuq0ashmek.apps.googleusercontent.com";
const USER_KEY = "auth-user"; // cached profile, for instant UI on reload
const STORE_KEY = "practice-done"; // local fallback progress (signed out)
const SAVE_DEBOUNCE_MS = 800;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore the cached profile synchronously so the avatar shows immediately on
  // reload without a flash of the signed-out state. The session cookie is
  // validated in the background (see the bootstrap effect).
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "error"|"info", message }

  const dismissNotice = useCallback(() => setNotice(null), []);
  const notify = useCallback((message, type = "error") => setNotice({ type, message }), []);

  const isLoggedIn = !!user;

  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const bootstrapRef = useRef(null); // in-flight initial GET, reused by loadPracticeData
  const gisReadyRef = useRef(false);

  const setUserPersist = useCallback((u) => {
    setUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }, []);

  // --- Local (signed-out) progress storage ---
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

  // --- API helper (always sends the session cookie) ---
  const api = useCallback((path, opts = {}) => {
    return fetch(path, {
      credentials: "include",
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    });
  }, []);

  // Fetch the signed-in user + their progress. On 401 (no/expired session) we
  // clear the cached user and signal "signed out" so the UI shows sign-in.
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

  // --- Bootstrap: validate the session cookie once on load (no popup) ---
  useEffect(() => {
    bootstrapRef.current = fetchProgress().catch(() => ({ user: null, data: null }));
  }, [fetchProgress]);

  // --- Public: load practice data ---
  const loadPracticeData = useCallback(async () => {
    try {
      // Reuse the bootstrap request the first time to avoid a duplicate GET.
      const boot = bootstrapRef.current;
      bootstrapRef.current = null;
      const json = boot ? await boot : await fetchProgress();
      if (json.user && json.data != null) return json.data;
      return readLocal(); // signed out
    } catch (err) {
      console.error("Failed to load progress:", err.message);
      setNotice({ type: "error", message: "Couldn't load your progress. Showing local progress." });
      return readLocal();
    }
  }, [fetchProgress, readLocal]);

  // --- Public: save practice data (debounced upsert) ---
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
      // Coalesce rapid toggles into a single delayed POST.
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

  // Flush any pending debounced save when the tab is hidden or closed.
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

  // --- Google Identity Services ---
  // Exchange a fresh Google ID token for a session, then merge any local
  // (signed-out) progress into the account.
  const handleCredential = useCallback(async (credential) => {
    setAuthLoading(true);
    try {
      const res = await api("/api/auth", { method: "POST", body: JSON.stringify({ credential }) });
      if (!res.ok) throw new Error(`auth ${res.status}`);
      const { user: profile } = await res.json();
      setUserPersist(profile);

      // Merge progress made while signed out into the server copy.
      const local = readLocal();
      if (Object.keys(local).length > 0) {
        let serverData = {};
        try {
          const gr = await api("/api/progress");
          if (gr.ok) serverData = (await gr.json()).data || {};
        } catch {}
        const merged = { ...serverData, ...local };
        await api("/api/progress", { method: "POST", body: JSON.stringify({ data: merged }) });
        localStorage.removeItem(STORE_KEY);
      }
    } catch (err) {
      console.error("Sign-in failed:", err.message);
      setNotice({ type: "error", message: "Google sign-in failed. Please try again." });
    } finally {
      setAuthLoading(false);
    }
  }, [api, setUserPersist, readLocal]);

  const ensureGis = useCallback(() => {
    if (gisReadyRef.current) return true;
    if (typeof google === "undefined" || !google.accounts?.id) return false;
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      use_fedcm_for_prompt: true,
      callback: (resp) => {
        if (resp?.credential) handleCredential(resp.credential);
      },
    });
    gisReadyRef.current = true;
    return true;
  }, [handleCredential]);

  // Render Google's official sign-in button into an element (used when signed
  // out). This is user-initiated, so any account-chooser popup is expected.
  const renderSignIn = useCallback((el) => {
    const tryRender = () => {
      if (!ensureGis()) {
        setTimeout(tryRender, 200);
        return;
      }
      el.innerHTML = "";
      google.accounts.id.renderButton(el, {
        theme: "outline",
        size: "medium",
        type: "standard",
        shape: "pill",
        text: "signin_with",
      });
    };
    tryRender();
  }, [ensureGis]);

  const logout = useCallback(async () => {
    await flushPendingSave(); // don't lose a debounced change on sign-out
    try {
      await api("/api/logout", { method: "POST" });
    } catch {}
    try {
      google.accounts.id.disableAutoSelect();
    } catch {}
    setUserPersist(null);
  }, [api, flushPendingSave, setUserPersist]);

  const value = {
    isLoggedIn,
    user,
    authLoading,
    notice,
    dismissNotice,
    notify,
    renderSignIn,
    logout,
    loadPracticeData,
    savePracticeData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
