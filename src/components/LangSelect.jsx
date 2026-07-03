import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export function LangSelect({ languages, lang, onSelectLang }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = languages.find((l) => l.id === lang) ?? languages[0];

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id) => {
    onSelectLang(id);
    setOpen(false);
  };

  return (
    <div className="lang-select" ref={rootRef}>
      <button
        type="button"
        className="lang-select-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Select a language"
      >
        <Icon name={current.icon} size={18} className="lang-select-flag" />
        <span className="lang-select-label">{current.label}</span>
        <span className="lang-select-caret">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <ul className="lang-select-menu" role="listbox">
          {languages.map((l) => (
            <li key={l.id} role="option" aria-selected={l.id === lang}>
              <button
                type="button"
                className={"lang-select-opt" + (l.id === lang ? " active" : "")}
                onClick={() => pick(l.id)}
              >
                <Icon name={l.icon} size={18} className="lang-select-flag" />
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
