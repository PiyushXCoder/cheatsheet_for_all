import { useLayoutEffect, useRef, useState } from "react";
import { Card } from "./Card";

const GAP = 14;
const MIN_COL = 340;

// Distributes cards into N equal-width flex columns (N chosen to fill the
// available width, capped at the card count so no column is ever empty).
// Cards are placed greedily into the currently-shortest column, estimating
// height from item count — fills horizontally AND packs vertically.
export function Masonry({ cards, lang }) {
  const ref = useRef(null);
  const [cols, setCols] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const fit = Math.max(1, Math.floor((w + GAP) / (MIN_COL + GAP)));
      setCols(Math.max(1, Math.min(fit, cards.length)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cards.length]);

  const columns = Array.from({ length: cols }, () => ({ items: [], h: 0 }));
  cards.forEach((c, i) => {
    const weight = (c.items?.length || 1) + (c.note ? 1 : 0) + 1;
    const target = columns.reduce((a, b) => (b.h < a.h ? b : a));
    target.items.push({ c, i });
    target.h += weight;
  });

  return (
    <div className="masonry" ref={ref}>
      {columns.map((col, ci) => (
        <div className="mcol" key={ci}>
          {col.items.map(({ c, i }) => (
            <Card card={c} lang={lang} key={i} />
          ))}
        </div>
      ))}
    </div>
  );
}
