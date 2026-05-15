type WaveKind = OscillatorType | "fatsine" | "fmtriangle";
type ToneApi = typeof import("tone");
type HowlerApi = typeof import("howler");

type SoundEngine = {
  unlock: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  tone: (frequency: number, duration?: number, type?: WaveKind, gain?: number) => void;
  success: (motif: number[], step?: number, duration?: number) => void;
  failure: (motif: number[], step?: number) => void;
  levelUp: (motif: number[], levelIndex: number) => void;
  transcend: () => void;
  uiTap: () => void;
  dispose: () => void;
};

const NOTE_NAMES = ["C4", "E4", "G4", "B4", "D5", "F#5", "A5"];

export function createSoundEngine(): SoundEngine {
  let muted = false;
  let ready = false;
  let disposed = false;
  let toneApi: ToneApi | null = null;
  let howlerApi: HowlerApi | null = null;
  let lead: any = null;
  let bass: any = null;
  let air: any = null;
  let delay: any = null;
  let reverb: any = null;
  let filter: any = null;
  let ui: any = null;

  const ensure = async () => {
    if (lead || disposed) return;
    const [Tone, HowlerModule] = await Promise.all([import("tone"), import("howler")]);
    toneApi = Tone;
    howlerApi = HowlerModule;
    filter = new Tone.Filter(860, "lowpass").toDestination();
    delay = new Tone.FeedbackDelay("8n", 0.22).connect(filter);
    reverb = new Tone.Reverb({ decay: 2.8, wet: 0.24 }).connect(delay);
    lead = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.012, decay: 0.18, sustain: 0.18, release: 0.72 },
      volume: -18
    }).connect(reverb);
    bass = new Tone.MembraneSynth({
      pitchDecay: 0.012,
      octaves: 3.4,
      envelope: { attack: 0.004, decay: 0.26, sustain: 0.02, release: 0.28 },
      volume: -22
    }).connect(delay);
    air = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 0.25 },
      volume: -35
    }).connect(filter);
    ui = new HowlerModule.Howl({
      src: [makePulseWav()],
      preload: true,
      volume: 0.22
    });
    HowlerModule.Howler.volume(muted ? 0 : 1);
  };

  const canPlay = () => ready && !muted && !disposed && lead;

  const unlock = async () => {
    if (muted || disposed) return;
    await ensure();
    if (!toneApi) return;
    await toneApi.start();
    if (toneApi.Transport.state !== "started") toneApi.Transport.start();
    ready = true;
  };

  const setMuted = (nextMuted: boolean) => {
    muted = nextMuted;
    howlerApi?.Howler.volume(muted ? 0 : 1);
    if (toneApi) toneApi.getDestination().mute = muted;
  };

  const tone = (frequency: number, duration = 0.12, type: WaveKind = "sine", gain = 0.055) => {
    if (!canPlay() || !lead || !toneApi) return;
    const synth = new toneApi.Synth({
      oscillator: { type },
      envelope: { attack: 0.006, decay: duration * 0.5, sustain: 0.08, release: duration }
    }).connect(filter ?? toneApi.getDestination());
    synth.volume.value = toneApi.gainToDb(Math.max(0.001, gain));
    synth.triggerAttackRelease(frequency, duration, toneApi.now());
    window.setTimeout(() => synth.dispose(), Math.max(120, duration * 1400));
  };

  const success = (motif: number[], step = 0, duration = 0.12) => {
    if (!canPlay() || !lead || !toneApi) return;
    const frequency = motif[step % motif.length];
    lead.triggerAttackRelease(frequency, duration, toneApi.now(), 0.48);
  };

  const failure = (motif: number[], step = 0) => {
    if (!canPlay() || !lead || !toneApi) return;
    const frequency = motif[step % motif.length];
    tone(frequency, 0.085, "sawtooth", 0.025);
    bass?.triggerAttackRelease(frequency / 2, "16n", toneApi.now(), 0.25);
  };

  const levelUp = (motif: number[], levelIndex: number) => {
    if (!canPlay() || !lead || !toneApi) return;
    const now = toneApi.now();
    const shifted = motif.map((frequency, index) => frequency * (index === 2 ? 2 : 1));
    shifted.forEach((frequency, index) => {
      lead?.triggerAttackRelease(frequency, "8n", now + index * 0.075, 0.56);
    });
    bass?.triggerAttackRelease(NOTE_NAMES[levelIndex % NOTE_NAMES.length], "8n", now + 0.02, 0.6);
    air?.triggerAttackRelease("16n", now + 0.04, 0.32);
    ui?.rate(0.92 + levelIndex * 0.025);
    ui?.play();
  };

  const transcend = () => {
    if (!canPlay() || !lead || !toneApi) return;
    const now = toneApi.now();
    ["C4", "G4", "D5", "A5", "E6"].forEach((note, index) => {
      lead?.triggerAttackRelease(note, "4n", now + index * 0.09, 0.42);
    });
    air?.triggerAttackRelease("2n", now, 0.5);
  };

  const uiTap = () => {
    if (!muted) ui?.play();
  };

  const dispose = () => {
    disposed = true;
    lead?.dispose();
    bass?.dispose();
    air?.dispose();
    delay?.dispose();
    reverb?.dispose();
    filter?.dispose();
    ui?.unload();
  };

  return { unlock, setMuted, tone, success, failure, levelUp, transcend, uiTap, dispose };
}

function makePulseWav(): string {
  const sampleRate = 22050;
  const seconds = 0.08;
  const samples = Math.floor(sampleRate * seconds);
  const dataSize = samples * 2;
  const bytes = new Uint8Array(44 + dataSize);
  const view = new DataView(bytes.buffer);

  writeString(bytes, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(bytes, 8, "WAVE");
  writeString(bytes, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(bytes, 36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < samples; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.exp(-42 * t);
    const sample = Math.sin(Math.PI * 2 * 880 * t) * envelope * 0.7;
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
  }

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function writeString(bytes: Uint8Array, offset: number, value: string) {
  for (let i = 0; i < value.length; i += 1) {
    bytes[offset + i] = value.charCodeAt(i);
  }
}
