// Web Audio API Synthesizer for cozy space ambiance, rain, and chimes.
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private rainFilter: BiquadFilterNode | null = null;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private melodyInterval: any = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported on this browser.");
    }
  }

  // Play a beautiful sparkling chime sound
  playChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C Major 7 chord

    freqs.forEach((f, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + index * 0.05);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.05 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.05);
      osc.stop(now + index * 0.05 + 1.5);
    });
  }

  // Play a bubbly water dropping sound
  playWaterBubble() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const startFreq = 200 + Math.random() * 200;
      osc.frequency.setValueAtTime(startFreq, now + i * 0.15);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 2.5, now + i * 0.15 + 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.2);
    }
  }

  // Play a soft magic cuddle/play sound
  playPetSparkle() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.3);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Generate synthesized soothing rain sound
  startRain() {
    this.init();
    if (!this.ctx) return;
    if (this.rainGain) return; // already playing

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter white noise to sound like soothing rain (lowpass + bandpass)
    this.rainFilter = this.ctx.createBiquadFilter();
    this.rainFilter.type = "lowpass";
    this.rainFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(this.rainFilter);
    this.rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);

    whiteNoise.start();
    this.rainSource = whiteNoise;
  }

  stopRain() {
    if (this.rainSource) {
      try {
        (this.rainSource as any).stop();
      } catch (e) {}
      this.rainSource = null;
    }
    this.rainGain = null;
    this.rainFilter = null;
  }

  // Start peaceful, lush celestial music drone
  startAmbiance() {
    this.init();
    if (!this.ctx) return;
    if (this.ambientOscs.length > 0) return; // already playing

    const now = this.ctx.currentTime;
    const baseFreqs = [110.0, 164.81, 220.0, 329.63]; // A2, E3, A3, E4 warm fifths

    baseFreqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);

      // Add a slight vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.15 + Math.random() * 0.1; // very slow
      lfoGain.gain.value = 1.5; // pitch offset

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.015, now);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      lfo.start();
      osc.start();

      this.ambientOscs.push({ osc, gain });
    });

    // Staggered peaceful piano melodies
    const notes = [440.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00]; // A Minor Pentatonic
    this.melodyInterval = setInterval(() => {
      if (!this.ctx || Math.random() > 0.6) return;

      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.0);
    }, 4000);
  }

  stopAmbiance() {
    this.ambientOscs.forEach(({ osc }) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.ambientOscs = [];
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
  }

  // Trigger cozy sleep ambient hums
  startSleepDrone() {
    this.init();
    if (!this.ctx) return;
    this.startRain(); // add rain background
    this.startAmbiance(); // keep very quiet ambiance
  }

  stopSleepDrone() {
    this.stopRain();
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
