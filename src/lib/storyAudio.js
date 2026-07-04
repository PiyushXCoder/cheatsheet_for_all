// Homepage story soundscape from real audio files, mixed live by the scroll.
//
// Looping beds (fire, rain, wind, calm ambience) each have a gain node whose
// level is driven every frame from the story's `storm` and scene-1 `ember`
// values; thunder plays a random one-shot on each lightning flash. Files live
// in /public/audio and load on first enable (a user gesture — required for
// Web Audio). Any missing file simply leaves that layer silent.
//
// Expected files (see the list in the repo / PR description):
//   /audio/fire.mp3      seamless loop — crackling campfire
//   /audio/rain.mp3      seamless loop — steady rain
//   /audio/wind.mp3      seamless loop — wind / storm gusts
//   /audio/ambient.mp3   seamless loop — calm evening/temple ambience
//   /audio/thunder-1.mp3, /audio/thunder-2.mp3   one-shots

const LOOPS = {
  fire: "/audio/fire.mp3",
  rain: "/audio/rain.mp3",
  wind: "/audio/wind.mp3",
  calm: "/audio/ambient.mp3",
};
const THUNDERS = ["/audio/thunder-1.mp3", "/audio/thunder-2.mp3"];

export function createStoryAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0; // fades in when enabled
  master.connect(ctx.destination);

  // one gain per loop layer, created up front so update() works before decode
  const gains = {};
  for (const key of Object.keys(LOOPS)) {
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(master);
    gains[key] = g;
  }

  const thunderBufs = [];
  let enabled = false;
  let loadStarted = false;

  const fetchBuffer = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`missing ${url}`);
    return await ctx.decodeAudioData(await res.arrayBuffer());
  };

  const load = () => {
    if (loadStarted) return;
    loadStarted = true;
    for (const [key, url] of Object.entries(LOOPS)) {
      fetchBuffer(url)
        .then((buf) => {
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.connect(gains[key]);
          src.start();
        })
        .catch(() => {}); // missing file -> layer stays silent
    }
    THUNDERS.forEach((url) =>
      fetchBuffer(url).then((buf) => thunderBufs.push(buf)).catch(() => {}),
    );
  };

  const set = (key, v) => {
    const g = gains[key];
    if (g) g.gain.setTargetAtTime(Math.max(0, v), ctx.currentTime, 0.3);
  };

  // storm (0..1) drives rain/wind/calm; ember (0..1) is the scene-1 fireside.
  const update = (storm, ember = 0) => {
    if (!enabled) return;
    set("fire", ember * 0.9);
    set("rain", storm * (1 - ember) * 0.85);
    set("wind", storm * 0.5);
    set("calm", (1 - storm) * 0.5);
  };

  const thunder = (strength = 1) => {
    if (!enabled || thunderBufs.length === 0) return;
    const buf = thunderBufs[Math.floor(Math.random() * thunderBufs.length)];
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = Math.min(1, Math.max(0.2, strength));
    src.connect(g);
    g.connect(master);
    src.start();
  };

  let suspendTimer = 0;
  const setEnabled = (on) => {
    enabled = on;
    clearTimeout(suspendTimer);
    if (on) {
      if (ctx.state === "suspended") ctx.resume();
      load();
      master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.3);
    } else {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      suspendTimer = setTimeout(() => {
        if (!enabled && ctx.state === "running") ctx.suspend();
      }, 500);
    }
  };

  const destroy = () => {
    clearTimeout(suspendTimer);
    try {
      ctx.close();
    } catch {}
  };

  return {
    update,
    thunder,
    setEnabled,
    destroy,
    get enabled() {
      return enabled;
    },
  };
}
