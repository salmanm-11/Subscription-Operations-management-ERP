/**
 * Utility to play a subtle, pleasant notification chime for new registrations.
 * Uses Web Audio API without requiring any external audio files.
 * Default volume is kept very low (~0.08) per user preference ("sound but very little").
 */

let audioContextInstance: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    if (!audioContextInstance) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextInstance = new AudioCtx();
      }
    }
    if (audioContextInstance && audioContextInstance.state === 'suspended') {
      audioContextInstance.resume().catch(() => {});
    }
    return audioContextInstance;
  } catch (err) {
    console.debug('Web Audio API not supported or blocked:', err);
    return null;
  }
}

/**
 * Plays a short, gentle two-tone chime (E5 -> A5) with smooth exponential decay.
 * @param volume Master volume (0.01 to 0.15). Default is 0.08 (subtle and gentle).
 */
export const playNotificationChime = (volume: number = 0.08): void => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const safeVolume = Math.min(Math.max(volume, 0.01), 0.15);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(safeVolume, now);
    masterGain.connect(ctx.destination);

    // Note 1: E5 (659.25 Hz) - Warm bell tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(1, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Note 2: A5 (880.00 Hz) - Bright chime resolving upward
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.1);
    gain2.gain.setValueAtTime(0.85, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.debug('Failed to play notification chime:', err);
  }
};
