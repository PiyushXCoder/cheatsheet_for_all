import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

export function Home({
  languages,
  onSelectLang,
  onSelectAll,
  onSelectPractice,
}) {
  const rootRef = useRef(null);
  const voyageRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const voyage = voyageRef.current;
    const stage = stageRef.current;
    if (!root || !voyage || !stage) return;
    const scroller = root.closest(".main");
    if (!scroller) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reveal for the calmer sections after the voyage (langs, google, footer).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { root: scroller, threshold: 0.2 },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    if (reduce) {
      root.classList.add("boat-static");
      return () => io.disconnect();
    }

    const acts = Array.from(stage.querySelectorAll(".act"));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // Pin the stage to exactly one scrollport and give the voyage a tall
    // scroll runway so we get a long scrubbable range.
    const RUNWAY = 4.6; // scrollports of scrubbing
    const sizeStage = () => {
      const vh = scroller.clientHeight;
      voyage.style.setProperty("--vh", `${vh}px`);
      voyage.style.height = `${vh * RUNWAY}px`;
    };
    sizeStage();

    // Scroll scrubbing: derive progress p (0..1) from how far the voyage has
    // scrolled through its runway, then fade/scrub each act by its window.
    const update = () => {
      const vr = voyage.getBoundingClientRect();
      const sr = scroller.getBoundingClientRect();
      const scrolled = sr.top - vr.top;
      const total = vr.height - scroller.clientHeight;
      const p = clamp(total > 0 ? scrolled / total : 0, 0, 1);
      progressRef.current = p;
      stage.style.setProperty("--p", p.toFixed(4));

      for (const act of acts) {
        const a = parseFloat(act.dataset.start);
        const b = parseFloat(act.dataset.end);
        let op = 0;
        let local = 0;
        if (p >= a && p <= b) {
          local = (p - a) / (b - a);
          const fIn = 0.22;
          const fOut = 0.22;
          if (a > 0.001 && local < fIn) op = local / fIn;
          else if (b < 0.999 && local > 1 - fOut) op = (1 - local) / fOut;
          else op = 1;
        } else if (p > b) {
          local = 1;
          op = b >= 0.999 ? 1 : 0;
        }
        act.style.opacity = op.toFixed(3);
        act.style.setProperty("--local", local.toFixed(4));
        act.style.pointerEvents = op > 0.5 ? "auto" : "none";
      }
    };

    let rafScroll = 0;
    const onScroll = () => {
      if (!rafScroll) rafScroll = requestAnimationFrame(() => {
        rafScroll = 0;
        update();
      });
    };

    // Ambient wind-blown particle field on canvas.
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const COLORS = ["203,166,247", "137,180,250", "245,194,231", "230,230,245"];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let parts = [];
    const seed = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const n = Math.round(clamp((w * h) / 22000, 40, 110));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        vx: 0.2 + Math.random() * 0.9,
        vy: -0.25 + Math.random() * 0.5,
        a: 0.15 + Math.random() * 0.5,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };
    seed();

    let rafLoop = 0;
    let running = true;
    const draw = () => {
      if (!running) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Wind picks up through the middle of the voyage (the "storm").
      const p = progressRef.current;
      const gust = 0.5 + Math.sin(p * Math.PI) * 1.6;
      for (const pt of parts) {
        pt.x += pt.vx * gust;
        pt.y += pt.vy * gust;
        if (pt.x > w + 4) pt.x = -4;
        if (pt.y < -4) pt.y = h + 4;
        else if (pt.y > h + 4) pt.y = -4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, 6.283);
        ctx.fillStyle = `rgba(${pt.c},${pt.a})`;
        ctx.fill();
      }
      rafLoop = requestAnimationFrame(draw);
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeStage();
      seed();
      update();
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (rafLoop) cancelAnimationFrame(rafLoop);
      } else if (!running) {
        running = true;
        rafLoop = requestAnimationFrame(draw);
      }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    update();
    rafLoop = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafScroll) cancelAnimationFrame(rafScroll);
      if (rafLoop) cancelAnimationFrame(rafLoop);
      running = false;
    };
  }, []);

  return (
    <div className="home boat" ref={rootRef}>
      {/* ===== The scroll-scrubbed voyage ===== */}
      <section className="voyage" ref={voyageRef}>
        <div className="voyage-stage" ref={stageRef}>
          <canvas className="voyage-particles" ref={canvasRef} aria-hidden="true" />
          <div className="voyage-bg" aria-hidden="true" />
          <div className="voyage-vignette" aria-hidden="true" />

          <div className="voyage-rail" aria-hidden="true">
            <span className="voyage-rail-fill" />
          </div>

          {/* Act 0 — opening */}
          <div className="act act-open" data-start="0" data-end="0.16">
            <span className="act-kicker">a voyage through data</span>
            <h1 className="act-title">
              Every problem<br />
              is a <span className="act-shape">shape.</span>
            </h1>
            <p className="act-lead">
              Learn the shapes. Bend the problems.
            </p>
          </div>

          {/* Act 1 — array */}
          <div className="act" data-start="0.14" data-end="0.36">
            <span className="act-num">01 · linear</span>
            <h2 className="act-h">The Array</h2>
            <div className="voyage-viz">
              <div className="viz-array">
                {[41, 8, 15, 4, 23, 16].map((v, i) => (
                  <div className="viz-cell" key={i}>
                    <span className="viz-idx">{i}</span>
                    {v}
                  </div>
                ))}
              </div>
              <code className="viz-cap">arr[3] // = 4, in one step · O(1)</code>
            </div>
          </div>

          {/* Act 2 — linked list */}
          <div className="act" data-start="0.34" data-end="0.56">
            <span className="act-num">02 · linked</span>
            <h2 className="act-h">The List</h2>
            <div className="voyage-viz">
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
              <code className="viz-cap">walk to find · O(n)</code>
            </div>
          </div>

          {/* Act 3 — tree */}
          <div className="act" data-start="0.54" data-end="0.76">
            <span className="act-num">03 · logarithmic</span>
            <h2 className="act-h">The Tree</h2>
            <div className="voyage-viz">
              <svg className="viz-svg" viewBox="0 0 280 190" role="img">
                <g className="viz-edge draw">
                  <line pathLength="1" x1="140" y1="28" x2="70" y2="90" />
                  <line pathLength="1" x1="140" y1="28" x2="210" y2="90" />
                  <line pathLength="1" x1="70" y1="90" x2="35" y2="152" />
                  <line pathLength="1" x1="70" y1="90" x2="105" y2="152" />
                  <line pathLength="1" x1="210" y1="90" x2="175" y2="152" />
                  <line pathLength="1" x1="210" y1="90" x2="245" y2="152" />
                </g>
                <g className="viz-node">
                  <g className="root"><circle cx="140" cy="28" r="20" /><text x="140" y="34">50</text></g>
                  <circle cx="70" cy="90" r="18" /><text x="70" y="95">30</text>
                  <circle cx="210" cy="90" r="18" /><text x="210" y="95">70</text>
                  <circle cx="35" cy="152" r="15" /><text x="35" y="157">20</text>
                  <circle cx="105" cy="152" r="15" /><text x="105" y="157">40</text>
                  <circle cx="175" cy="152" r="15" /><text x="175" y="157">60</text>
                  <circle cx="245" cy="152" r="15" /><text x="245" y="157">80</text>
                </g>
              </svg>
              <code className="viz-cap">search(60) // 3 hops · O(log n)</code>
            </div>
          </div>

          {/* Act 4 — graph */}
          <div className="act" data-start="0.74" data-end="0.9">
            <span className="act-num">04 · connected</span>
            <h2 className="act-h">The Graph</h2>
            <div className="voyage-viz">
              <svg className="viz-svg" viewBox="0 0 280 190" role="img">
                <g className="viz-edge">
                  <line x1="45" y1="60" x2="140" y2="30" />
                  <line x1="140" y1="30" x2="235" y2="70" />
                  <line x1="45" y1="60" x2="90" y2="150" />
                  <line x1="90" y1="150" x2="200" y2="150" />
                  <line x1="200" y1="150" x2="235" y2="70" />
                  <line x1="140" y1="30" x2="90" y2="150" />
                </g>
                <g className="viz-edge on draw">
                  <line pathLength="1" x1="45" y1="60" x2="140" y2="30" />
                  <line pathLength="1" x1="140" y1="30" x2="235" y2="70" />
                </g>
                <g className="viz-node">
                  <circle className="start" cx="45" cy="60" r="16" /><text x="45" y="65">A</text>
                  <circle cx="140" cy="30" r="16" /><text x="140" y="35">B</text>
                  <circle className="end" cx="235" cy="70" r="16" /><text x="235" y="75">C</text>
                  <circle cx="90" cy="150" r="16" /><text x="90" y="155">D</text>
                  <circle cx="200" cy="150" r="16" /><text x="200" y="155">E</text>
                </g>
              </svg>
              <code className="viz-cap">shortestPath(A, C) // A→B→C</code>
            </div>
          </div>

          {/* Act 5 — arrival */}
          <div className="act act-final" data-start="0.9" data-end="1">
            <span className="act-num">05 · landfall</span>
            <h2 className="act-title act-title-sm">Your move.</h2>
            <p className="act-lead">You've seen the shapes. Now go bend them.</p>
            <div className="act-down" aria-hidden="true">↓</div>
          </div>

          <div className="voyage-hint" aria-hidden="true">scroll ↓</div>
        </div>
      </section>

      {/* ===== Calm harbour: the actual controls ===== */}
      <section className="home-landing reveal">
        <span className="ch-num">choose your language</span>
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
          <button className="home-cta home-cta-ghost" onClick={onSelectPractice}>
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
