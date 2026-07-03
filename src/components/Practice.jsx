import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PRACTICE_GROUPS,
  PRACTICE_QUESTIONS,
  PRACTICE_TOTAL,
} from "../data/practice";
import { useAuth } from "../hooks/AuthContext";
import { useDialog } from "./ConfirmDialog";

const TRUTHY = new Set(["yes", "true", "1", "done", "y", "x"]);

// Quote a CSV cell if it contains a comma, quote, or newline.
const csvCell = (s) =>
  /[",\r\n]/.test(s) ? `"${String(s).replace(/"/g, '""')}"` : String(s);

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

export function Practice() {
  const { isLoggedIn, loadPracticeData, savePracticeData, notify } = useAuth();
  const [done, setDone] = useState({});
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);
  const { dialog, confirm } = useDialog();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPracticeData().then((data) => {
      if (!cancelled) {
        setDone(data || {});
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [isLoggedIn, loadPracticeData]);

  const toggle = useCallback(
    (slug) => {
      setDone((prev) => {
        const next = { ...prev };
        if (next[slug]) delete next[slug];
        else next[slug] = true;
        savePracticeData(next);
        return next;
      });
    },
    [savePracticeData],
  );

  const reset = useCallback(async () => {
    const ok = await confirm({
      title: "Clear progress",
      message: "Clear all practice progress? This cannot be undone.",
      confirmLabel: "Clear",
      danger: true,
    });
    if (ok) {
      const next = {};
      setDone(next);
      savePracticeData(next);
    }
  }, [confirm, savePracticeData]);

  const exportCsv = useCallback(() => {
    const rows = [["Group", "Title", "Slug", "Difficulty", "Done"]];
    for (const g of PRACTICE_GROUPS) {
      for (const [title, slug, difficulty] of g.items) {
        rows.push([g.name, title, slug, difficulty, done[slug] ? "yes" : "no"]);
      }
    }
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "practice-progress.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [done]);

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
        if (si < 0 || di < 0) {
          notify("Invalid CSV: the file must have 'Slug' and 'Done' columns.");
          return;
        }
        const ok = await confirm({
          title: "Import progress",
          message: "Import will replace your current progress. Continue?",
          confirmLabel: "Import",
        });
        if (!ok) return;
        const valid = new Set(PRACTICE_QUESTIONS.map((q) => q.slug));
        const next = {};
        for (const r of rows.slice(1)) {
          const slug = (r[si] || "").trim();
          const mark = (r[di] || "").trim().toLowerCase();
          if (valid.has(slug) && TRUTHY.has(mark)) next[slug] = true;
        }
        setDone(next);
        savePracticeData(next);
        notify(`Imported progress — ${Object.keys(next).length} solved.`, "info");
      } catch {
        notify("Could not read that CSV file.");
      }
    },
    [confirm, notify, savePracticeData],
  );

  const solved = useMemo(
    () => PRACTICE_QUESTIONS.filter((q) => done[q.slug]).length,
    [done],
  );
  const pct = Math.round((solved / PRACTICE_TOTAL) * 100);

  if (loading) {
    return <PracticeSkeleton />;
  }

  let n = 0;

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

      {PRACTICE_GROUPS.map((g) => {
        const groupDone = g.items.filter(([, slug]) => done[slug]).length;
        return (
          <section className="practice-group" key={g.name}>
            <h2>
              {g.name}
              <span className="practice-group-count">
                {groupDone}/{g.items.length}
              </span>
            </h2>
            <ul className="practice-list">
              {g.items.map(([title, slug, difficulty, url]) => {
                n += 1;
                const isDone = !!done[slug];
                return (
                  <li
                    key={slug}
                    className={"practice-row" + (isDone ? " done" : "")}
                  >
                    <label className="practice-check">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(slug)}
                      />
                      <span className="practice-box" />
                    </label>
                    <span className="practice-num">{n}</span>
                    <a
                      className="practice-title"
                      href={url ?? `https://leetcode.com/problems/${slug}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {title}
                    </a>
                    <span
                      className={"practice-diff " + difficulty.toLowerCase()}
                    >
                      {difficulty}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {dialog}
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
