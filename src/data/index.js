// Auto-discovers every cheatsheet file in ./cheatsheets/ (recursively).
// To add a new cheatsheet: drop a `*.js` file that `export default`s an object
// with { id, title, icon, group, order, cards, lang? }. `lang` defaults to
// "rust"; put C++ sheets under ./cheatsheets/cpp/ with lang: "cpp".
// No wiring needed — it shows up automatically for its language.

export const ALL_ID = "__all__";

// Languages shown in the top-bar selector, in display order.
export const LANGUAGES = [
  { id: "rust", label: "Rust", icon: "🦀" },
  { id: "cpp", label: "C++", icon: "🔷" },
  { id: "lua", label: "Lua", icon: "🌙" },
];

const modules = import.meta.glob("./cheatsheets/**/*.js", { eager: true });

const all = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean);

const sortSheets = (arr) =>
  [...arr].sort(
    (a, b) =>
      (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title),
  );

// lang -> sorted [cheatsheets]
const byLang = all.reduce((acc, cs) => {
  const lang = cs.lang || "rust";
  (acc[lang] ||= []).push(cs);
  return acc;
}, {});
for (const lang of Object.keys(byLang)) byLang[lang] = sortSheets(byLang[lang]);

export const DEFAULT_LANG =
  LANGUAGES.find((l) => byLang[l.id]?.length)?.id ?? "rust";

// The sorted cheatsheets for a language (empty array if none).
export function sheetsFor(lang) {
  return byLang[lang] ?? [];
}
