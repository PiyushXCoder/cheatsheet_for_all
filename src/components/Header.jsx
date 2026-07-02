export function Header({
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
  wrap,
  onToggleWrap,
  practiceActive,
  onPractice,
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
        defaultValue="rust"
        title="Select a language"
      >
        <option value="rust">🦀 Rust</option>
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

      <button
        className={"wrap-toggle" + (wrap ? " on" : "")}
        onClick={onToggleWrap}
        role="switch"
        aria-checked={wrap}
        title="Toggle word wrap in code blocks (w)"
      >
        <span className="wrap-knob" />
        <span className="wrap-label">wrap</span>
      </button>

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

      <button
        className={"practice-btn" + (practiceActive ? " active" : "")}
        onClick={onPractice}
        title="Toggle Practice: top 150 LeetCode questions (p)"
      >
        Practice
      </button>
    </header>
  );
}
