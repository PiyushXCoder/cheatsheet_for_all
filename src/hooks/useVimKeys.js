import { useEffect, useRef } from "react";

/**
 * Global Vim-style keybindings. `handlers` supplies the actions; typing inside
 * inputs is respected (only Enter/Shift+Enter/Esc are intercepted there).
 */
export function useVimKeys(handlers) {
  const h = useRef(handlers);
  h.current = handlers;
  const pendingG = useRef(false);
  const pendingSpace = useRef(false);

  useEffect(() => {
    function onKey(e) {
      const el = document.activeElement;

      // Ctrl+Shift+j / Ctrl+Shift+k jump topics from anywhere (even the search box).
      if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === "j") {
          e.preventDefault();
          h.current.onNextSheet?.();
          return;
        }
        if (k === "k") {
          e.preventDefault();
          h.current.onPrevSheet?.();
          return;
        }
      }

      // Sidebar owns its keys (j/k/Enter/Esc) while focused.
      if (el && el.closest && el.closest(".sidebar")) return;

      const typing =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");

      if (typing) {
        if (e.key === "Enter") {
          e.preventDefault();
          e.shiftKey ? h.current.onPrev?.() : h.current.onNext?.();
        } else if (e.key === "Escape") {
          el.blur();
          h.current.onEscape?.();
        }
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const main = h.current.mainRef?.current;

      // 1-9: jump straight to the Nth cheatsheet.
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        h.current.onJumpSheet?.(Number(e.key) - 1);
        return;
      }

      // <space> leader chord: space then e -> toggle sidebar.
      if (pendingSpace.current) {
        pendingSpace.current = false;
        if (e.key === "e") {
          e.preventDefault();
          h.current.onToggleCollapse?.();
          return;
        }
        if (e.key === "o") {
          e.preventDefault();
          h.current.onFocusSidebar?.();
          return;
        }
      }

      switch (e.key) {
        case " ":
          e.preventDefault(); // start leader chord, suppress page scroll
          pendingSpace.current = true;
          setTimeout(() => (pendingSpace.current = false), 500);
          break;
        case "/":
          e.preventDefault();
          h.current.onFocusSearch?.();
          break;
        case "n":
          h.current.onNext?.();
          break;
        case "N":
          h.current.onPrev?.();
          break;
        case "j":
          main?.scrollBy({ top: 90 }); // instant: smooth + key-repeat = janky
          break;
        case "k":
          main?.scrollBy({ top: -90 });
          break;
        case "d":
          main?.scrollBy({ top: main.clientHeight / 2, behavior: "smooth" });
          break;
        case "u":
          main?.scrollBy({ top: -main.clientHeight / 2, behavior: "smooth" });
          break;
        case "G":
          main?.scrollTo({ top: main.scrollHeight, behavior: "smooth" });
          break;
        case "g":
          if (pendingG.current) {
            pendingG.current = false;
            main?.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            pendingG.current = true;
            setTimeout(() => (pendingG.current = false), 400);
          }
          break;
        case "t":
          h.current.onToggleTheme?.();
          break;
        case "w":
          h.current.onToggleWrap?.();
          break;
        case "]":
          h.current.onNextSheet?.();
          break;
        case "[":
          h.current.onPrevSheet?.();
          break;
        case "?":
          h.current.onToggleHelp?.();
          break;
        case "Escape":
          h.current.onEscape?.();
          break;
        default:
          return;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
