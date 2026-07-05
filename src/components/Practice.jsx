import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PRACTICE_GROUPS,
  PRACTICE_QUESTIONS,
  PRACTICE_TOTAL,
} from "../data/practice";
import { useAuth } from "../hooks/AuthContext";
import { useDialog } from "./ConfirmDialog";
import { Select } from "./Select";

const SORT_OPTIONS = [
  { value: "group", label: "Study order" },
  { value: "difficulty", label: "Difficulty" },
  { value: "title", label: "Name (A–Z)" },
  { value: "status", label: "Unsolved first" },
];

// A mentor-style prompt that guides toward a solution instead of handing it over.
const buildAiPrompt = (q) =>
  `I'm working on the LeetCode problem "${q.title}" (${q.difficulty}).
${q.url}

Be my coding mentor — do NOT give the full solution up front. Guide me to solve it myself:
1. First ask what I've already tried and where I'm stuck.
2. Give one small hint at a time and wait for my reply before the next.
3. Nudge me toward the right pattern / data structure and the key insight.
4. Only after I've made an honest attempt, walk through the optimal approach, then its time and space complexity.

Keep hints short and Socratic. If I ask for the answer outright, give a stronger hint first before revealing any code.`;

const CHATGPT_URL = "https://chatgpt.com/?q=";

const TRUTHY = new Set(["yes", "true", "1", "done", "y", "x"]);
const DIFFS = ["Easy", "Medium", "Hard"];
const DIFF_RANK = { Easy: 0, Medium: 1, Hard: 2 };
// Stable 1-based problem number by slug (independent of filtering/sorting).
const NUM = Object.fromEntries(PRACTICE_QUESTIONS.map((q, i) => [q.slug, i + 1]));

