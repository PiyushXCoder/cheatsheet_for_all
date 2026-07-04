// Procedural weather soundscape for the homepage story, driven by the same
// scroll `storm` value that drives the visuals. All sound is synthesized with
// Web Audio — no audio files. Must be created from a user gesture (the sound
// toggle) because browsers block audio autoplay.

export function createStoryAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0; // fades in when enabled
  master.connect(ctx.destination);

  // one shared 2s noise buffer reused by rain / wind / thunder
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noiseBuf.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const loopNoise = () => {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    s.start();
    return s;
  };

  // --- rain: high-passed hiss ---
  const rainHP = ctx.createBiquadFilter();
  rainHP.type = "highpass";
  rainHP.frequency.value = 900;
  const rainLP = ctx.createBiquadFilter();
  rainLP.type = "lowpass";
  rainLP.frequency.value = 9000;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0;
  loopNoise().connect(rainHP);
  rainHP.connect(rainLP);
  rainLP.connect(rainGain);
  rainGain.connect(master);

  // --- wind: low rumble with a slow filter sweep ---
  const windLP = ctx.createBiquadFilter();
  windLP.type = "lowpass";
  windLP.frequency.value = 340;
  windLP.Q.value = 3;
  const windGain = ctx.createGain();
  windGain.gain.value = 0;
  loopNoise().connect(windLP);
  windLP.connect(windGain);
  windGain.connect(master);
  const windLfo = ctx.createOscillator();
  windLfo.frequency.value = 0.08;
  const windLfoAmt = ctx.createGain();
  windLfoAmt.gain.value = 160;
  windLfo.connect(windLfoAmt);
  windLfoAmt.connect(windLP.frequency);
  windLfo.start();

  // --- calm: soft sine pad for dusk & dawn ---
  const calmGain = ctx.createGain();
  calmGain.gain.value = 0;
  calmGain.connect(master);
  [138.6, 174.6, 220.0].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1) * 5;
    const g = ctx.createGain();
    g.gain.value = 0.33;
    o.connect(g);
    g.connect(calmGain);
    o.start();
  });

  let enabled = false;

  // continuous mix from storm intensity (0..1); calm pad fades in when calm
  const update = (storm) => {
    if (!enabled) return;
    const t = ctx.currentTime;
    const calm = Math.max(0, 1 - storm);
    rainGain.gain.setTargetAtTime(storm * 0.3, t, 0.25);
    windGain.gain.setTargetAtTime(storm * 0.18, t, 0.4);
    calmGain.gain.setTargetAtTime(calm * 0.09, t, 0.6);
  };

  // one-shot thunder: low sine rumble + a filtered noise crack
  const thunder = (strength = 1) => {
    if (!enabled) return;
    const t = ctx.currentTime;
    const s = Math.max(0.2, Math.min(1, strength));

    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(72, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 1.4);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.5 * s, t + 0.08);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
    o.connect(og);
    og.connect(master);
    o.start(t);
    o.stop(t + 2);

    const n = ctx.createBufferSource();
    n.buffer = noiseBuf;
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 420;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.32 * s, t + 0.02);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    n.connect(nf);
    nf.connect(ng);
    ng.connect(master);
    n.start(t);
    n.stop(t + 1.2);
  };

  let suspendTimer = 0;
  const setEnabled = (on) => {
    enabled = on;
    clearTimeout(suspendTimer);
    if (on) {
      if (ctx.state === "suspended") ctx.resume();
      master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.3);
    } else {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      // free the audio thread once faded out
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
