import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import "./App.css";
import { cheatsheets, ALL_ID } from "./data";
import { useTheme } from "./hooks/useTheme";
import { useSearch } from "./hooks/useSearch";
import { useVimKeys } from "./hooks/useVimKeys";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Sheet } from "./components/Sheet";
import { AllSheets } from "./components/AllSheets";
import { HelpOverlay } from "./components/HelpOverlay";

const COLLAPSE_KEY = "cheatsheet-collapsed";
// Order for [ / ] navigation: the "view all" page then every sheet.
const NAV_IDS = [ALL_ID, ...cheatsheets.map((c) => c.id)];

export default function App() {
  const { theme, toggle } = useTheme();

  // URL-backed state (nuqs): ?page, ?q, ?re
  const [activeId, setActiveId] = useQueryState(
    "page",
    parseAsString.withDefault(cheatsheets[0]?.id ?? ALL_ID),
  );
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [useRegex, setUseRegex] = useQueryState(
    "re",
    parseAsBoolean.withDefault(false),
  );

  const [showHelp, setShowHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "1",
  );

  const searchRef = useRef(null);
  const mainRef = useRef(null);

  const sheet = useMemo(
    () => cheatsheets.find((c) => c.id === activeId),
    [activeId],
  );

  const isAll = activeId === ALL_ID;
  // A query searches EVERYTHING: render all sheets so matches span every page.
  const showAll = isAll || !!query;

  const { count, active, error, next, prev } = useSearch(
    query,
    useRegex,
    mainRef,
    showAll ? "__all__view" : activeId,
  );

  const selectSheet = (id) => {
    setActiveId(id);
    setMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const stepSheet = (dir) => {
    const i = NAV_IDS.indexOf(activeId);
    const nextI = (i + dir + NAV_IDS.length) % NAV_IDS.length;
    selectSheet(NAV_IDS[nextI]);
  };

  const toggleCollapse = () => {
    setCollapsed((v) => {
      localStorage.setItem(COLLAPSE_KEY, v ? "0" : "1");
      return !v;
    });
  };

  useVimKeys({
    mainRef,
    onFocusSearch: () => searchRef.current?.focus(),
    onNext: next,
    onPrev: prev,
    onToggleTheme: toggle,
    onNextSheet: () => stepSheet(1),
    onPrevSheet: () => stepSheet(-1),
    onToggleHelp: () => setShowHelp((v) => !v),
    onToggleCollapse: toggleCollapse,
    onEscape: () => setShowHelp(false),
  });

  useEffect(() => {
    document.title = showAll
      ? "Cheatsheet for all"
      : sheet
        ? `${sheet.title} · Cheatsheet for all`
        : "Cheatsheet for all";
  }, [sheet, showAll]);

  return (
    <div className={"app" + (collapsed ? " collapsed" : "")}>
      <Sidebar activeId={activeId} onSelect={selectSheet} open={menuOpen} />
      <Header
        activeId={activeId}
        onSelect={selectSheet}
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
        theme={theme}
        onToggleTheme={toggle}
        onToggleHelp={() => setShowHelp((v) => !v)}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onToggleCollapse={toggleCollapse}
        collapsed={collapsed}
      />
      <main className="main" ref={mainRef}>
        {showAll ? <AllSheets /> : <Sheet sheet={sheet} />}
      </main>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
