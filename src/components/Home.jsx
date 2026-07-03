import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/* Faint code tokens that drift behind the whole page (parallax field). */
const TOKENS = [
  { t: "[ ]", x: 6, y: 4, s: -0.12, size: 46, c: "mauve" },
  { t: "->", x: 84, y: 9, s: -0.22, size: 40, c: "blue" },
  { t: "O(1)", x: 70, y: 3, s: -0.08, size: 30, c: "green" },
  { t: "{ }", x: 14, y: 22, s: -0.3, size: 54, c: "peach" },
  { t: "0x1F", x: 90, y: 26, s: -0.16, size: 24, c: "teal" },
  { t: "//", x: 46, y: 15, s: -0.4, size: 38, c: "surface2" },
  { t: "O(n)", x: 4, y: 40, s: -0.2, size: 28, c: "pink" },
  { t: "==", x: 78, y: 44, s: -0.35, size: 44, c: "surface2" },
  { t: "∅", x: 30, y: 55, s: -0.14, size: 60, c: "red" },
  { t: "&mut", x: 60, y: 62, s: -0.26, size: 26, c: "yellow" },
  { t: "log n", x: 10, y: 70, s: -0.1, size: 30, c: "sapphire" },
  { t: "<T>", x: 86, y: 74, s: -0.32, size: 42, c: "mauve" },
  { t: "::", x: 40, y: 82, s: -0.18, size: 50, c: "surface2" },
  { t: "fn", x: 68, y: 88, s: -0.24, size: 34, c: "green" },
  { t: "[i]", x: 20, y: 92, s: -0.12, size: 30, c: "blue" },
];

