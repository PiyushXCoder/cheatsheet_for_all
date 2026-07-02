# 🦀 Rust DSA Cheatsheet

A fast, searchable React cheatsheet for doing Data Structures & Algorithms in
Rust. Catppuccin themed (Latte / Mocha), Vim keybindings, regex search with
match highlighting and jump-to-next.

## Features

- **Cards** — every cheatsheet is a grid of topic cards with copyable code.
- **Regex search** — toggle `.*` in the search bar. Matches highlight across
  the page (works even inside syntax-highlighted code) and you can jump between
  them.
- **Vim keybindings** — `/`, `n`/`N`, `j`/`k`, `d`/`u`, `gg`/`G`, `[`/`]`, `t`,
  `?`. Press `?` in the app for the full list.
- **Catppuccin** — Latte (light) + Mocha (dark). Toggle with the sun/moon or `t`.
  Choice + last-viewed sheet persist in `localStorage`.
- **Syntax highlighting** — `highlight.js` Rust grammar mapped onto Catppuccin.

## Run

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview    # serve the build
```

## Keybindings

| Key | Action |
| --- | --- |
| `/` | Focus search |
| `Enter` / `n` | Next match |
| `Shift+Enter` / `N` | Previous match |
| `j` / `k` | Scroll down / up |
| `d` / `u` | Half page down / up |
| `gg` / `G` | Top / bottom |
| `[` / `]` | Previous / next cheatsheet |
| `t` | Toggle theme |
| `?` | Toggle help |
| `Esc` | Blur search / close help |

## Adding a cheatsheet

Cheatsheets are plain data — no wiring needed. Drop a new `*.js` file into
`src/data/cheatsheets/` that default-exports an object. It's auto-discovered
(via `import.meta.glob`) and shows up in the sidebar.

```js
// src/data/cheatsheets/14-my-topic.js
export default {
  id: "my-topic",          // unique, url-friendly
  title: "My Topic",       // sidebar + heading
  icon: "⚡",               // any emoji
  group: "Algorithms",     // sidebar section (existing or new)
  order: 14,               // sort order within the app
  description: "One-line summary shown under the title.",
  cards: [
    {
      title: "A card title",
      note: "optional intro text (e.g. a `use` line)",
      items: [
        { desc: "What this does (supports `inline code`)", code: `let x = 1;` },
        { desc: "Another snippet", code: `let y = 2;` },
      ],
    },
  ],
};
```

**Fields**

- `id` `title` `icon` `group` `order` — metadata.
- `description` — optional subtitle.
- `cards[]` — each renders as a card.
  - `title` — card header.
  - `note` — optional text under the header.
  - `items[]` — `{ desc, code }`. `desc` supports \`inline code\`; `code` is
    highlighted as Rust.

## Adding content to an existing cheatsheet

Open the matching file in `src/data/cheatsheets/` and add a card to `cards[]`
or an entry to an existing card's `items[]`. Save — Vite hot-reloads it.

## Groups

Sidebar sections come from each sheet's `group`. Current groups: **Language**,
**Collections**, **Algorithms**, **I/O & Misc**. Use a new string to create a
new section.

## Project layout

```
src/
  data/
    index.js               auto-discovery of cheatsheets
    cheatsheets/*.js        <- your content lives here
  components/               Header, Sidebar, Sheet, Card, CodeBlock, HelpOverlay
  hooks/                    useTheme, useSearch (CSS Highlight API), useVimKeys
  index.css                Catppuccin palettes + globals
  App.css / App.jsx
```