// Quote a CSV cell if it contains a comma, quote, or newline.
const csvCell = (s) =>
  /[",\r\n]/.test(s) ? `"${String(s).replace(/"/g, '""')}"` : String(s);

// Progress is stored as a versioned blob so notes + revisit flags travel with
// the solved map. Legacy data (a flat {slug: true} map) is migrated on load.
function normalize(data) {
  if (!data || typeof data !== "object") return { done: {}, notes: {}, revisit: {} };
  if (data.v >= 2) {
    return {
      done: data.done || {},
      notes: data.notes || {},
      revisit: data.revisit || {},
    };
  }
  return { done: data, notes: {}, revisit: {} }; // legacy flat map
}

// Minimal RFC-4180-ish CSV parser (handles quotes, escaped quotes, CRLF).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else quoted = false;
      } else cur += c;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(cur); cur = "";
    } else if (c === "\n") {
      row.push(cur); rows.push(row); row = []; cur = "";
    } else if (c !== "\r") {
      cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

export function Practice({ onOpenWhiteboard }) {
  const { isLoggedIn, loadPracticeData, savePracticeData, notify } = useAuth();
  const [done, setDone] = useState({});
  const [notes, setNotes] = useState({}); // { slug: text }
  const [revisit, setRevisit] = useState({}); // { slug: true }
  const [openNotes, setOpenNotes] = useState(() => new Set()); // slugs with expanded note editor
  const [aiFor, setAiFor] = useState(null); // question object for the AI-guide popup
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);
  const { dialog, confirm } = useDialog();

  // filters + sorting
  const [search, setSearch] = useState("");
  const [diffSel, setDiffSel] = useState(() => new Set()); // empty = all
  const [status, setStatus] = useState("all"); // all | unsolved | solved
  const [revisitOnly, setRevisitOnly] = useState(false);
  const [sortBy, setSortBy] = useState("group"); // group | difficulty | title | status
  const [rand, setRand] = useState(null); // { pool: "unsolved"|"solved", slug } | null

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPracticeData().then((data) => {
      if (!cancelled) {
        const norm = normalize(data);
        setDone(norm.done);
        setNotes(norm.notes);
        setRevisit(norm.revisit);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [isLoggedIn, loadPracticeData]);

  // Persist all three maps together as one versioned blob.
  const persist = useCallback(
    (d, n, r) => savePracticeData({ v: 2, done: d, notes: n, revisit: r }),
    [savePracticeData],
  );

  const toggle = useCallback(
    (slug) => {
      setDone((prev) => {
        const next = { ...prev };
        if (next[slug]) delete next[slug];
        else next[slug] = true;
        persist(next, notes, revisit);
        return next;
      });
    },
    [persist, notes, revisit],
  );

  const toggleRevisit = useCallback(
    (slug) => {
      setRevisit((prev) => {
        const next = { ...prev };
        if (next[slug]) delete next[slug];
        else next[slug] = true;
        persist(done, notes, next);
        return next;
      });
    },
    [persist, done, notes],
  );

  const setNote = useCallback(
    (slug, text) => {
      setNotes((prev) => {
        const next = { ...prev };
        if (text.trim()) next[slug] = text;
        else delete next[slug];
        persist(done, next, revisit);
        return next;
      });
    },
    [persist, done, revisit],
  );

  const toggleNoteOpen = useCallback((slug) => {
    setOpenNotes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    const ok = await confirm({
      title: "Clear progress",
      message: "Clear all practice progress, notes and revisit flags? This cannot be undone.",
      confirmLabel: "Clear",
      danger: true,
    });
    if (ok) {
      setDone({});
      setNotes({});
      setRevisit({});
      setOpenNotes(new Set());
      persist({}, {}, {});
    }
  }, [confirm, persist]);

  const exportCsv = useCallback(() => {
    const rows = [["Group", "Title", "Slug", "Difficulty", "Done", "Revisit", "Note"]];
    for (const g of PRACTICE_GROUPS) {
      for (const [title, slug, difficulty] of g.items) {
        rows.push([
          g.name, title, slug, difficulty,
          done[slug] ? "yes" : "no",
          revisit[slug] ? "yes" : "no",
          notes[slug] || "",
        ]);
      }
    }
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "practice-progress.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [done, revisit, notes]);

  const importCsv = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // allow re-importing the same file
      if (!file) return;
      try {
        const rows = parseCsv(await file.text());
        if (!rows.length) throw new Error("empty");
        const header = rows[0].map((h) => h.trim().toLowerCase());
        const si = header.indexOf("slug");
        const di = header.indexOf("done");
        const ri = header.indexOf("revisit");
        const ni = header.indexOf("note");
        if (si < 0 || di < 0) {
          notify("Invalid CSV: the file must have 'Slug' and 'Done' columns.");
          return;
        }
        const ok = await confirm({
          title: "Import progress",
          message: "Import will replace your current progress, notes and revisit flags. Continue?",
          confirmLabel: "Import",
        });
        if (!ok) return;
        const valid = new Set(PRACTICE_QUESTIONS.map((q) => q.slug));
        const nextDone = {};
        const nextRevisit = {};
        const nextNotes = {};
        for (const r of rows.slice(1)) {
          const slug = (r[si] || "").trim();
          if (!valid.has(slug)) continue;
          if (TRUTHY.has((r[di] || "").trim().toLowerCase())) nextDone[slug] = true;
          if (ri >= 0 && TRUTHY.has((r[ri] || "").trim().toLowerCase())) nextRevisit[slug] = true;
          if (ni >= 0 && (r[ni] || "").trim()) nextNotes[slug] = r[ni];
        }
        setDone(nextDone);
        setRevisit(nextRevisit);
        setNotes(nextNotes);
        persist(nextDone, nextNotes, nextRevisit);
        notify(`Imported progress — ${Object.keys(nextDone).length} solved.`, "info");
      } catch {
        notify("Could not read that CSV file.");
      }
    },
    [confirm, notify, persist],
  );

  const solved = useMemo(
    () => PRACTICE_QUESTIONS.filter((q) => done[q.slug]).length,
    [done],
  );
  const pct = Math.round((solved / PRACTICE_TOTAL) * 100);

  const toggleDiff = useCallback((d) => {
    setRand(null);
    setDiffSel((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }, []);

  // does an item pass the difficulty + search filter (ignores status)?
  const inScope = useCallback(
    (q) => {
      if (revisitOnly && !revisit[q.slug]) return false;
      if (diffSel.size > 0 && !diffSel.has(q.difficulty)) return false;
      const s = search.trim().toLowerCase();
      if (s && !(q.title.toLowerCase().includes(s) || q.slug.includes(s))) return false;
      return true;
    },
    [revisitOnly, revisit, diffSel, search],
  );

  // full filter (adds the status filter)
  const matches = useCallback(
    (q) => {
      if (!inScope(q)) return false;
      if (status === "solved" && !done[q.slug]) return false;
      if (status === "unsolved" && done[q.slug]) return false;
      return true;
    },
    [inScope, status, done],
  );

  const filtered = useMemo(() => PRACTICE_QUESTIONS.filter(matches), [matches]);

  const flatSorted = useMemo(() => {
    const list = filtered.slice();
    if (sortBy === "difficulty") {
      list.sort((a, b) => DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty] || NUM[a.slug] - NUM[b.slug]);
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "status") {
      // unsolved first (actionable), then solved; stable within by number
      list.sort((a, b) => (!!done[a.slug] - !!done[b.slug]) || NUM[a.slug] - NUM[b.slug]);
    }
    return list;
  }, [filtered, sortBy, done]);

  // Toggle: pick one random problem from the given pool (within the difficulty
  // + search scope) and isolate it in the list. Re-clicking re-rolls.
  const pickRandom = useCallback(
    (poolName) => {
      const wantSolved = poolName === "solved";
      const pool = PRACTICE_QUESTIONS.filter((q) => inScope(q) && !!done[q.slug] === wantSolved);
      if (pool.length === 0) {
        notify(`No ${poolName} problems match the current filters.`, "info");
        return;
      }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setRand({ pool: poolName, slug: pick.slug });
    },
    [inScope, done, notify],
  );

  // Button toggles the pool off when it's already active; otherwise picks.
  const toggleRandom = useCallback(
    (poolName) => {
      if (rand?.pool === poolName) setRand(null);
      else pickRandom(poolName);
    },
    [rand, pickRandom],
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setDiffSel(new Set());
    setStatus("all");
    setRevisitOnly(false);
    setSortBy("group");
    setRand(null);
  }, []);

  const filtersActive =
    search.trim() !== "" || diffSel.size > 0 || status !== "all" || revisitOnly || sortBy !== "group";

  if (loading) {
    return <PracticeSkeleton />;
  }

  const renderRow = (q, picked = false) => {
    const isDone = !!done[q.slug];
    const flagged = !!revisit[q.slug];
    const hasNote = !!(notes[q.slug] && notes[q.slug].trim());
    const noteOpen = openNotes.has(q.slug);
    return (
      <li
        key={q.slug}
        className={
          "practice-row" +
          (isDone ? " done" : "") +
          (picked ? " picked" : "") +
          (flagged ? " revisit" : "")
        }
      >
        <label className="practice-check">
          <input type="checkbox" checked={isDone} onChange={() => toggle(q.slug)} />
          <span className="practice-box" />
        </label>
        <span className="practice-num">{NUM[q.slug]}</span>
        <a className="practice-title" href={q.url} target="_blank" rel="noreferrer">
          {q.title}
        </a>
        <span className={"practice-diff " + q.difficulty.toLowerCase()}>{q.difficulty}</span>
        <button
          type="button"
          className={"practice-revisit" + (flagged ? " on" : "")}
          onClick={() => toggleRevisit(q.slug)}
          aria-pressed={flagged}
          title={flagged ? "Marked to revisit" : "Mark to revisit"}
        >
          <span className="practice-btn-icon">↻</span>
          <span className="practice-btn-label">Revisit</span>
        </button>
        <button
          type="button"
          className={"practice-notebtn" + (hasNote ? " has" : "") + (noteOpen ? " on" : "")}
          onClick={() => toggleNoteOpen(q.slug)}
          aria-pressed={noteOpen}
          title={hasNote ? "Edit note" : "Add note"}
        >
          <span className="practice-btn-icon">📝</span>
          <span className="practice-btn-label">Note</span>
        </button>
        <button
          type="button"
          className="practice-ai"
          onClick={() => setAiFor(q)}
          title="Get an AI mentor prompt for this problem"
        >
          <span className="practice-btn-icon">🤖</span>
          <span className="practice-btn-label">AI help</span>
        </button>
        {noteOpen && (
          <div className="practice-note-wrap">
            <textarea
              className="practice-note"
              placeholder="Add a small note…"
              value={notes[q.slug] || ""}
              onChange={(e) => setNote(q.slug, e.target.value)}
              rows={2}
              autoFocus
            />
          </div>
        )}
      </li>
    );
  };

  const grouped = sortBy === "group";

  return (
    <div className="practice">
      <div className="practice-head">
        <div>
          <h1>Practice · Top {PRACTICE_TOTAL} LeetCode</h1>
          <p className="practice-sub">
            Check off problems as you solve them — saved {isLoggedIn ? "to your account" : "in your browser"}.
          </p>
        </div>
        <div className="practice-actions">
          {onOpenWhiteboard && (
            <button className="practice-tool" onClick={onOpenWhiteboard}>
              🖊 Whiteboard
            </button>
          )}
          <button className="practice-tool" onClick={exportCsv}>
            Export CSV
          </button>
          <button className="practice-tool" onClick={() => fileRef.current?.click()}>
            Import CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={importCsv}
          />
          <button className="practice-reset" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="practice-progress">
        <div className="practice-bar">
          <div className="practice-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="practice-count">
          {solved} / {PRACTICE_TOTAL} solved ({pct}%)
        </span>
      </div>

      {/* filters · sorting · random */}
      <div className="practice-toolbar">
        <input
          className="practice-search"
          type="search"
          placeholder="Filter by name…"
          value={search}
          onChange={(e) => { setRand(null); setSearch(e.target.value); }}
          aria-label="Filter problems by name"
        />

        <div className="practice-chips" role="group" aria-label="Filter by difficulty">
          {DIFFS.map((d) => (
            <button
              key={d}
              className={"practice-chip " + d.toLowerCase() + (diffSel.has(d) ? " on" : "")}
              onClick={() => toggleDiff(d)}
              aria-pressed={diffSel.has(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="practice-seg" role="group" aria-label="Filter by status">
          {[
            ["all", "All"],
            ["unsolved", "Unsolved"],
            ["solved", "Solved"],
          ].map(([val, label]) => (
            <button
              key={val}
              className={"practice-seg-btn" + (status === val ? " on" : "")}
              onClick={() => { setRand(null); setStatus(val); }}
              aria-pressed={status === val}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          className={"practice-revisit-filter" + (revisitOnly ? " on" : "")}
          onClick={() => { setRand(null); setRevisitOnly((v) => !v); }}
          aria-pressed={revisitOnly}
        >
          ↻ Revisit only
        </button>

        <div className="practice-sort">
          <span>Sort</span>
          <Select
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={(v) => { setRand(null); setSortBy(v); }}
            label="Sort problems"
          />
        </div>

        <div className="practice-rand">
          <button
            className={"practice-tool practice-randbtn" + (rand?.pool === "unsolved" ? " on" : "")}
            onClick={() => toggleRandom("unsolved")}
            aria-pressed={rand?.pool === "unsolved"}
          >
            🎲 Random unsolved
          </button>
          <button
            className={"practice-tool practice-randbtn" + (rand?.pool === "solved" ? " on" : "")}
            onClick={() => toggleRandom("solved")}
            aria-pressed={rand?.pool === "solved"}
          >
            🎲 Random solved
          </button>
        </div>

        {filtersActive && (
          <button className="practice-clear" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {rand ? (
        (() => {
          const q = PRACTICE_QUESTIONS.find((x) => x.slug === rand.slug);
          return (
            <>
              <div className="practice-randbar">
                <span className="practice-randbar-label">🎲 Random {rand.pool} pick</span>
                <button className="practice-tool" onClick={() => pickRandom(rand.pool)}>
                  🔄 Re-roll
                </button>
                <button className="practice-clear" onClick={() => setRand(null)}>
                  Show all
                </button>
              </div>
              {q ? (
                <ul className="practice-list practice-list-flat">{renderRow(q, true)}</ul>
              ) : (
                <p className="practice-empty">That pick is no longer available.</p>
              )}
            </>
          );
        })()
      ) : (
        <>
          {!grouped && (
            <div className="practice-showing">
              Showing {flatSorted.length} of {PRACTICE_TOTAL}
            </div>
          )}

          {grouped ? (
            filtered.length === 0 ? (
              <p className="practice-empty">No problems match your filters.</p>
            ) : (
              PRACTICE_GROUPS.map((g) => {
                const items = g.items
                  .map(([title, slug, difficulty, url]) => ({
                    title, slug, difficulty, url: url ?? `https://leetcode.com/problems/${slug}/`,
                  }))
                  .filter(matches);
                if (items.length === 0) return null;
                const groupDone = g.items.filter(([, slug]) => done[slug]).length;
                return (
                  <section className="practice-group" key={g.name}>
                    <h2>
                      {g.name}
                      <span className="practice-group-count">
                        {groupDone}/{g.items.length}
                      </span>
                    </h2>
                    <ul className="practice-list">{items.map((q) => renderRow(q))}</ul>
                  </section>
                );
              })
            )
          ) : flatSorted.length === 0 ? (
            <p className="practice-empty">No problems match your filters.</p>
          ) : (
            <ul className="practice-list practice-list-flat">
              {flatSorted.map((q) => renderRow(q))}
            </ul>
          )}
        </>
      )}
      {aiFor && (
        <AiGuideModal q={aiFor} onClose={() => setAiFor(null)} notify={notify} />
      )}
      {dialog}
    </div>
  );
}