export function Home({
  languages,
  onSelectLang,
  onSelectAll,
  onSelectPractice,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = root.closest(".main");
    if (!scroller) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reveal chapters as they scroll into view.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { root: scroller, threshold: 0.25 },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    if (reduce) return () => io.disconnect();

    // Parallax: translate every [data-speed] layer by scrollTop * speed.
    const layers = Array.from(root.querySelectorAll("[data-speed]"));
    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = scroller.scrollTop;
      for (const el of layers) {
        const sp = parseFloat(el.dataset.speed);
        el.style.transform = `translate3d(0, ${(y * sp).toFixed(2)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    apply();

    return () => {
      io.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="home" ref={rootRef}>
      {/* Drifting code-token field behind everything. */}
      <div className="home-field" aria-hidden="true">
        {TOKENS.map((tk, i) => (
          <span
            key={i}
            data-speed={tk.s}
            className="home-token"
            style={{
              left: `${tk.x}%`,
              top: `${tk.y}%`,
              fontSize: `${tk.size}px`,
              color: `var(--${tk.c})`,
            }}
          >
            {tk.t}
          </span>
        ))}
      </div>

      {/* ===== Chapter 00 — hero ===== */}
      <section className="ch ch-hero">
        <div className="ch-hero-inner" data-speed="0.15">
          <span className="ch-kicker">~/dsa — chapter 00</span>
          <h1 className="ch-hero-title">
            Data has a<br />
            <span className="ch-hero-shape">shape</span>
            <span className="ch-cursor" />
          </h1>
          <p className="ch-hero-sub">
            Every hard problem is just simple data in the wrong one. Learn the
            shapes, bend the problems. Here's the whole map — free, fast, and
            copy-ready across Rust, C++, Python, Java &amp; Lua.
          </p>
          <div className="ch-actions">
            <button className="home-cta" onClick={onSelectAll}>
              <Icon name="package" size={18} />
              Browse All Cheatsheets
            </button>
            <button
              className="home-cta home-cta-ghost"
              onClick={onSelectPractice}
            >
              <Icon name="target" size={18} />
              Start Practicing
            </button>
          </div>
        </div>
        <div className="ch-scroll-hint" aria-hidden="true">
          scroll ↓
        </div>
      </section>

      {/* ===== Chapter 01 — array ===== */}
      <section className="ch ch-split reveal">
        <div className="ch-copy">
          <span className="ch-num">01 · linear</span>
          <h2>The Array</h2>
          <p>
            Lay the data out contiguous and the machine hands you any element in
            a single step — <b>O(1)</b> access. No hunting, no pointers. This is
            where order begins.
          </p>
        </div>
        <div className="ch-viz" data-speed="0.06">
          <div className="viz-array">
            {[41, 8, 15, 4, 23, 16].map((v, i) => (
              <div className="viz-cell" key={i} style={{ "--d": `${i * 70}ms` }}>
                <span className="viz-idx">{i}</span>
                {v}
              </div>
            ))}
          </div>
          <code className="viz-cap">arr[3] // = 4, instantly</code>
        </div>
      </section>

      {/* ===== Chapter 02 — linked list ===== */}
      <section className="ch ch-split ch-rev reveal">
        <div className="ch-copy">
          <span className="ch-num">02 · linked</span>
          <h2>The List</h2>
          <p>
            Let each node point to the next and you trade instant access for
            effortless growth. Splice anywhere in constant time — but to find a
            thing you must walk. Time turns linear, <b>O(n)</b>.
          </p>
        </div>
        <div className="ch-viz" data-speed="0.1">
          <div className="viz-list">
            <span className="ll">head</span>
            <span className="ll-arrow">→</span>
            <span className="ll node">7</span>
            <span className="ll-arrow">→</span>
            <span className="ll node">3</span>
            <span className="ll-arrow">→</span>
            <span className="ll node">9</span>
            <span className="ll-arrow">→</span>
            <span className="ll null">∅</span>
          </div>
          <code className="viz-cap">node.next.next.val // = 3</code>
        </div>
      </section>

      {/* ===== Chapter 03 — tree ===== */}
      <section className="ch ch-split reveal">
        <div className="ch-copy">
          <span className="ch-num">03 · logarithmic</span>
          <h2>The Tree</h2>
          <p>
            Halve the search space, then halve it again. Depth grows like{" "}
            <b>log n</b> while the data explodes beneath it. Balance is
            everything — the whole game of fast lookups lives here.
          </p>
        </div>
        <div className="ch-viz" data-speed="0.08">
          <svg className="viz-svg" viewBox="0 0 280 190" role="img">
            <g className="viz-edge">
              <line x1="140" y1="28" x2="70" y2="90" />
              <line x1="140" y1="28" x2="210" y2="90" />
              <line x1="70" y1="90" x2="35" y2="152" />
              <line x1="70" y1="90" x2="105" y2="152" />
              <line x1="210" y1="90" x2="175" y2="152" />
              <line x1="210" y1="90" x2="245" y2="152" />
            </g>
            <g className="viz-node">
              <g className="root">
                <circle cx="140" cy="28" r="20" />
                <text x="140" y="34">50</text>
              </g>
              <g>
                <circle cx="70" cy="90" r="18" />
                <text x="70" y="95">30</text>
              </g>
              <g>
                <circle cx="210" cy="90" r="18" />
                <text x="210" y="95">70</text>
              </g>
              <circle cx="35" cy="152" r="15" />
              <text x="35" y="157">20</text>
              <circle cx="105" cy="152" r="15" />
              <text x="105" y="157">40</text>
              <circle cx="175" cy="152" r="15" />
              <text x="175" y="157">60</text>
              <circle cx="245" cy="152" r="15" />
              <text x="245" y="157">80</text>
            </g>
          </svg>
          <code className="viz-cap">search(60) // 3 hops, not 7</code>
        </div>
      </section>

      {/* ===== Chapter 04 — graph ===== */}
      <section className="ch ch-split ch-rev reveal">
        <div className="ch-copy">
          <span className="ch-num">04 · connected</span>
          <h2>The Graph</h2>
          <p>
            Now let anything point to anything. Cities, friends, dependencies,
            states. <b>BFS</b>, <b>DFS</b>, Dijkstra — the algorithms that walk
            the web and find the shortest way through the chaos.
          </p>
        </div>
        <div className="ch-viz" data-speed="0.12">
          <svg className="viz-svg" viewBox="0 0 280 190" role="img">
            <g className="viz-edge">
              <line x1="45" y1="60" x2="140" y2="30" />
              <line x1="140" y1="30" x2="235" y2="70" />
              <line x1="45" y1="60" x2="90" y2="150" />
              <line x1="90" y1="150" x2="200" y2="150" />
              <line x1="200" y1="150" x2="235" y2="70" />
              <line x1="140" y1="30" x2="90" y2="150" />
            </g>
            <g className="viz-edge on">
              <line x1="45" y1="60" x2="140" y2="30" />
              <line x1="140" y1="30" x2="235" y2="70" />
            </g>
            <g className="viz-node">
              <circle className="start" cx="45" cy="60" r="16" />
              <text x="45" y="65">A</text>
              <circle cx="140" cy="30" r="16" />
              <text x="140" y="35">B</text>
              <circle className="end" cx="235" cy="70" r="16" />
              <text x="235" y="75">C</text>
              <circle cx="90" cy="150" r="16" />
              <text x="90" y="155">D</text>
              <circle cx="200" cy="150" r="16" />
              <text x="200" y="155">E</text>
            </g>
          </svg>
          <code className="viz-cap">shortestPath(A, C) // A→B→C</code>
        </div>
      </section>

      {/* ===== Chapter 05 — call to action ===== */}
      <section className="ch ch-final reveal">
        <span className="ch-num">05 · you</span>
        <h2>Your move.</h2>
        <p className="ch-final-sub">
          You've seen the shapes. Pick a language and start reading, or jump
          straight into the problems.
        </p>
        <div className="home-langs">
          {languages.map((lang) => (
            <button
              key={lang.id}
              className="home-lang-btn"
              onClick={() => onSelectLang(lang.id)}
            >
              <Icon name={lang.icon} size={18} />
              {lang.label}
            </button>
          ))}
        </div>
        <div className="ch-actions">
          <button className="home-cta" onClick={onSelectAll}>
            <Icon name="package" size={18} />
            Browse All Cheatsheets
          </button>
          <button
            className="home-cta home-cta-ghost"
            onClick={onSelectPractice}
          >
            <Icon name="target" size={18} />
            Practice Top 150
          </button>
        </div>
      </section>

      {/* Google sign-in explainer — required by Google OAuth homepage review. */}
      <section className="home-google reveal">
        <div className="home-google-head">
          <Icon name="target" size={22} />
          <h2>Sign in with Google (optional)</h2>
        </div>
        <p className="home-google-lead">
          The app works fully without an account — your practice progress is
          saved locally in your browser. Signing in with Google is entirely
          optional and lets you sync that progress across your devices.
        </p>

        <div className="home-google-grid">
          <div className="home-google-card">
            <h3>What we access</h3>
            <ul>
              <li>
                <strong>Your name, email &amp; profile picture</strong> — shown
                in the app so you know which account is signed in.
              </li>
              <li>
                <strong>A private Google Drive AppData folder</strong> — a
                hidden folder, accessible only to this app, where your practice
                progress is stored.
              </li>
            </ul>
          </div>
          <div className="home-google-card">
            <h3>How we use it</h3>
            <ul>
              <li>
                Data is used <strong>only</strong> to display your account and
                restore your practice progress when you return.
              </li>
              <li>
                We never read your other Drive files, and we do not sell, share,
                or use your data for advertising, analytics, or tracking.
              </li>
            </ul>
          </div>
        </div>

        <p className="home-google-note">
          You can revoke access anytime from your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
          >
            Google Account permissions
          </a>{" "}
          page, or reset your data from the{" "}
          <button className="home-inline-link" onClick={onSelectPractice}>
            Practice
          </button>{" "}
          page.
        </p>
      </section>

      <footer className="home-footer">
        <a className="home-inline-link" href="/privacy">
          Privacy Policy
        </a>
        <span className="home-footer-sep">·</span>
        <a className="home-inline-link" href="/terms">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
