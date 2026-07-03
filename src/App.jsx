import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import "./App.css";
import { sheetsFor, DEFAULT_LANG, LANGUAGES, ALL_ID } from "./data";
import { useTheme } from "./hooks/useTheme";
import { useSearch } from "./hooks/useSearch";
import { useVimKeys } from "./hooks/useVimKeys";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Sheet } from "./components/Sheet";
import { AllSheets } from "./components/AllSheets";
import { HelpOverlay } from "./components/HelpOverlay";
import { Practice } from "./components/Practice";
import { Home } from "./components/Home";
import { Toast } from "./components/Toast";

const COLLAPSE_KEY = "cheatsheet-collapsed";
const WRAP_KEY = "cheatsheet-wrap";
const PRACTICE_ID = "__practice__";
const HOME_ID = "__home__";

export default function App() {
  const { theme, toggle } = useTheme();

  // URL-backed state (nuqs): ?lang, ?page, ?q, ?re
  const [lang, setLang] = useQueryState(
    "lang",
    parseAsString.withDefault(DEFAULT_LANG),
  );
  const cheatsheets = useMemo(() => sheetsFor(lang), [lang]);
  // Order for [ / ] navigation: the "view all" page then every sheet.
  const NAV_IDS = useMemo(
    () => [ALL_ID, ...cheatsheets.map((c) => c.id)],
    [cheatsheets],
  );

  const [activeId, setActiveId] = useQueryState(
    "page",
    parseAsString.withDefault(HOME_ID),
  );
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [useRegex, setUseRegex] = useQueryState(
    "re",
    parseAsBoolean.withDefault(false),
  );

  const [showHelp, setShowHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarFocus, setSidebarFocus] = useState(0);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "1",
  );
  const [wrap, setWrap] = useState(
    () => localStorage.getItem(WRAP_KEY) === "1",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-wrap", wrap ? "on" : "off");
  }, [wrap]);

  const searchRef = useRef(null);
  const mainRef = useRef(null);

  const isPractice = activeId === PRACTICE_ID;
  const isHome = activeId === HOME_ID;
  const isAll = activeId === ALL_ID;

  const sheet = useMemo(
    () => cheatsheets.find((c) => c.id === activeId),
    [activeId, cheatsheets],
  );
  // A query searches EVERYTHING: render all sheets so matches span every page.
  const showAll = !isPractice && !isHome && (isAll || !!query);

  const { count, active, error, next, prev } = useSearch(
    query,
    useRegex,
    mainRef,
    showAll ? "__all__view" : activeId,
  );

  const selectSheet = (id) => {
    setActiveId(id);
    setQuery("");
    setMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const stepSheet = (dir) => {
    const i = NAV_IDS.indexOf(activeId);
    if (i < 0) { selectSheet(NAV_IDS[dir > 0 ? 0 : NAV_IDS.length - 1]); return; }
    const nextI = (i + dir + NAV_IDS.length) % NAV_IDS.length;
    selectSheet(NAV_IDS[nextI]);
  };

  const selectLang = (next) => {
    if (next === lang) return;
    setLang(next);
    setActiveId(ALL_ID);
    setQuery("");
    setMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const switchLangByIndex = (i) => {
    const l = LANGUAGES[i];
    if (l) selectLang(l.id);
  };

  const focusSidebar = () => {
    setMenuOpen(true);
    setSidebarFocus((n) => n + 1);
  };

  // Reveal the search field (it collapses behind a button on narrow screens)
  // and focus it after it renders.
  const focusSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };
  const toggleSearch = () => {
    setSearchOpen((v) => {
      const next = !v;
      if (next) requestAnimationFrame(() => searchRef.current?.focus());
      return next;
    });
  };

  // Practice toggles: opening remembers where you were, closing returns there.
  const beforePractice = useRef(cheatsheets[0]?.id ?? ALL_ID);
  const togglePractice = () => {
    if (activeId === PRACTICE_ID) {
      selectSheet(beforePractice.current);
    } else {
      beforePractice.current = activeId;
      selectSheet(PRACTICE_ID);
    }
  };

  const toggleCollapse = () => {
    setCollapsed((v) => {
      localStorage.setItem(COLLAPSE_KEY, v ? "0" : "1");
      return !v;
    });
  };

  // `space e`: toggle the sidebar. Focus it only when expanding; when
  // collapsing, release focus so keys don't stay trapped in a hidden panel.
  const collapseChord = () => {
    const willExpand = collapsed;
    toggleCollapse();
    if (willExpand) focusSidebar();
    else document.activeElement?.blur?.();
  };

  const toggleWrap = () => {
    setWrap((v) => {
      localStorage.setItem(WRAP_KEY, v ? "0" : "1");
      return !v;
    });
  };

  useVimKeys({
    mainRef,
    onFocusSearch: focusSearch,
    onToggleSearch: toggleSearch,
    onClearSearch: () => setQuery(""),
    onNext: next,
    onPrev: prev,
    onToggleTheme: toggle,
    onNextSheet: () => stepSheet(1),
    onPrevSheet: () => stepSheet(-1),
    onSwitchLang: switchLangByIndex,
    onFocusSidebar: focusSidebar,
    onTogglePractice: togglePractice,
    onToggleHelp: () => setShowHelp((v) => !v),
    onToggleCollapse: toggleCollapse,
    onCollapseChord: collapseChord,
    onToggleWrap: toggleWrap,
    onEscape: () => setShowHelp(false),
  });

  useEffect(() => {
    document.title = isPractice
      ? "Practice · Cheatsheet for all"
      : isHome
        ? "Cheatsheet for all — DSA cheatsheets"
        : showAll
          ? "Cheatsheet for all"
          : sheet
            ? `${sheet.title} · Cheatsheet for all`
            : "Cheatsheet for all";
  }, [sheet, showAll, isPractice, isHome]);

  return (
    <div className={"app" + (collapsed ? " collapsed" : "")}>
      <Sidebar
        cheatsheets={cheatsheets}
        activeId={activeId}
        onSelect={selectSheet}
        open={menuOpen}
        focusSignal={sidebarFocus}
        homeId={HOME_ID}
      />
      <Header
        query={query}
        setQuery={setQuery}
        useRegex={useRegex}
        setUseRegex={setUseRegex}
        count={count}
        active={active}
        error={error}
        onNext={next}
        onPrev={prev}
        searchRef={searchRef}
        searchOpen={searchOpen}
        onToggleSearch={toggleSearch}
        languages={LANGUAGES}
        lang={lang}
        onSelectLang={selectLang}
        theme={theme}
        onToggleTheme={toggle}
        onToggleHelp={() => setShowHelp((v) => !v)}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onToggleCollapse={toggleCollapse}
        collapsed={collapsed}
        wrap={wrap}
        onToggleWrap={toggleWrap}
        practiceActive={isPractice}
        onPractice={togglePractice}
      />
      <main className="main" ref={mainRef}>
        {isPractice ? (
          <Practice />
        ) : isHome ? (
          <Home
            languages={LANGUAGES}
            onSelectLang={selectLang}
            onSelectAll={() => selectSheet(ALL_ID)}
            onSelectPractice={() => selectSheet(PRACTICE_ID)}
          />
        ) : showAll ? (
          <AllSheets cheatsheets={cheatsheets} />
        ) : (
          <Sheet sheet={sheet ?? cheatsheets[0]} />
        )}
      </main>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      <Toast />
      {menuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />
      )}
      <button
        className="floating-menu-btn"
        onClick={() => setMenuOpen((v) => !v)}
        title="Menu"
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </div>
  );
}
