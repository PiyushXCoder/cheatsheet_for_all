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
            <span className="act-kicker">the DSA cheatsheet</span>
            <h1 className="act-title">
              Stop<br />
              <span className="act-shape">memorising.</span>
            </h1>
            <p className="act-lead">
              Every data structure &amp; algorithm — copy-ready code, in the
              language you're already in.
            </p>
          </div>

          {/* Act 1 — copy-ready snippet */}
          <div className="act" data-start="0.14" data-end="0.36">
            <span className="act-num">01 · copy-ready</span>
            <h2 className="act-h">Grab the snippet</h2>
            <div className="voyage-viz">
              <div className="viz-code">
                <div className="code-head">
                  <span className="code-dot r" />
                  <span className="code-dot y" />
                  <span className="code-dot g" />
                  <span className="code-file">vec.rs</span>
                  <span className="code-copy">⧉ copy</span>
                </div>
                <div className="code-body">
                  <span className="tok-kw">let mut</span> v ={" "}
                  <span className="tok-mac">vec!</span>[<span className="tok-num">1</span>,{" "}
                  <span className="tok-num">2</span>, <span className="tok-num">3</span>];{"\n"}
                  v.<span className="tok-fn">push</span>(<span className="tok-num">4</span>);{"\n"}
                  <span className="tok-kw">let</span> sum = v.<span className="tok-fn">iter</span>().
                  <span className="tok-fn">sum</span>{"::<i32>()"};
                </div>
              </div>
              <code className="viz-cap">one click, every topic — no boilerplate hunting</code>
            </div>
          </div>

          {/* Act 2 — every language */}
          <div className="act" data-start="0.34" data-end="0.56">
            <span className="act-num">02 · polyglot</span>
            <h2 className="act-h">In your language</h2>
            <div className="voyage-viz">
              <div className="viz-langs">
                <div className="lang-line">
                  <span className="lang-tag rs">Rust</span>
                  <code>nums.<span className="tok-fn">iter</span>().<span className="tok-fn">rev</span>()</code>
                </div>
                <div className="lang-line">
                  <span className="lang-tag py">Python</span>
                  <code>nums[<span className="tok-num">::-1</span>]</code>
                </div>
                <div className="lang-line">
                  <span className="lang-tag cpp">C++</span>
                  <code><span className="tok-fn">reverse</span>(v.<span className="tok-fn">begin</span>(), v.<span className="tok-fn">end</span>())</code>
                </div>
              </div>
              <code className="viz-cap">Rust · C++ · Python · Java · Lua — idiomatic in each</code>
            </div>
          </div>

          {/* Act 3 — search */}
          <div className="act" data-start="0.54" data-end="0.76">
            <span className="act-num">03 · instant</span>
            <h2 className="act-h">Find it fast</h2>
            <div className="voyage-viz">
              <div className="viz-search">
                <div className="search-mock">
                  <span className="search-ic"><Icon name="search" size={16} /></span>
                  <span className="search-q">binary<span className="search-cur" /></span>
                  <span className="search-re">.*</span>
                </div>
                <div className="search-res">
                  <div className="search-hit"><mark>binary</mark>_search(&amp;arr, x)</div>
                  <div className="search-hit"><mark>Binary</mark>Heap::new()</div>
                  <div className="search-hit">to_<mark>binary</mark>_string(n)</div>
                </div>
              </div>
              <code className="viz-cap">regex search + Vim keys — jump to any snippet</code>
            </div>
          </div>

          {/* Act 4 — practice tracker */}
          <div className="act" data-start="0.74" data-end="0.9">
            <span className="act-num">04 · practice</span>
            <h2 className="act-h">Track the 150</h2>
            <div className="voyage-viz">
              <div className="viz-check">
                <div className="check-row done"><span className="check-box" />Two Sum</div>
                <div className="check-row done"><span className="check-box" />Valid Parentheses</div>
                <div className="check-row done"><span className="check-box" />Merge Two Sorted Lists</div>
                <div className="check-row"><span className="check-box" />LRU Cache</div>
                <div className="check-row"><span className="check-box" />Word Ladder</div>
                <div className="prog">
                  <div className="prog-bar" />
                  <span className="prog-num">72 / 150 solved</span>
                </div>
              </div>
              <code className="viz-cap">top 150 LeetCode — synced across your devices</code>
            </div>
          </div>

          {/* Act 5 — arrival */}
          <div className="act act-final" data-start="0.9" data-end="1">
            <span className="act-num">05 · open the sheet</span>
            <h2 className="act-title act-title-sm">Start here.</h2>
            <p className="act-lead">Pick a language and copy what you need.</p>
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
