import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ALL_ID } from "../data";
import { Icon } from "./Icon";

export function Sidebar({ cheatsheets, activeId, onSelect, open, focusSignal, privacyId, termsId, homeId }) {
  const ref = useRef(null);
  const [cursor, setCursor] = useState(-1); // index into ORDER; -1 = keyboard nav off

  // Same flat order as the "View all" page (data's `order` field). Group labels
  // are emitted when the group changes, so ordering matches all-view exactly.
  const ORDER = useMemo(
    () => [ALL_ID, ...cheatsheets.map((s) => s.id)],
    [cheatsheets],
  );

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
      <span className="emoji"><Icon name={icon} size={20} /></span>
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
      <button className="brand" onClick={() => onSelect(homeId)}>
        <span className="ferris"><Icon name="book" size={28} /></span>
        <span className="brand-text">Cheatsheet for all</span>
      </button>

      <Item id={homeId} icon="book" title="Home" />
      <Item id={ALL_ID} icon="book-open" title="View all" />

      {cheatsheets.map((s, i) => {
        const newGroup = i === 0 || s.group !== cheatsheets[i - 1].group;
        return (
          <Fragment key={s.id}>
            {newGroup && <div className="group-label">{s.group}</div>}
            <Item id={s.id} icon={s.icon} title={s.title} />
          </Fragment>
        );
      })}

      <div className="sidebar-footer">
        {privacyId && (
          <button
            className={"nav-item" + (activeId === privacyId ? " active" : "")}
            onClick={() => onSelect(privacyId)}
            title="Privacy Policy"
          >
            <span className="emoji"><Icon name="lock" size={20} /></span>
            <span className="label">Privacy Policy</span>
          </button>
        )}
        {termsId && (
          <button
            className={"nav-item" + (activeId === termsId ? " active" : "")}
            onClick={() => onSelect(termsId)}
            title="Terms of Service"
          >
            <span className="emoji"><Icon name="book" size={20} /></span>
            <span className="label">Terms of Service</span>
          </button>
        )}
      </div>
    </aside>
  );
}
