import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";
import "@excalidraw/excalidraw/index.css";

// Excalidraw is a heavy dependency — load it only when the whiteboard opens so
// it never weighs down the initial bundle.
const Excalidraw = lazy(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw })),
);

const STORE_KEY = "whiteboard-scene"; // vector scene — small, kept in localStorage
const FILES_KEY = "whiteboard-files"; // embedded images — large, kept in IndexedDB
const SEEN_NOTICE_KEY = "whiteboard-notice-seen"; // first-visit "not saved online" hint
const SAVE_DEBOUNCE_MS = 500;

// Restore the vector scene (sync, from localStorage). Embedded images live in
// IndexedDB and are added after mount (see loadFiles). `collaborators` is a
// runtime-only field Excalidraw reconstructs itself, so we never persist it.
function loadScene() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const { elements, appState } = JSON.parse(raw);
    return {
      elements: elements || [],
      appState: { ...appState, collaborators: undefined },
    };
  } catch {
    return null;
  }
}

// Read the saved image map from IndexedDB, migrating any legacy copy that an
// earlier build wrote into localStorage.
async function loadFiles() {
  try {
    let files = await idbGet(FILES_KEY);
    if (!files) {
      const legacy = localStorage.getItem(FILES_KEY);
      if (legacy) {
        files = JSON.parse(legacy);
        await idbSet(FILES_KEY, files);
        localStorage.removeItem(FILES_KEY);
      }
    }
    return files || null;
  } catch {
    return null;
  }
}

// `theme` is the app's Catppuccin flavour ("mocha" = dark, "latte" = light).
export function Whiteboard({ theme, onBack }) {
  const saveTimer = useRef(null);
  const apiRef = useRef(null);
  // Read the vector scene once on mount; Excalidraw is uncontrolled after this.
  const initialData = useRef(loadScene()).current;

  // Show a one-time notice that the whiteboard lives only in this browser.
  const [showNotice, setShowNotice] = useState(
    () => localStorage.getItem(SEEN_NOTICE_KEY) !== "1",
  );
  const dismissNotice = () => {
    localStorage.setItem(SEEN_NOTICE_KEY, "1");
    setShowNotice(false);
  };

  // Once the scene has loaded, pull embedded images from IndexedDB and hand
  // them to Excalidraw so image elements render instead of showing as missing.
  useEffect(() => {
    let cancelled = false;
    loadFiles().then((files) => {
      if (cancelled || !files || !apiRef.current) return;
      const arr = Object.values(files);
      if (arr.length) apiRef.current.addFiles(arr);
    });
    return () => { cancelled = true; };
  }, []);

  const onChange = useCallback((elements, appState, files) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const { collaborators, ...rest } = appState;
        localStorage.setItem(
          STORE_KEY,
          JSON.stringify({ elements, appState: rest }),
        );
      } catch {
        // storage full / unavailable — drawing keeps working in memory
      }
      // Images go to IndexedDB (roomy, async) so many/large pastes survive.
      if (files && Object.keys(files).length) {
        idbSet(FILES_KEY, files).catch(() => {});
      } else {
        idbDel(FILES_KEY).catch(() => {});
      }
    }, SAVE_DEBOUNCE_MS);
  }, []);

  return (
    <div className="whiteboard">
      {onBack && (
        <button className="whiteboard-back" onClick={onBack} title="Back to Practice">
          ← Back
        </button>
      )}
      {showNotice && (
        <div className="whiteboard-notice" role="status">
          <span>
            This whiteboard is <strong>not saved online</strong> — it stays in
            this browser only. Clearing site data will erase it.
          </span>
          <button className="whiteboard-notice-close" onClick={dismissNotice}>
            Got it
          </button>
        </div>
      )}
      <Suspense
        fallback={<div className="whiteboard-loading">Loading whiteboard…</div>}
      >
        <Excalidraw
          excalidrawAPI={(api) => (apiRef.current = api)}
          initialData={initialData}
          onChange={onChange}
          theme={theme === "mocha" ? "dark" : "light"}
        />
      </Suspense>
    </div>
  );
}
