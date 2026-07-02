import { groupedCheatsheets } from "../data";

export function Sidebar({ activeId, onSelect, open }) {
  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <div className="brand">
        <span className="ferris">🦀</span>
        <span>Rust DSA Cheatsheet</span>
      </div>
      {Object.entries(groupedCheatsheets).map(([group, sheets]) => (
        <div key={group}>
          <div className="group-label">{group}</div>
          {sheets.map((s) => (
            <button
              key={s.id}
              className={"nav-item" + (s.id === activeId ? " active" : "")}
              onClick={() => onSelect(s.id)}
            >
              <span className="emoji">{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
