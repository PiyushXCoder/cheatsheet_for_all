import { useEffect, useRef, useState } from "react";

// Generic custom dropdown that mirrors the cheatsheet language selector
// (LangSelect). `options` is [{ value, label }]; label-only, no icons.
export function Select({ value, options, onChange, label, className = "" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = options.find((o) => o.value === value) ?? options[0];

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

  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className={"lang-select " + className} ref={rootRef}>
      <button
        type="button"
        className="lang-select-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        title={label}
      >
        <span className="lang-select-label">{current?.label}</span>
        <span className="lang-select-caret">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <ul className="lang-select-menu" role="listbox">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                className={"lang-select-opt" + (o.value === value ? " active" : "")}
                onClick={() => pick(o.value)}
              >
                <span>{o.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
