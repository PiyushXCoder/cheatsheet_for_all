// Build-time SEO / LLM assets: robots.txt, sitemap.xml, llms.txt, llms-full.txt.
// Runs before `vite build` (see package.json). Reads cheatsheet + practice data
// straight from src/ so the outputs always match the app content.
//
// Site origin comes from SITE_URL, else Vercel's deploy URL, else a default.
// Set SITE_URL in the Vercel project to your custom domain for correct links.

import { readdir, writeFile, mkdir, stat } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHEETS_DIR = join(ROOT, "src/data/cheatsheets");
const PUBLIC = join(ROOT, "public");

const SITE = (
  process.env.SITE_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "https://cheatsheet-for-all.vercel.app"
).replace(/\/$/, "");

const LANG_LABELS = {
  rust: "Rust",
  cpp: "C++",
  lua: "Lua",
  python: "Python",
  java: "Java",
};

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

const isoDate = (ts) => {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

async function loadSheets() {
  const files = await walk(SHEETS_DIR);
  const sheets = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(f).href);
    if (mod.default) {
      const { mtimeMs } = await stat(f);
      sheets.push({ ...mod.default, lang: mod.default.lang || "rust", mtimeMs: mtimeMs ?? Date.now() });
    }
  }
  sheets.sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title),
  );
  return sheets;
}

const xmlEscape = (s) =>
  String(s).replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );

const stripTicks = (s) => String(s ?? "").replace(/`/g, "");

function buildSitemap(sheets) {
  const now = isoDate(Date.now());
  const urls = {};
  urls[`${SITE}/`] = { lastmod: now, priority: "1.0" };
  urls[`${SITE}/privacy`] = { lastmod: now, priority: "0.3" };
  urls[`${SITE}/terms`] = { lastmod: now, priority: "0.3" };
  for (const s of sheets) {
    urls[`${SITE}/?lang=${s.lang}&page=${s.id}`] = { lastmod: isoDate(s.mtimeMs ?? Date.now()), priority: "0.8" };
  }
  for (const lang of Object.keys(LANG_LABELS)) {
    urls[`${SITE}/?lang=${lang}`] = { lastmod: now, priority: "0.6" };
  }
  const body = Object.entries(urls)
    .map(([u, meta]) => `  <url>\n    <loc>${xmlEscape(u)}</loc>\n    <lastmod>${meta.lastmod}</lastmod>\n    <priority>${meta.priority}</priority>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

function buildLlmsIndex(sheets) {
  const byLang = {};
  for (const s of sheets) (byLang[s.lang] ||= []).push(s);
  let out = `# Cheatsheet for all\n\n`;
  out += `> Fast, searchable Data Structures & Algorithms (DSA) cheatsheets for competitive programming and LeetCode, across Rust, C++, Lua, Python, and Java. Copyable code snippets grouped by topic.\n\n`;
  out += `Full plain-text content: ${SITE}/llms-full.txt\n\n`;
  for (const [lang, list] of Object.entries(byLang)) {
    out += `## ${LANG_LABELS[lang] || lang}\n\n`;
    for (const s of list) {
      const desc = stripTicks(s.description) ? `: ${stripTicks(s.description)}` : "";
      out += `- [${s.title}](${SITE}/?lang=${lang}&page=${s.id})${desc}\n`;
    }
    out += `\n`;
  }
  return out;
}

function buildLlmsFull(sheets) {
  let out = `# Cheatsheet for all — full content\n\n`;
  out += `DSA cheatsheets across Rust, C++, Lua, Python, and Java. Source: ${SITE}\n\n`;
  const byLang = {};
  for (const s of sheets) (byLang[s.lang] ||= []).push(s);
  for (const [lang, list] of Object.entries(byLang)) {
    out += `\n${"=".repeat(60)}\n# ${LANG_LABELS[lang] || lang}\n${"=".repeat(60)}\n`;
    for (const s of list) {
      out += `\n## ${stripTicks(s.title)}\n`;
      if (s.description) out += `${stripTicks(s.description)}\n`;
      for (const card of s.cards ?? []) {
        out += `\n### ${stripTicks(card.title)}\n`;
        if (card.note) out += `${stripTicks(card.note)}\n`;
        for (const it of card.items ?? []) {
          out += `- ${stripTicks(it.desc)}\n`;
          if (it.code) out += "```\n" + it.code + "\n```\n";
        }
      }
    }
  }
  return out;
}

const sheets = await loadSheets();
await mkdir(PUBLIC, { recursive: true });
await Promise.all([
  writeFile(join(PUBLIC, "robots.txt"), buildRobots()),
  writeFile(join(PUBLIC, "sitemap.xml"), buildSitemap(sheets)),
  writeFile(join(PUBLIC, "llms.txt"), buildLlmsIndex(sheets)),
  writeFile(join(PUBLIC, "llms-full.txt"), buildLlmsFull(sheets)),
]);
console.log(
  `[gen-seo] ${sheets.length} sheets -> robots.txt, sitemap.xml, llms.txt, llms-full.txt (site: ${SITE})`,
);
