import { useEffect, useRef, useState } from "react";
import { groupedCheatsheets, ALL_ID } from "../data";

// Flat id list in the exact order the items render (View all, then each group).
const ORDER = [
  ALL_ID,
  ...Object.values(groupedCheatsheets)
    .flat()
    .map((s) => s.id),
];

export function Sidebar({ activeId, onSelect, open, focusSignal }) {
  const ref = useRef(null);
  const [cursor, setCursor] = useState(-1); // index into ORDER; -1 = keyboard nav off

  // Focus the panel when the leader chord (space o) fires.
  useEffect(() => {
    if (!focusSignal) return;
    setCursor(Math.max(0, ORDER.indexOf(activeId)));
    ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSignal]); // only when the chord fires, not on every activeId change

  const move = (d) =>
    setCursor((c) => {
      const base = c < 0 ? Math.max(0, ORDER.indexOf(activeId)) : c;
      return (base + d + ORDER.length) % ORDER.length;
    });

  const exit = () => {
    setCursor(-1);
    ref.current?.blur();
  };

  function onKeyDown(e) {
    if (e.key === "j" || e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "k" || e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(cursor >= 0 ? ORDER[cursor] : activeId); // opens; focus returns to page
      exit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      exit();
    }
  }

  const cursorId = cursor >= 0 ? ORDER[cursor] : null;

  const Item = ({ id, icon, title }) => (
    <button
      className={
        "nav-item" +
        (id === activeId ? " active" : "") +
        (id === cursorId ? " cursor" : "")
      }
      onClick={() => onSelect(id)}
      title={title}
    >
      <span className="emoji">{icon}</span>
      <span className="label">{title}</span>
    </button>
  );

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onBlur={() => setCursor(-1)}
      className={"sidebar" + (open ? " open" : "")}
    >
      <div className="brand">
        <span className="ferris">📚</span>
        <span className="brand-text">Cheatsheet for all</span>
      </div>

      <Item id={ALL_ID} icon="📖" title="View all" />

      {Object.entries(groupedCheatsheets).map(([group, sheets]) => (
        <div key={group}>
          <div className="group-label">{group}</div>
          {sheets.map((s) => (
            <Item key={s.id} id={s.id} icon={s.icon} title={s.title} />
          ))}
        </div>
      ))}
    </aside>
  );
}
