// Auto-discovers every cheatsheet file in ./cheatsheets/.
// To add a new cheatsheet: drop a `*.js` file in that folder that
// `export default`s an object with { id, title, icon, group, order, cards }.
// No wiring needed — it shows up in the sidebar automatically.

const modules = import.meta.glob("./cheatsheets/*.js", { eager: true });

export const cheatsheets = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort(
    (a, b) =>
      (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title),
  );

// Group -> [cheatsheets] preserving sorted order, for the sidebar.
export const groupedCheatsheets = cheatsheets.reduce((acc, cs) => {
  const g = cs.group || "Misc";
  (acc[g] ||= []).push(cs);
  return acc;
}, {});
