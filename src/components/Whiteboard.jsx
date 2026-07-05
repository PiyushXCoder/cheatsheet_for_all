import { lazy, Suspense, useCallback, useRef, useState } from "react";
import "@excalidraw/excalidraw/index.css";

// Excalidraw is a heavy dependency — load it only when the whiteboard opens so
// it never weighs down the initial bundle.
const Excalidraw = lazy(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw })),
);

const STORE_KEY = "whiteboard-scene"; // offline only — never synced to a server
const SEEN_NOTICE_KEY = "whiteboard-notice-seen"; // first-visit "not saved online" hint
const SAVE_DEBOUNCE_MS = 500;

// Restore the last scene from localStorage. `collaborators` is a runtime-only
// field Excalidraw expects to reconstruct itself, so we never persist it.
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

// `theme` is the app's Catppuccin flavour ("mocha" = dark, "latte" = light).
export function Whiteboard({ theme, onBack }) {
  const saveTimer = useRef(null);
  // Read once on mount; Excalidraw is uncontrolled after initialData.
  const initialData = useRef(loadScene()).current;

  // Show a one-time notice that the whiteboard lives only in this browser.
  const [showNotice, setShowNotice] = useState(
    () => localStorage.getItem(SEEN_NOTICE_KEY) !== "1",
  );
  const dismissNotice = () => {
    localStorage.setItem(SEEN_NOTICE_KEY, "1");
    setShowNotice(false);
  };

  const onChange = useCallback((elements, appState) => {
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
          initialData={initialData}
          onChange={onChange}
          theme={theme === "mocha" ? "dark" : "light"}
        />
      </Suspense>
    </div>
  );
}
