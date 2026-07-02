import { groupedCheatsheets, ALL_ID } from "../data";

export function Header({
  activeId,
  onSelect,
  query,
  setQuery,
  useRegex,
  setUseRegex,
  count,
  active,
  error,
  onNext,
  onPrev,
  searchRef,
  theme,
  onToggleTheme,
  onToggleHelp,
  onToggleMenu,
  onToggleCollapse,
  collapsed,
}) {
  return (
    <header className="header">
      <button className="icon-btn menu-btn" onClick={onToggleMenu} title="Menu">
        ☰
      </button>
      <button
        className="icon-btn collapse-btn"
        onClick={onToggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "»" : "«"}
      </button>
      <select
        className="sheet-select"
        value={activeId}
        onChange={(e) => onSelect(e.target.value)}
        title="Select a cheatsheet"
      >
        <option value={ALL_ID}>📖 View all</option>
        {Object.entries(groupedCheatsheets).map(([group, sheets]) => (
          <optgroup label={group} key={group}>
            {sheets.map((s) => (
              <option value={s.id} key={s.id}>
                {s.icon} {s.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="search">
        <span className="icon">🔍</span>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search  ( / to focus,  Enter next,  Shift+Enter prev )"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
        />
        <button
          className={"re-toggle" + (useRegex ? " on" : "")}
          onClick={() => setUseRegex((v) => !v)}
          title="Toggle regex mode"
        >
          .*
        </button>
        {query && (
          <>
            <span className={"count" + (error ? " bad" : "")}>
              {error ? "bad regex" : count ? `${active + 1}/${count}` : "0/0"}
            </span>
            <button className="nav-btn" onClick={onPrev} title="Previous (Shift+Enter / N)">
              ↑
            </button>
            <button className="nav-btn" onClick={onNext} title="Next (Enter / n)">
              ↓
            </button>
          </>
        )}
      </div>

      <button className="icon-btn" onClick={onToggleHelp} title="Keybindings (?)">
        ⌨
      </button>
      <button
        className="icon-btn"
        onClick={onToggleTheme}
        title="Toggle theme (t)"
      >
        {theme === "mocha" ? "🌙" : "☀️"}
      </button>
    </header>
  );
}
