import { Icon } from "./Icon";
import { AuthWidget } from "./AuthWidget";
import { LangSelect } from "./LangSelect";

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
  searchOpen,
  onToggleSearch,
  languages,
  lang,
  onSelectLang,
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
    <header className={"header" + (searchOpen ? " search-open" : "")}>
      <button className="icon-btn menu-btn" onClick={onToggleMenu} title="Menu">
        <Icon name="menu" size={20} />
      </button>
      <button
        className="icon-btn collapse-btn"
        onClick={onToggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "»" : "«"}
      </button>
      <LangSelect
        languages={languages}
        lang={lang}
        onSelectLang={onSelectLang}
      />

      <div className="search">
        <span className="icon"><Icon name="search" size={16} /></span>
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
        className={"icon-btn search-toggle" + (searchOpen ? " on" : "")}
        onClick={onToggleSearch}
        aria-expanded={searchOpen}
        title="Toggle search (s)"
      >
        <Icon name="search" size={20} />
      </button>

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

      <button className="icon-btn help-btn" onClick={onToggleHelp} title="Keybindings (?)">
        <Icon name="keyboard" size={20} />
      </button>
      <button
        className="icon-btn"
        onClick={onToggleTheme}
        title="Toggle theme (t)"
      >
        {theme === "mocha" ? <Icon name="moon" size={20} /> : <Icon name="sun" size={20} />}
      </button>

      <div className="header-actions">
        <button
          className={"practice-btn" + (practiceActive ? " active" : "")}
          onClick={onPractice}
          title="Toggle Practice: top 150 LeetCode questions (p)"
        >
          Practice
        </button>
        <AuthWidget />
      </div>
    </header>
  );
}
