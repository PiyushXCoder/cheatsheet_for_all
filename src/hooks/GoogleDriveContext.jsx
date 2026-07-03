import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const CLIENT_ID = "336840902598-cvkin3qnfkr37p04cc5eglcuq0ashmek.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
const TOKEN_KEY = "google-drive-auth";
const STORE_KEY = "practice-done";
const FILE_NAME = "practice-done.json";
// GIS error types that mean the user aborted sign-in — not real failures.
const CANCEL_TYPES = new Set([
  "popup_closed",
  "popup_failed_to_open",
  "access_denied",
  "user_cancel",
  "immediate_failed",
]);

const GoogleDriveContext = createContext(null);

export function GoogleDriveProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const tokenRef = useRef(null);

  const isLoggedIn = !!token;

  const persistToken = useCallback((response) => {
    const data = {
      access_token: response.access_token,
      expires_at: Date.now() + (response.expires_in || 3600) * 1000,
      scope: response.scope,
      token_type: response.token_type,
    };
    setToken(data);
    tokenRef.current = data;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
  }, []);

  const clearToken = useCallback(() => {
    setToken(null);
    tokenRef.current = null;
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const fetchUser = useCallback(async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const profile = await res.json();
        setUser(profile);
      }
    } catch {}
  }, []);

  const requestToken = useCallback((overrides) => {
    return new Promise((resolve, reject) => {
      if (typeof google === "undefined" || !google.accounts?.oauth2) {
        reject(new Error("GIS not loaded"));
        return;
      }
      const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) reject(Object.assign(new Error(response.error), { type: response.error }));
          else resolve(response);
        },
        // Fires when the user closes/dismisses the popup or it fails to open.
        // Without this the promise would hang and the UI would spin forever.
        error_callback: (err) => {
          reject(Object.assign(new Error(err?.type || "popup_closed"), { type: err?.type || "popup_closed" }));
        },
      });
      client.requestAccessToken(overrides);
    });
  }, []);

  const ensureToken = useCallback(async () => {
    const t = tokenRef.current;
    if (!t) throw new Error("Not authenticated");
    if (t.expires_at < Date.now() + 60000) {
      const response = await requestToken({ prompt: "" });
      persistToken(response);
      return response.access_token;
    }
    return t.access_token;
  }, [requestToken, persistToken]);

  // --- Drive API helpers ---
  const findDriveFile = useCallback(async (accessToken) => {
    const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'&fields=files(id,name)`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
    const data = await res.json();
    return data.files?.[0]?.id || null;
  }, []);

  const readDriveFile = useCallback(async (accessToken, fileId) => {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
    return await res.json();
  }, []);

  const writeDriveFile = useCallback(async (accessToken, fileId, data) => {
    const boundary = "nv-multipart-" + Date.now();
    const delimiter = `--${boundary}`;
    const close = `${delimiter}--`;
    const body = [
      delimiter,
      'Content-Type: application/json; charset=UTF-8',
      '',
      fileId ? '{}' : JSON.stringify({ name: FILE_NAME, parents: ["appDataFolder"] }),
      delimiter,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify(data),
      close,
    ].join("\r\n");
    const method = fileId ? "PATCH" : "POST";
    const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    });
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
    return await res.json();
  }, []);

  // --- Practice data storage ---
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

  const readFromDrive = useCallback(async (accessToken) => {
    const fileId = await findDriveFile(accessToken);
    if (!fileId) return {};
    const data = await readDriveFile(accessToken, fileId);
    return data || {};
  }, [findDriveFile, readDriveFile]);

  const writeToDrive = useCallback(async (accessToken, data) => {
    const fileId = await findDriveFile(accessToken);
    await writeDriveFile(accessToken, fileId, data);
  }, [findDriveFile, writeDriveFile]);

  // --- Public API ---
  const loadPracticeData = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const accessToken = await ensureToken();
        return await readFromDrive(accessToken);
      } catch {
        return {};
      }
    }
    return readLocal();
  }, [isLoggedIn, ensureToken, readFromDrive, readLocal]);

  const savePracticeData = useCallback(async (data) => {
    if (isLoggedIn) {
      try {
        const accessToken = await ensureToken();
        await writeToDrive(accessToken, data);
      } catch (err) {
        console.error("Failed to save to Drive:", err);
      }
    } else {
      writeLocal(data);
    }
  }, [isLoggedIn, ensureToken, writeToDrive, writeLocal]);

  const login = useCallback(async () => {
    setAuthLoading(true);
    try {
      const response = await requestToken();
      await fetchUser(response.access_token);
      const localData = readLocal();
      let driveData = {};
      try {
        driveData = await readFromDrive(response.access_token);
      } catch {}
      const merged = { ...driveData, ...localData };
      if (Object.keys(merged).length > 0) {
        try {
          await writeToDrive(response.access_token, merged);
        } catch {}
      }
      localStorage.removeItem(STORE_KEY);
      persistToken(response);
    } catch (err) {
      // User closed/cancelled the Google popup, or it failed to open. Stay in
      // local mode; only surface unexpected failures.
      if (!CANCEL_TYPES.has(err?.type)) {
        console.error("Google sign-in failed:", err);
      }
    } finally {
      setAuthLoading(false);
    }
  }, [requestToken, fetchUser, readLocal, readFromDrive, writeToDrive, persistToken]);

  const logout = useCallback(async () => {
    try {
      if (tokenRef.current) {
        await new Promise((resolve) => {
          google.accounts.oauth2.revoke(tokenRef.current.access_token, resolve);
        });
      }
    } catch {}
    clearToken();
    setUser(null);
  }, [clearToken]);

  // --- Init: restore saved token ---
  useEffect(() => {
    function init() {
      if (typeof google === "undefined" || !google.accounts?.oauth2) {
        setTimeout(init, 200);
        return;
      }
      const saved = localStorage.getItem(TOKEN_KEY);
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expires_at > Date.now()) {
          tokenRef.current = parsed;
          setToken(parsed);
          fetchUser(parsed.access_token);
        } else {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
              if (response.access_token) {
                persistToken(response);
                fetchUser(response.access_token);
              } else {
                localStorage.removeItem(TOKEN_KEY);
              }
            },
          });
          client.requestAccessToken({ prompt: "" });
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    init();
  }, [fetchUser, persistToken]);

  const value = {
    isLoggedIn,
    user,
    authLoading,
    login,
    logout,
    loadPracticeData,
    savePracticeData,
  };

  return (
    <GoogleDriveContext.Provider value={value}>
      {children}
    </GoogleDriveContext.Provider>
  );
}

export function useGoogleDrive() {
  const ctx = useContext(GoogleDriveContext);
  if (!ctx) throw new Error("useGoogleDrive must be used within GoogleDriveProvider");
  return ctx;
}