// Popup showing a ready-to-use mentor prompt for a problem, with copy and
// open-in-ChatGPT actions.
function AiGuideModal({ q, onClose, notify }) {
  const prompt = buildAiPrompt(q);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      notify("Prompt copied to clipboard.", "info");
    } catch {
      notify("Couldn't copy — select the text and copy manually.");
    }
  };

  const openChatGpt = () => {
    window.open(CHATGPT_URL + encodeURIComponent(prompt), "_blank", "noopener");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal practice-ai-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`AI mentor prompt for ${q.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title">🤖 AI mentor · {q.title}</div>
        <p className="modal-message practice-ai-sub">
          A prompt that coaches you toward the solution — hints first, answer
          last. Copy it, or open it straight in ChatGPT.
        </p>
        <textarea
          className="practice-ai-text"
          readOnly
          value={prompt}
          rows={10}
          onFocus={(e) => e.target.select()}
        />
        <div className="modal-actions">
          <button className="modal-btn" onClick={onClose}>
            Close
          </button>
          <button className="modal-btn" onClick={copy}>
            Copy
          </button>
          <button className="modal-btn modal-btn-primary" onClick={openChatGpt}>
            Open in ChatGPT
          </button>
        </div>
      </div>
    </div>
  );
}

// Layout-matched placeholder shown while progress loads (from your account or local).
function PracticeSkeleton() {
  const groups = PRACTICE_GROUPS.slice(0, 4);
  return (
    <div className="practice practice-skeleton" aria-busy="true" aria-label="Loading practice progress">
      <div className="practice-head">
        <div style={{ flex: 1 }}>
          <span className="sk sk-title" />
          <span className="sk sk-sub" />
        </div>
        <span className="sk sk-reset" />
      </div>

      <div className="practice-progress">
        <span className="sk sk-bar" />
        <span className="sk sk-count" />
      </div>

      {groups.map((g, gi) => (
        <section className="practice-group" key={gi}>
          <span className="sk sk-group-title" />
          <ul className="practice-list">
            {Array.from({ length: Math.min(g.items.length, 6) }).map((_, i) => (
              <li className="practice-row" key={i}>
                <span className="sk sk-box" />
                <span className="sk sk-num" />
                <span className="sk sk-row-title" style={{ width: `${45 + ((i * 13) % 40)}%` }} />
                <span className="sk sk-diff" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
