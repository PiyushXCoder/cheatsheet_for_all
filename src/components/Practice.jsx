import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PRACTICE_GROUPS,
  PRACTICE_QUESTIONS,
  PRACTICE_TOTAL,
} from "../data/practice";
import { useGoogleDrive } from "../hooks/GoogleDriveContext";

export function Practice() {
  const { isLoggedIn, loadPracticeData, savePracticeData } = useGoogleDrive();
  const [done, setDone] = useState({});
  const [loading, setLoading] = useState(true);

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

  const reset = useCallback(() => {
    if (confirm("Clear all practice progress?")) {
      const next = {};
      setDone(next);
      savePracticeData(next);
    }
  }, [savePracticeData]);

  const solved = useMemo(
    () => PRACTICE_QUESTIONS.filter((q) => done[q.slug]).length,
    [done],
  );
  const pct = Math.round((solved / PRACTICE_TOTAL) * 100);

  if (loading) {
    return (
      <div className="practice">
        <p className="practice-sub" style={{ marginTop: 24 }}>Loading progress...</p>
      </div>
    );
  }

  let n = 0;

  return (
    <div className="practice">
      <div className="practice-head">
        <div>
          <h1>Practice · Top {PRACTICE_TOTAL} LeetCode</h1>
          <p className="practice-sub">
            Check off problems as you solve them — saved {isLoggedIn ? "to Google Drive" : "in your browser"}.
          </p>
        </div>
        <button className="practice-reset" onClick={reset}>
          Reset
        </button>
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
              {g.items.map(([title, slug, difficulty]) => {
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
                      href={`https://leetcode.com/problems/${slug}/`}
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
    </div>
  );
}
