import { useCallback, useEffect, useRef, useState } from "react";

const supported = typeof CSS !== "undefined" && !!CSS.highlights;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Collect text nodes under `root` into one string + segment map so a
// match can span multiple nodes (e.g. syntax-highlighted code tokens).
function buildSegments(root) {
  const segs = [];
  let text = "";
  let acc = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.data) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest(".copy-btn"))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n;
  while ((n = walker.nextNode())) {
    segs.push({ node: n, start: acc, len: n.data.length });
    text += n.data + "\n"; // separator prevents cross-node false merges
    acc += n.data.length + 1;
  }
  return { segs, text };
}

function locate(segs, pos) {
  for (const seg of segs) {
    if (pos <= seg.start + seg.len)
      return { node: seg.node, offset: Math.max(0, pos - seg.start) };
  }
  const last = segs[segs.length - 1];
  return { node: last.node, offset: last.len };
}

/**
 * Regex/text search over the DOM inside `containerRef`, highlighting matches
 * with the CSS Custom Highlight API. `resetKey` forces a rebuild (e.g. on
 * sheet change). Returns count, active index, error, and next/prev navigation.
 */
export function useSearch(query, useRegex, containerRef, resetKey) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);
  const [error, setError] = useState(false);
  const rangesRef = useRef([]);

  // Rebuild all match ranges.
  useEffect(() => {
    if (!supported) return;
    CSS.highlights.delete("search-match");
    CSS.highlights.delete("search-active");
    rangesRef.current = [];
    setError(false);

    const root = containerRef.current;
    if (!root || !query) {
      setCount(0);
      setActive(0);
      return;
    }

    let re;
    try {
      const pattern = useRegex ? query : escapeRegex(query);
      re = new RegExp(pattern, "gi");
    } catch {
      setError(true);
      setCount(0);
      return;
    }

    // Defer to let the sheet render first.
    const id = requestAnimationFrame(() => {
      const { segs, text } = buildSegments(root);
      if (!segs.length) {
        setCount(0);
        return;
      }
      const ranges = [];
      let m;
      let guard = 0;
      while ((m = re.exec(text)) !== null) {
        if (m.index === re.lastIndex) re.lastIndex++; // zero-width guard
        if (m[0].length === 0) continue;
        const s = locate(segs, m.index);
        const e = locate(segs, m.index + m[0].length);
        const r = new Range();
        try {
          r.setStart(s.node, s.offset);
          r.setEnd(e.node, e.offset);
          ranges.push(r);
        } catch {
          /* skip malformed */
        }
        if (++guard > 5000) break;
      }
      rangesRef.current = ranges;
      setCount(ranges.length);
      setActive(0);
      if (ranges.length) {
        CSS.highlights.set("search-match", new Highlight(...ranges));
      }
    });
    return () => cancelAnimationFrame(id);
  }, [query, useRegex, resetKey, containerRef]);

  // Move the active highlight + scroll it into view.
  useEffect(() => {
    if (!supported) return;
    const ranges = rangesRef.current;
    if (!ranges.length) {
      CSS.highlights.delete("search-active");
      return;
    }
    const r = ranges[active];
    if (!r) return;
    CSS.highlights.set("search-active", new Highlight(r));
    const el = r.startContainer.parentElement;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [active, count]);

  const next = useCallback(() => {
    setActive((a) => (count ? (a + 1) % count : 0));
  }, [count]);

  const prev = useCallback(() => {
    setActive((a) => (count ? (a - 1 + count) % count : 0));
  }, [count]);

  return { count, active, error, next, prev, supported };
}
