import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/* Weather keyframes across the scroll (p = 0..1).
   ct/cm/cb = sky gradient stops (rgb triplets), g = glow colour,
   ga = glow alpha, gy = glow vertical %, gs = glow size %, storm = 0..1. */
const SKY = [
  { p: 0.0, ct: "42,26,58", cm: "58,40,52", cb: "26,18,40", g: "249,180,94", ga: 0.26, gy: 22, gs: 70, storm: 0.0 },
  { p: 0.2, ct: "42,20,64", cm: "61,26,77", cb: "26,14,46", g: "177,92,247", ga: 0.32, gy: 18, gs: 78, storm: 0.18 },
  { p: 0.42, ct: "13,20,36", cm: "20,30,56", cb: "9,15,30", g: "74,111,181", ga: 0.2, gy: 44, gs: 92, storm: 1.0 },
  { p: 0.6, ct: "19,15,37", cm: "29,23,53", cb: "13,10,29", g: "137,180,250", ga: 0.24, gy: 32, gs: 80, storm: 0.5 },
  { p: 0.8, ct: "27,18,49", cm: "44,29,64", cb: "18,12,34", g: "250,179,135", ga: 0.36, gy: 52, gs: 88, storm: 0.12 },
  { p: 1.0, ct: "60,44,82", cm: "74,46,74", cb: "32,21,46", g: "249,201,142", ga: 0.44, gy: 80, gs: 125, storm: 0.0 },
];

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

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Five seated monks around the lamp (nearer = larger/lower).
  const MONKS = [
    { x: 58, y: 276, s: 0.82 },
    { x: 124, y: 284, s: 0.98 },
    { x: 200, y: 252, s: 0.72 },
    { x: 278, y: 284, s: 0.98 },
    { x: 344, y: 276, s: 0.82 },
  ];

  useEffect(() => {
    const root = rootRef.current;
    const voyage = voyageRef.current;
    const stage = stageRef.current;
    if (!root || !voyage || !stage) return;
    const scroller = root.closest(".main");
    if (!scroller) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones: keep the story, but drop the battery/interaction hogs —
    // native scroll (no snap hijack), shorter runway, lighter canvas.
    const isMobile =
      window.matchMedia("(max-width: 760px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    // Full-viewport sizing for the top hero (and the pinned stage).
    const setVH = () => root.style.setProperty("--vh", `${scroller.clientHeight}px`);
    setVH();
    window.addEventListener("resize", setVH);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { root: scroller, threshold: 0.18 },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    if (reduce) {
      root.classList.add("boat-static");
      return () => {
        io.disconnect();
        window.removeEventListener("resize", setVH);
      };
    }

    const acts = Array.from(stage.querySelectorAll(".act"));
    const clock = stage.querySelector(".voyage-clock");
    const clockTime = stage.querySelector(".clock-time");
    const railDots = Array.from(stage.querySelectorAll(".rail-dot"));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const pad = (n) => String(n).padStart(2, "0");
    const lerp = (a, b, t) => a + (b - a) * t;
    const lerpRGB = (a, b, t) => {
      const A = a.split(",").map(Number);
      const B = b.split(",").map(Number);
      return `${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))}`;
    };

    // Interpolate the weather for a given progress p.
    const weatherAt = (p) => {
      let i = 0;
      while (i < SKY.length - 1 && p > SKY[i + 1].p) i++;
      const a = SKY[i];
      const b = SKY[Math.min(i + 1, SKY.length - 1)];
      const t = b.p === a.p ? 0 : clamp((p - a.p) / (b.p - a.p), 0, 1);
      return {
        ct: lerpRGB(a.ct, b.ct, t),
        cm: lerpRGB(a.cm, b.cm, t),
        cb: lerpRGB(a.cb, b.cb, t),
        g: lerpRGB(a.g, b.g, t),
        ga: lerp(a.ga, b.ga, t),
        gy: lerp(a.gy, b.gy, t),
        gs: lerp(a.gs, b.gs, t),
        storm: lerp(a.storm, b.storm, t),
      };
    };

    const RUNWAY = isMobile ? 4.2 : 6.2;
    const sizeStage = () => {
      const vh = scroller.clientHeight;
      voyage.style.setProperty("--vh", `${vh}px`);
      voyage.style.height = `${vh * RUNWAY}px`;
    };
    sizeStage();

    const update = () => {
      const vr = voyage.getBoundingClientRect();
      const sr = scroller.getBoundingClientRect();
      const total = vr.height - scroller.clientHeight;
      const p = clamp(total > 0 ? (sr.top - vr.top) / total : 0, 0, 1);
      progressRef.current = p;
      stage.style.setProperty("--p", p.toFixed(4));

      const w = weatherAt(p);
      stage.style.setProperty("--ct", w.ct);
      stage.style.setProperty("--cm", w.cm);
      stage.style.setProperty("--cb", w.cb);
      stage.style.setProperty("--g", w.g);
      stage.style.setProperty("--ga", w.ga.toFixed(3));
      stage.style.setProperty("--gy", `${w.gy.toFixed(1)}%`);
      stage.style.setProperty("--gs", `${w.gs.toFixed(1)}%`);

      // countdown clock — ticks down through the crisis, then "SAFE"
      if (clock && clockTime) {
        if (p < 0.12) {
          clock.style.opacity = "0";
        } else {
          clock.style.opacity = "1";
          if (p >= 0.85) {
            clock.classList.add("safe");
            clockTime.textContent = "SAFE";
          } else {
            clock.classList.remove("safe");
            const tt = clamp((p - 0.14) / (0.84 - 0.14), 0, 1);
            const secs = Math.max(0, Math.round(900 * (1 - tt)));
            clockTime.textContent = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
          }
        }
      }

      // chapter dots on the rail
      const scene = p < 0.14 ? 0 : p < 0.32 ? 1 : p < 0.5 ? 2 : p < 0.66 ? 3 : p < 0.86 ? 4 : 5;
      railDots.forEach((d, i) => d.classList.toggle("on", i === scene));

      for (const act of acts) {
        const a = parseFloat(act.dataset.start);
        const b = parseFloat(act.dataset.end);
        let op = 0;
        let local = 0;
        if (p >= a && p <= b) {
          local = (p - a) / (b - a);
          const f = 0.24;
          if (a > 0.001 && local < f) op = local / f;
          else if (b < 0.999 && local > 1 - f) op = (1 - local) / f;
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

    // Skip the top hero: a downward scroll off it eases to the story start,
    // an upward scroll eases back to the very top. The story below is
    // untouched and scrubs gradually. Only the hero behaves as a snap page.
    let lastTop = scroller.scrollTop;
    let snapping = false;
    let snapRaf = 0;
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeScrollTo = (target, duration) => {
      cancelAnimationFrame(snapRaf);
      const startPos = scroller.scrollTop;
      const dist = target - startPos;
      if (Math.abs(dist) < 1) return;
      let t0 = -1;
      const step = (ts) => {
        if (t0 < 0) t0 = ts;
        const t = Math.min(1, (ts - t0) / duration);
        scroller.scrollTop = startPos + dist * easeInOut(t);
        if (t < 1) {
          snapRaf = requestAnimationFrame(step);
        } else {
          snapping = false;
          lastTop = scroller.scrollTop;
        }
      };
      snapRaf = requestAnimationFrame(step);
    };
    const heroSkip = () => {
      if (snapping) return;
      const top = scroller.scrollTop;
      const dir = top - lastTop;
      lastTop = top;
      const vr = voyage.getBoundingClientRect();
      const sr = scroller.getBoundingClientRect();
      const storyTop = top + (vr.top - sr.top);
      if (top > 2 && top < storyTop - 2 && dir !== 0) {
        snapping = true;
        easeScrollTo(dir > 0 ? storyTop : 0, 620);
      }
    };

    let rafScroll = 0;
    const onScroll = () => {
      if (!isMobile) heroSkip();
      if (!rafScroll)
        rafScroll = requestAnimationFrame(() => {
          rafScroll = 0;
          update();
        });
    };

    // ---- weather particle field ----
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    let parts = [];
    let flash = 0;
    let flashCd = 60;

    const seed = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const n = isMobile
        ? Math.round(clamp((w * h) / 20000, 36, 80))
        : Math.round(clamp((w * h) / 12000, 70, 200));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        len: 0.5 + Math.random(),
        drift: Math.random() * 6.283,
        a: 0.2 + Math.random() * 0.55,
      }));
    };
    seed();

    let rafLoop = 0;
    let running = true;
    let stageVisible = true;
    const draw = () => {
      if (!running || !stageVisible) {
        rafLoop = 0;
        return;
      }
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const p = progressRef.current;
      const storm = weatherAt(p).storm;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // warm embers when calm → cold rain when stormy
      const tint = storm; // 0 warm, 1 cold
      const cr = Math.round(lerp(255, 150, tint));
      const cg = Math.round(lerp(196, 180, tint));
      const cb = Math.round(lerp(140, 240, tint));
      const vyBase = lerp(-0.55, 4.2, storm); // rise vs fall
      const vxBase = 0.25 + storm * 2.4;
      const streaky = storm > 0.45;

      for (const pt of parts) {
        pt.drift += 0.01;
        const vy = vyBase + (streaky ? 0 : Math.sin(pt.drift) * 0.3);
        const vx = vxBase * (streaky ? 1 : 0.4 + Math.cos(pt.drift) * 0.3);
        pt.x += vx;
        pt.y += vy;
        if (pt.x > w + 6) pt.x = -6;
        if (pt.x < -6) pt.x = w + 6;
        if (pt.y > h + 6) pt.y = -6;
        if (pt.y < -6) pt.y = h + 6;
        ctx.globalAlpha = pt.a * (streaky ? 0.9 : 1);
        ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        if (streaky) {
          const l = 4 + storm * 12 * pt.len;
          ctx.lineWidth = pt.r * 0.7;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt.x - vx * l * 0.4, pt.y - vy * l * 0.4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, 6.283);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // lightning during the storm
      if (storm > 0.55) {
        flashCd -= 1;
        if (flashCd <= 0 && Math.random() < 0.5) {
          flash = 0.5 + Math.random() * 0.4;
          flashCd = 40 + Math.floor(Math.random() * 90);
        }
      }
      if (flash > 0.01) {
        ctx.fillStyle = `rgba(220,225,255,${(flash * 0.18).toFixed(3)})`;
        ctx.fillRect(0, 0, w, h);
        flash *= 0.82;
      }
      rafLoop = requestAnimationFrame(draw);
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      sizeStage();
      seed();
      update();
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (rafLoop) cancelAnimationFrame(rafLoop);
        rafLoop = 0;
      } else if (!running) {
        running = true;
        if (stageVisible && !rafLoop) rafLoop = requestAnimationFrame(draw);
      }
    };

    // Stop the particle loop entirely once the story leaves the viewport.
    const stageIO = new IntersectionObserver(
      (entries) => {
        stageVisible = entries[0].isIntersecting;
        if (stageVisible && running && !rafLoop) rafLoop = requestAnimationFrame(draw);
      },
      { root: scroller },
    );
    stageIO.observe(stage);

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    update();
    rafLoop = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      stageIO.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", setVH);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafScroll) cancelAnimationFrame(rafScroll);
      if (rafLoop) cancelAnimationFrame(rafLoop);
      if (snapRaf) cancelAnimationFrame(snapRaf);
      running = false;
    };
  }, []);

  return (
    <div className="home boat" ref={rootRef}>
      {/* ===== Controls hero (top) ===== */}
      <section className="home-top">
        <div className="home-top-glow" aria-hidden="true" />
        <span className="home-top-kicker">Cheatsheet for all</span>
        <h1 className="home-top-title">
          Cheatsheets that <span className="home-top-grad">saved a valley.</span>
        </h1>
        <p className="home-top-sub">
          Copy-ready code for every data structure &amp; algorithm — across Rust,
          C++, Python, Java &amp; Lua. Regex search, Vim keys, and a LeetCode
          practice tracker.
        </p>

        <div className="home-top-actions">
          <button className="home-cta" onClick={onSelectAll}>
            <Icon name="package" size={18} />
            Browse All Cheatsheets
          </button>
          <button className="home-cta home-cta-ghost" onClick={onSelectPractice}>
            <Icon name="target" size={18} />
            Practice Top 150
          </button>
        </div>

        <div className="home-top-langs">
          <span className="home-top-langlabel">choose your language</span>
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
        </div>

        <div className="home-top-hint" aria-hidden="true">
          scroll for the legend ↓
        </div>
      </section>

      {/* ===== The legend — scroll-scrubbed, weather-driven ===== */}
      <section className="voyage" ref={voyageRef}>
        <div className="voyage-stage" ref={stageRef}>
          <canvas className="voyage-particles" ref={canvasRef} aria-hidden="true" />
          <div className="voyage-bg" aria-hidden="true" />
          <div className="voyage-vignette" aria-hidden="true" />

          <div className="voyage-clock" aria-hidden="true">
            <span className="clock-ic">⏱</span>
            <span className="clock-time">15:00</span>
          </div>

          <div className="voyage-rail" aria-hidden="true">
            <span className="voyage-rail-fill" />
            {["temple", "alarm", "flood", "banyan", "sutra", "dawn"].map((n, i) => (
              <span
                key={n}
                className="rail-dot"
                style={{ top: `${(i / 5) * 100}%` }}
              >
                <span className="rail-label">{n}</span>
              </span>
            ))}
          </div>

          {/* Scene 0 — the temple, dusk */}
          <div className="act" data-start="0" data-end="0.16">
            <div className="act-art" aria-hidden="true">
              <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <g className="art-mandala">
                  <circle cx="200" cy="150" r="120" />
                  <circle cx="200" cy="150" r="90" />
                  <circle cx="200" cy="150" r="60" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1="200"
                      y1="150"
                      x2={200 + 120 * Math.cos((i * Math.PI) / 6)}
                      y2={150 + 120 * Math.sin((i * Math.PI) / 6)}
                    />
                  ))}
                </g>
                <path className="art-arch" d="M120 300 L120 150 Q200 60 280 150 L280 300" />
              </svg>
            </div>
            <span className="act-kicker">Martand Temple · dusk</span>
            <h2 className="act-title">The Code<br />of the Cosmos</h2>
            <p className="act-lead">
              Incense and silicon. The monks teach the young the shapes of data
              — but without a cheatsheet, the children drown in the labyrinth of
              recursion.
            </p>
            <p className="act-quote">
              <span className="om">ॐ</span> “O(log N), not O(N),” Anand smiled.
              “The soul migrates like a pointer.”
            </p>
          </div>

          {/* Scene 1 — the sky turns */}
          <div className="act" data-start="0.14" data-end="0.34">
            <div className="act-art art-drift" aria-hidden="true">
              <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <path className="art-bolt" d="M210 40 L170 150 L205 150 L160 260 L250 130 L212 130 Z" />
              </svg>
            </div>
            <span className="act-num">the alarm</span>
            <h2 className="act-h">A bruised, violet sky</h2>
            <p className="act-lead">
              The ancient dam's mainframe deadlocks. A cycle in the mutex graph
              seals the floodgates as the river climbs.
            </p>
            <div className="term">
              <div className="term-line err">[CRITICAL ERROR: THREAD_DEADLOCK_DETECTED]</div>
              <div className="term-line">[RESOURCE FAILURE: CYCLE IN MUTEX GRAPH]</div>
              <div className="term-line dim">&gt; enter resolution script to break the cycle<span className="term-cur" /></div>
            </div>
          </div>

          {/* Scene 2 — the deluge */}
          <div className="act" data-start="0.32" data-end="0.52">
            <div className="act-art art-water scene-illus" aria-hidden="true">
              <svg className="water-svg" viewBox="0 0 400 300" preserveAspectRatio="none">
                <g className="wave wave-back">
                  <path d="M0 150 q50 -20 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V300 H0 Z" />
                  {!reduceMotion && (
                    <animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" dur="11s" repeatCount="indefinite" />
                  )}
                </g>
                <g className="wave wave-mid">
                  <path d="M0 168 q50 -26 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V300 H0 Z" />
                  {!reduceMotion && (
                    <animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" dur="7s" repeatCount="indefinite" />
                  )}
                </g>
              </svg>
              <div className="deluge-boat">
                <div className="deluge-boat-bob">
                <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="boatWood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#835c39" />
                      <stop offset="55%" stopColor="#5a3f27" />
                      <stop offset="100%" stopColor="#38251a" />
                    </linearGradient>
                    <radialGradient id="boatLamp" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffd89a" stopOpacity="0.95" />
                      <stop offset="55%" stopColor="#ffb35c" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffb35c" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle className="boat-glow" cx="34" cy="24" r="30" fill="url(#boatLamp)" />
                  <path
                    className="boat-hull"
                    d="M14 46 Q34 52 30 60 L172 60 Q192 60 184 78 L192 78 L190 92 L176 84 Q100 104 40 82 Q22 70 30 60 Z"
                    fill="url(#boatWood)"
                  />
                  <g className="boat-planks">
                    <path d="M32 66 Q104 92 178 72" />
                    <path d="M34 72 Q104 98 176 78" />
                    <path d="M40 79 Q104 102 168 83" />
                  </g>
                  <path className="boat-gunwale" d="M30 60 L172 60" />
                  <g className="boat-pins">
                    {[52, 74, 96, 118, 140, 162].map((x) => (
                      <line key={x} x1={x} y1="60" x2={x} y2="53" />
                    ))}
                  </g>
                  <line className="boat-mast" x1="34" y1="58" x2="34" y2="24" />
                  <path className="boat-flame" d="M34 14 q5 6 0 12 q-5 -6 0 -12 Z" />
                  <circle className="boat-lamp" cx="34" cy="25" r="5" />
                </svg>
                </div>
              </div>
              <svg className="water-svg water-front" viewBox="0 0 400 300" preserveAspectRatio="none">
                <g className="wave wave-front">
                  <path d="M0 190 q50 -30 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V300 H0 Z" />
                  {!reduceMotion && (
                    <animateTransform attributeName="transform" type="translate" from="-200 0" to="0 0" dur="5s" repeatCount="indefinite" />
                  )}
                </g>
              </svg>
            </div>
            <span className="act-num">the deadlock</span>
            <h2 className="act-h">The Digital Deluge</h2>
            <p className="act-lead">
              Waters rise. The children freeze — was it{" "}
              <code>low[u] = min(low[u], disc[v])</code>, or{" "}
              <code>disc[u]</code>? No books. No network. Blind.
            </p>
            <div className="voyage-viz">
              <svg className="viz-cycle" viewBox="0 0 210 170" role="img">
                <defs>
                  <marker id="cyc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0 0 L10 5 L0 10 z" fill="#f38ba8" />
                  </marker>
                </defs>
                <g className="cyc-edge">
                  <path d="M96 40 Q40 70 42 120" markerEnd="url(#cyc-arrow)" />
                  <path d="M62 138 Q105 155 148 138" markerEnd="url(#cyc-arrow)" />
                  <path d="M168 120 Q170 70 114 40" markerEnd="url(#cyc-arrow)" />
                </g>
                <g className="cyc-node">
                  <circle cx="105" cy="30" r="18" /><text x="105" y="35">T1</text>
                  <circle cx="42" cy="130" r="18" /><text x="42" y="135">T2</text>
                  <circle cx="168" cy="130" r="18" /><text x="168" y="135">T3</text>
                </g>
              </svg>
              <code className="viz-cap">a cycle no thread can escape</code>
            </div>
          </div>

          {/* Scene 3 — the banyan tree */}
          <div className="act" data-start="0.5" data-end="0.68">
            <div className="act-art scene-banyan" aria-hidden="true">
              <svg className="banyan-svg" viewBox="0 0 400 320" preserveAspectRatio="xMidYMax slice">
                <defs>
                  <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffcf87" stopOpacity="0.9" />
                    <stop offset="45%" stopColor="#ff9d4d" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ff9d4d" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="400" height="320" fill="#05050b" />
                <g className="lamp-glow">
                  <ellipse cx="200" cy="272" rx="185" ry="130" fill="url(#lampGlow)" />
                </g>
                {/* banyan canopy + trunk + aerial roots */}
                <g className="banyan-tree">
                  <path d="M0 0 H400 V64 Q366 92 330 70 Q308 56 286 76 Q256 96 224 72 Q202 56 180 76 Q150 96 118 70 Q94 56 78 78 Q44 96 0 72 Z" />
                  <rect x="188" y="60" width="24" height="150" />
                  <rect x="96" y="70" width="7" height="150" />
                  <rect x="140" y="76" width="6" height="150" />
                  <rect x="258" y="74" width="6" height="150" />
                  <rect x="300" y="70" width="7" height="150" />
                </g>
                {/* seated monks */}
                <g className="monks">
                  {MONKS.map((m, i) => (
                    <g key={i} transform={`translate(${m.x} ${m.y}) scale(${m.s})`}>
                      <path
                        className="monk-robe"
                        d="M-36 2 C-40 -20 -24 -30 -19 -41 C-15 -51 -9 -54 0 -54 C9 -54 15 -51 19 -41 C24 -30 40 -20 36 2 Q0 14 -36 2 Z"
                      />
                      <path className="monk-fold" d="M0 -52 C-5 -34 -7 -16 -3 2" />
                      <circle className="monk-head" cx="0" cy="-63" r="9.5" />
                    </g>
                  ))}
                </g>
                {/* the lamp */}
                <g className="lamp">
                  <path className="lamp-flame" d="M200 250 q7 9 0 18 q-7 -9 0 -18 Z" />
                  <path className="lamp-pot" d="M186 268 h28 l-5 12 h-18 Z" />
                </g>
              </svg>
            </div>
            <span className="act-num">code-samadhi</span>
            <h2 className="act-h">Under the Banyan Tree</h2>
            <p className="act-lead">
              Five monks, copper plates, iron styluses. In perfect stillness
              beneath the howling storm, they scribe the Sutras of Silicon —
              thousands of pages distilled to dense, glowing cheatsheets.
            </p>
            <p className="act-quote">
              <em>scratch — scratch — scratch.</em> Metal on copper, faster than the rain.
            </p>
            <div className="banyan-extra" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={"s" + i} className="spark" style={{ "--i": i }} />
              ))}
            </div>
          </div>

          {/* Scene 4 — the sacred cheatsheet */}
          <div className="act" data-start="0.66" data-end="0.86">
            <span className="act-num">the sutra</span>
            <h2 className="act-h">The Sacred Cheatsheet</h2>
            <div className="voyage-viz">
              <div className="plate-stack">
                <span className="plate-ghost plate-ghost-2">GRAPH ALGORITHMS</span>
                <span className="plate-ghost plate-ghost-1">QUEUE &amp; DATA BUFFER</span>
                <div className="viz-code copper">
                  <div className="code-head">
                    <span className="code-dot r" />
                    <span className="code-dot y" />
                    <span className="code-dot g" />
                    <span className="code-file">tarjan_scc.rs</span>
                    <span className="code-copy">⧉ etched</span>
                  </div>
                  <div className="code-body">
                    <span className="code-etch">
                      <span className="tok-kw">if</span> v <span className="tok-kw">in</span> stack:{"\n"}
                      {"  "}low[u] = <span className="tok-fn">min</span>(low[u], disc[v]);{"\n"}
                      <span className="tok-kw">else</span>:{"\n"}
                      {"  "}<span className="tok-fn">dfs</span>(v);{"\n"}
                      {"  "}low[u] = <span className="tok-fn">min</span>(low[u], low[v]);
                    </span>
                  </div>
                </div>
              </div>
              <div className="enter-chip">▶ ENTER — deadlock broken</div>
              <code className="viz-cap">the fog vanished — Priya's fingers flew</code>
            </div>
          </div>

          {/* Scene 5 — dawn */}
          <div className="act act-final" data-start="0.86" data-end="1">
            <div className="act-art art-rise" aria-hidden="true">
              <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <g className="art-rays">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line
                      key={i}
                      x1="200"
                      y1="210"
                      x2={200 + 260 * Math.cos((i * Math.PI) / 8)}
                      y2={210 + 260 * Math.sin((i * Math.PI) / 8)}
                    />
                  ))}
                </g>
                <circle className="art-sun" cx="200" cy="210" r="70" />
                <line className="art-horizon" x1="0" y1="210" x2="400" y2="210" />
              </svg>
            </div>
            <span className="act-num">landfall</span>
            <h2 className="act-title act-title-sm">The valley wakes.</h2>
            <p className="act-lead">
              The floodgates open in a controlled torrent. Dawn breaks clean over
              a valley saved by a cheatsheet.
            </p>
            <div className="dawn-book">
              <span className="dawn-book-spine" />
              <span className="dawn-book-title">The Banyan Tree DSA Cheatsheet</span>
              <span className="dawn-book-sub">— open to page four —</span>
            </div>
            <div className="act-down" aria-hidden="true">↑ start at the top</div>
          </div>
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
