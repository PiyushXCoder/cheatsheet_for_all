import { useEffect, useState } from "react";

const KEY = "cheatsheet-theme";

// Catppuccin: "latte" (light) | "mocha" (dark)
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "latte" || saved === "mocha") return saved;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "latte" : "mocha";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "mocha" ? "latte" : "mocha"));

  return { theme, toggle };
}
