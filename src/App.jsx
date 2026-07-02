import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { cheatsheets } from "./data";
import { useTheme } from "./hooks/useTheme";
import { useSearch } from "./hooks/useSearch";
import { useVimKeys } from "./hooks/useVimKeys";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Sheet } from "./components/Sheet";
import { HelpOverlay } from "./components/HelpOverlay";

const LAST_KEY = "cheatsheet-last";

export default function App() {
  const { theme, toggle } = useTheme();

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(LAST_KEY);
    return cheatsheets.some((c) => c.id === saved) ? saved : cheatsheets[0]?.id;
  });
  const [query, setQuery] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    const i = cheatsheets.findIndex((c) => c.id === activeId);
    const nextI = (i + dir + cheatsheets.length) % cheatsheets.length;
    selectSheet(cheatsheets[nextI].id);
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

  useEffect(() => {
    document.title = sheet ? `${sheet.title} · Rust DSA` : "Rust DSA Cheatsheet";
  }, [sheet]);

  return (
    <div className="app">
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
      />
      <main className="main" ref={mainRef}>
        <Sheet sheet={sheet} />
      </main>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
