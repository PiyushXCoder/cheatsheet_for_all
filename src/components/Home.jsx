import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/* Weather keyframes across the scroll (p = 0..1).
   ct/cm/cb = sky gradient stops (rgb triplets), g = glow colour,
   ga = glow alpha, gy = glow vertical %, gs = glow size %, storm = 0..1. */
const SKY = [
  { p: 0.0, ct: "42,26,58", cm: "58,40,52", cb: "26,18,40", g: "249,180,94", ga: 0.28, gy: 24, gs: 72, storm: 0.06 },
  { p: 0.16, ct: "60,70,96", cm: "92,104,120", cb: "58,64,84", g: "250,214,150", ga: 0.3, gy: 30, gs: 82, storm: 0.0 },
  { p: 0.3, ct: "40,40,60", cm: "52,50,66", cb: "26,26,42", g: "150,150,182", ga: 0.22, gy: 32, gs: 86, storm: 0.4 },
  { p: 0.44, ct: "22,24,42", cm: "30,32,54", cb: "14,15,30", g: "120,130,180", ga: 0.2, gy: 38, gs: 90, storm: 0.72 },
  { p: 0.57, ct: "12,16,30", cm: "18,26,46", cb: "8,12,24", g: "74,111,181", ga: 0.18, gy: 46, gs: 96, storm: 1.0 },
  { p: 0.69, ct: "15,14,32", cm: "24,22,46", cb: "11,10,26", g: "137,180,250", ga: 0.22, gy: 40, gs: 88, storm: 0.85 },
  { p: 0.82, ct: "26,20,46", cm: "42,30,58", cb: "18,13,34", g: "244,172,120", ga: 0.32, gy: 52, gs: 88, storm: 0.42 },
  { p: 1.0, ct: "78,58,98", cm: "116,82,92", cb: "44,30,54", g: "255,210,150", ga: 0.5, gy: 82, gs: 128, storm: 0.0 },
];

// The eight scenes of the Devgram flood. start/end are scroll-progress bands
// (with a little overlap so scenes cross-dissolve).
const SCENES = [
  {
    img: "01-temple-rain",
    start: 0.0, end: 0.14,
    kicker: "The temple of Devgram · dusk",
    title: "The First Drop",
    lead: "A soft ting on the temple bell. For forty years the five monks turned every hard-won lesson into a single palm leaf — a few lines, a small drawing, no wasted words.",
    quote: "“When the storm comes, six lines are easier to remember than six hundred.”",
  },
  {
    img: "02-village",
    start: 0.13, end: 0.27,
    num: "the village below",
    h: "Life, as it always was",
    lead: "Children in muddy lanes, farmers home from the fields, pots filled at the river. They climbed the hill, watched the monks scratch at tiny leaves, and laughed — “what could possibly be so important?”",
  },
  {
    img: "03-warning",
    start: 0.26, end: 0.4,
    num: "the warning",
    h: "Signs before the flood",
    lead: "The river turned brown. Whole trees rode the current. The mountain birds vanished and the forest fell silent. Bhaskar read the old leaf line by line — every mark a ✓.",
    quote: "“It is coming.”",
  },
  {
    img: "04-chest",
    start: 0.39, end: 0.52,
    num: "the alarm",
    h: "Open the chest",
    lead: "The bell rang, and rang, and rang. The village would not leave — “the river has never reached us.” So the monks lifted the temple floor and opened a chest no one had seen: hundreds of bundles — Flood, Bridge, Fire, Medicine, Children.",
  },
  {
    img: "05-mountain-flood",
    start: 0.51, end: 0.64,
    num: "the mountain",
    h: "The flood charges in",
    lead: "A sound deeper than thunder — a mountain gave way. The river reared, curved out of sight, and for one terrible moment went silent. Then a wall of water burst through the valley and took the bridge whole.",
  },
  {
    img: "06-rescue",
    start: 0.63, end: 0.76,
    num: "the rescue",
    h: "Every order, from a leaf",
    lead: "“Page eleven!” “Knot three!” “Route two!” A triangle bracing holds the western wall. A child is pulled alive from the grain store by a human chain — three ropes, four people, one anchor. Nobody asked why. They obeyed.",
  },
  {
    img: "07-canal-dig",
    start: 0.75, end: 0.88,
    num: "the canal",
    h: "Dig — now",
    lead: "The eastern barrier fell. One forty-year-old leaf remembered what everyone forgot: the ancient irrigation canal. Hundreds dug with shovels, doors, bare hands as the water closed in — then the old channel burst open and the flood turned away.",
  },
  {
    img: "08-dawn",
    start: 0.87, end: 1.0,
    final: true,
    num: "dawn over Devgram",
    title: "The valley wakes.",
    sm: true,
    lead: "Homes damaged, fields buried, the bridge gone — but not one life lost. It was not magic, and not luck. Forty years of mistakes, reduced to one page — so that when fear steals your thoughts, knowledge can still guide your hands.",
  },
];

