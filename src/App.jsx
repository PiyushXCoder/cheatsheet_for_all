import { useEffect, useMemo, useRef, useState } from "react";
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

const LAST_KEY = "cheatsheet-last";
const COLLAPSE_KEY = "cheatsheet-collapsed";
// Order for [ / ] navigation: the "view all" page then every sheet.
const NAV_IDS = [ALL_ID, ...cheatsheets.map((c) => c.id)];

export default function App() {
  const { theme, toggle } = useTheme();

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(LAST_KEY);
    return NAV_IDS.includes(saved) ? saved : cheatsheets[0]?.id;
  });
  const [query, setQuery] = useState("");
  const [useRegex, setUseRegex] = useState(false);
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

  const { count, active, error, next, prev } = useSearch(
    query,
    useRegex,
    mainRef,
    activeId,
  );

  const selectSheet = (id) => {
    setActiveId(id);
    setMenuOpen(false);
    localStorage.setItem(LAST_KEY, id);
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
    onEscape: () => setShowHelp(false),
  });

  const isAll = activeId === ALL_ID;

  useEffect(() => {
    document.title = isAll
      ? "All · Rust DSA"
      : sheet
        ? `${sheet.title} · Rust DSA`
        : "Rust DSA Cheatsheet";
  }, [sheet, isAll]);

  return (
    <div className={"app" + (collapsed ? " collapsed" : "")}>
      <Sidebar activeId={activeId} onSelect={selectSheet} open={menuOpen} />
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
        theme={theme}
        onToggleTheme={toggle}
        onToggleHelp={() => setShowHelp((v) => !v)}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onToggleCollapse={toggleCollapse}
        collapsed={collapsed}
      />
      <main className="main" ref={mainRef}>
        {isAll ? <AllSheets /> : <Sheet sheet={sheet} />}
      </main>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
