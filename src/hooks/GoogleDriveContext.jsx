import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const CLIENT_ID = "336840902598-cvkin3qnfkr37p04cc5eglcuq0ashmek.apps.googleusercontent.com";
const DRIVE_APPDATA_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const SCOPES = `${DRIVE_APPDATA_SCOPE} https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;

// True only if the user actually granted the appdata scope (it can be unchecked
// on the consent screen). GIS returns the granted scopes in response.scope.
const hasAppDataScope = (response) =>
  (response?.scope || "").split(" ").includes(DRIVE_APPDATA_SCOPE);
const TOKEN_KEY = "google-drive-auth";
const STORE_KEY = "practice-done";
const FILE_NAME = "practice-done.json";
const SAVE_DEBOUNCE_MS = 800;
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
  const [notice, setNotice] = useState(null); // { type: "error"|"info", message }
  const tokenRef = useRef(null);
  const dismissNotice = useCallback(() => setNotice(null), []);
  const notify = useCallback((message, type = "error") => setNotice({ type, message }), []);
  // Cache of the single appDataFolder file id, and a chain that serialises
  // writes so concurrent saves can't create duplicate files or reorder.
  const fileIdRef = useRef(null);
  const writeChainRef = useRef(Promise.resolve());
  // Debounce Drive writes: toggling checkboxes fires many saves in a row, so
  // coalesce them into one PATCH after a short pause.
  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);

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
    fileIdRef.current = null;
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
  // Throw an Error carrying the HTTP status and Google's error reason, so
  // callers can distinguish auth failures (401/403) from other errors.
  const driveError = async (res) => {
    let reason = "";
    try {
      const body = await res.json();
      reason = body?.error?.errors?.[0]?.reason || body?.error?.status || "";
    } catch {}
    return Object.assign(
      new Error(`Drive API error: ${res.status}${reason ? ` (${reason})` : ""}`),
      { status: res.status, reason },
    );
  };
  const isAuthError = (err) => err?.status === 401 || err?.status === 403;

  const findDriveFile = useCallback(async (accessToken) => {
    // orderBy modifiedTime desc so that if duplicate files exist (e.g. from an
    // earlier race), we always pick the most recently written one.
    const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'&orderBy=modifiedTime desc&fields=files(id,name)`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) throw await driveError(res);
    const data = await res.json();
    return data.files?.[0]?.id || null;
  }, []);

  // Resolve the appdata file id once and cache it, so we never create a second
  // copy on subsequent reads/writes.
  const getFileId = useCallback(async (accessToken) => {
    if (fileIdRef.current) return fileIdRef.current;
    const id = await findDriveFile(accessToken);
    if (id) fileIdRef.current = id;
    return id;
  }, [findDriveFile]);

  const readDriveFile = useCallback(async (accessToken, fileId) => {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw await driveError(res);
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
    if (!res.ok) throw await driveError(res);
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
    const fileId = await getFileId(accessToken);
    if (!fileId) return {};
    const data = await readDriveFile(accessToken, fileId);
    return data || {};
  }, [getFileId, readDriveFile]);

  const writeToDrive = useCallback((accessToken, data) => {
    // Serialise on writeChainRef: each write waits for the previous one, so
    // saves apply in order and the file is only ever created once.
    const run = writeChainRef.current.then(async () => {
      const fileId = await getFileId(accessToken);
      const result = await writeDriveFile(accessToken, fileId, data);
      if (!fileId && result?.id) fileIdRef.current = result.id; // cache new file
      return result;
    });
    writeChainRef.current = run.catch(() => {}); // keep chain alive after errors
    return run;
  }, [getFileId, writeDriveFile]);

  // --- Public API ---
  const loadPracticeData = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const accessToken = await ensureToken();
        return await readFromDrive(accessToken);
      } catch (err) {
        // A stale token missing the drive.appdata scope (e.g. granted before
        // the scope was added) returns 401/403. Drop it so the user can
        // re-consent, and fall back to local progress meanwhile.
        console.error("Failed to load from Drive:", err.message);
        if (isAuthError(err)) {
          clearToken();
          setNotice({ type: "error", message: "Google Drive access expired. Please sign in again to sync your progress." });
        } else {
          setNotice({ type: "error", message: "Couldn't load progress from Google Drive. Showing your local progress." });
        }
        return readLocal();
      }
    }
    return readLocal();
  }, [isLoggedIn, ensureToken, readFromDrive, readLocal, clearToken]);

  // Actually push a snapshot to Drive (one PATCH), with auth/error handling.
  const syncToDrive = useCallback(async (data) => {
    try {
      const accessToken = await ensureToken();
      await writeToDrive(accessToken, data);
    } catch (err) {
      // On an auth error, keep the change locally and drop the bad token so
      // the next sign-in re-grants the appdata scope.
      writeLocal(data);
      console.error("Failed to save to Drive:", err.message);
      if (isAuthError(err)) {
        clearToken();
        setNotice({ type: "error", message: "Google Drive access expired. Progress saved locally — sign in again to sync." });
      } else {
        setNotice({ type: "error", message: "Couldn't save progress to Google Drive. Saved locally instead." });
      }
    }
  }, [ensureToken, writeToDrive, writeLocal, clearToken]);

  // Push any pending debounced save immediately; returns the write promise.
  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const data = pendingSaveRef.current;
    if (data == null) return Promise.resolve();
    pendingSaveRef.current = null;
    return syncToDrive(data);
  }, [syncToDrive]);

  const savePracticeData = useCallback((data) => {
    if (isLoggedIn) {
      // Coalesce rapid toggles into a single delayed PATCH.
      pendingSaveRef.current = data;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        const latest = pendingSaveRef.current;
        pendingSaveRef.current = null;
        if (latest != null) syncToDrive(latest);
      }, SAVE_DEBOUNCE_MS);
    } else {
      writeLocal(data);
    }
  }, [isLoggedIn, syncToDrive, writeLocal]);

  const login = useCallback(async () => {
    setAuthLoading(true);
    try {
      const response = await requestToken();
      // Require the Drive appdata scope — without it there is nowhere to sync
      // progress. Revoke the partial grant and stay signed out.
      if (!hasAppDataScope(response)) {
        try {
          google.accounts.oauth2.revoke(response.access_token, () => {});
        } catch {}
        setNotice({
          type: "error",
          message: "Please allow Google Drive access so your practice progress can sync. Sign-in was cancelled.",
        });
        return;
      }
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
        setNotice({ type: "error", message: "Google sign-in failed. Please try again." });
      }
    } finally {
      setAuthLoading(false);
    }
  }, [requestToken, fetchUser, readLocal, readFromDrive, writeToDrive, persistToken]);

  const logout = useCallback(async () => {
    await flushPendingSave(); // don't lose a debounced change on sign-out
    try {
      if (tokenRef.current) {
        await new Promise((resolve) => {
          google.accounts.oauth2.revoke(tokenRef.current.access_token, resolve);
        });
      }
    } catch {}
    clearToken();
    setUser(null);
  }, [clearToken, flushPendingSave]);

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
    notice,
    dismissNotice,
    notify,
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