const RAIL = ["temple", "village", "omen", "chest", "flood", "rescue", "canal", "dawn"];

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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      window.matchMedia("(max-width: 760px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

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

    // Both the text cards and the background layers scrub together.
    const acts = Array.from(stage.querySelectorAll(".act, .act-bg"));
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

    const RUNWAY = isMobile ? 5.4 : 8.5;
    const sizeStage = () => {
      const vh = scroller.clientHeight;
      voyage.style.setProperty("--vh", `${vh}px`);
      voyage.style.height = `${vh * RUNWAY}px`;
    };
    sizeStage();

    // Raw scroll progress (0..1) from the pinned stage geometry.
    const measureP = () => {
      const vr = voyage.getBoundingClientRect();
      const sr = scroller.getBoundingClientRect();
      const total = vr.height - scroller.clientHeight;
      return clamp(total > 0 ? (sr.top - vr.top) / total : 0, 0, 1);
    };

    // smoothstep for gentler cross-fade edges
    const smooth = (t) => t * t * (3 - 2 * t);

    // Paint everything for a given (already-smoothed) progress p.
    const applyVisuals = (p) => {
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

      // countdown clock — appears at the first warning, "SAFE" at dawn
      if (clock && clockTime) {
        if (p < 0.26) {
          clock.style.opacity = "0";
        } else {
          clock.style.opacity = "1";
          if (p >= 0.9) {
            clock.classList.add("safe");
            clockTime.textContent = "SAFE";
          } else {
            clock.classList.remove("safe");
            const tt = clamp((p - 0.28) / (0.9 - 0.28), 0, 1);
            const secs = Math.max(0, Math.round(900 * (1 - tt)));
            clockTime.textContent = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
          }
        }
      }

      // chapter dots on the rail (8 scenes)
      const scene = Math.min(
        RAIL.length - 1,
        p < 0.14 ? 0 : p < 0.27 ? 1 : p < 0.4 ? 2 : p < 0.52 ? 3 : p < 0.64 ? 4 : p < 0.76 ? 5 : p < 0.88 ? 6 : 7,
      );
      railDots.forEach((d, i) => d.classList.toggle("on", i === scene));

      for (const act of acts) {
        const a = parseFloat(act.dataset.start);
        const b = parseFloat(act.dataset.end);
        let op = 0;
        let local = 0;
        if (p >= a && p <= b) {
          local = (p - a) / (b - a);
          const f = 0.24;
          if (a > 0.001 && local < f) op = smooth(local / f);
          else if (b < 0.999 && local > 1 - f) op = smooth((1 - local) / f);
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

    // Smoothed progress that eases toward the scroll target every frame, so
    // weather, parallax, cross-fades and particles all glide instead of
    // snapping with each discrete scroll event.
    let targetP = measureP();
    let viewP = targetP;
    const SMOOTH_K = 0.14;

    // Skip the top hero as a snap page; the story below scrubs normally.
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

    // Scroll only records the target; the rAF loop eases toward it and paints.
    const onScroll = () => {
      if (!isMobile) heroSkip();
      targetP = measureP();
      if (stageVisible && running && !rafLoop) rafLoop = requestAnimationFrame(draw);
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
      // ease the displayed progress toward the scroll target, then paint
      viewP += (targetP - viewP) * SMOOTH_K;
      if (Math.abs(targetP - viewP) < 0.0002) viewP = targetP;
      applyVisuals(viewP);

      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const p = viewP;
      const storm = weatherAt(p).storm;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const tint = storm; // 0 warm embers, 1 cold rain
      const cr = Math.round(lerp(255, 150, tint));
      const cg = Math.round(lerp(196, 180, tint));
      const cb = Math.round(lerp(140, 240, tint));
      const vyBase = lerp(-0.55, 4.2, storm);
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
      targetP = measureP();
      applyVisuals(viewP);
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
    targetP = measureP();
    viewP = targetP;
    applyVisuals(viewP);
    rafLoop = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      stageIO.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", setVH);
      document.removeEventListener("visibilitychange", onVisibility);
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
          scroll for the legend of Devgram ↓
        </div>
      </section>

      {/* ===== The legend — scroll-scrubbed, weather-driven ===== */}
      <section className="voyage" ref={voyageRef}>
        <div className="voyage-stage" ref={stageRef}>
          <div className="voyage-bg" aria-hidden="true" />

          {/* watercolor scene backgrounds (parallax, cross-dissolve) */}
          {SCENES.map((s) => (
            <div
              key={`bg-${s.img}`}
              className="act-bg"
              data-start={s.start}
              data-end={s.end}
              style={{ backgroundImage: `url(/story/${s.img}.webp)` }}
              aria-hidden="true"
            />
          ))}

          <canvas className="voyage-particles" ref={canvasRef} aria-hidden="true" />
          <div className="voyage-weather" aria-hidden="true" />
          <div className="voyage-vignette" aria-hidden="true" />

          <div className="voyage-clock" aria-hidden="true">
            <span className="clock-ic">⏱</span>
            <span className="clock-time">15:00</span>
          </div>

          <div className="voyage-rail" aria-hidden="true">
            <span className="voyage-rail-fill" />
            {RAIL.map((n, i) => (
              <span
                key={n}
                className="rail-dot"
                style={{ top: `${(i / (RAIL.length - 1)) * 100}%` }}
              >
                <span className="rail-label">{n}</span>
              </span>
            ))}
          </div>

          {/* scene text cards */}
          {SCENES.map((s) => (
            <div
              key={`act-${s.img}`}
              className={"act" + (s.final ? " act-final" : "")}
              data-start={s.start}
              data-end={s.end}
            >
              {s.kicker && <span className="act-kicker">{s.kicker}</span>}
              {s.num && <span className="act-num">{s.num}</span>}
              {s.title && (
                <h2 className={"act-title" + (s.sm ? " act-title-sm" : "")}>{s.title}</h2>
              )}
              {s.h && <h2 className="act-h">{s.h}</h2>}
              <p className="act-lead">{s.lead}</p>
              {s.quote && <p className="act-quote">{s.quote}</p>}
              {s.final && (
                <>
                  <div className="dawn-book">
                    <span className="dawn-book-spine" />
                    <span className="dawn-book-title">The Devgram Cheatsheets</span>
                    <span className="dawn-book-sub">— one page each —</span>
                  </div>
                  <div className="act-down" aria-hidden="true">↑ start at the top</div>
                </>
              )}
            </div>
          ))}
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
                <strong>Nothing else</strong> — we only use your basic profile.
                Your practice progress is stored on our own server, tied to your
                account, so it syncs across your devices.
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
                We do not sell, share, or use your data for advertising,
                analytics, or tracking.
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
