import { groupedCheatsheets, ALL_ID } from "../data";

export function Sidebar({ activeId, onSelect, open }) {
  const Item = ({ id, icon, title }) => (
    <button
      className={"nav-item" + (id === activeId ? " active" : "")}
      onClick={() => onSelect(id)}
      title={title}
    >
      <span className="emoji">{icon}</span>
      <span className="label">{title}</span>
    </button>
  );

  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
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
