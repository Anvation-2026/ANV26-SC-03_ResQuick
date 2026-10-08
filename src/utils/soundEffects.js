// Sound effects and authentic EAS (Emergency Alert System) audio generator
// Modeled exactly after the iconic Billybov123 Emergency Alert System ringtone (SAME bursts + 853Hz/960Hz dual-tone attention signal)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Authentic Billybov123 Emergency Alert System (EAS) Ringtone:
 * 1. SAME Digital Header Data Bursts (AFSK bursts at 2083.3 Hz / 1562.5 Hz mark-space)
 * 2. Famous Dual-Tone Attention Signal: 853 Hz + 960 Hz played simultaneously
 * Produces the unmistakable, chilling official EAS broadcast tone.
 */
export function playEASAlertRingtone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, now);
    masterGain.connect(ctx.destination);

    // Phase 1: 3 SAME digital header chirps (AFSK digital header pulses)
    for (let b = 0; b < 3; b++) {
      const burstStart = now + (b * 0.26);
      const oscData = ctx.createOscillator();
      const gainData = ctx.createGain();

      oscData.type = 'sawtooth';
      // Alternate between 2083.3 Hz and 1562.5 Hz mark/space frequencies
      for (let s = 0; s < 14; s++) {
        const stepTime = burstStart + (s * 0.015);
        oscData.frequency.setValueAtTime(s % 2 === 0 ? 2083.3 : 1562.5, stepTime);
      }

      gainData.gain.setValueAtTime(0.24, burstStart);
      gainData.gain.setValueAtTime(0.0001, burstStart + 0.22);

      oscData.connect(gainData);
      gainData.connect(masterGain);
      oscData.start(burstStart);
      oscData.stop(burstStart + 0.22);
    }

    // Phase 2: Iconic EAS Dual-Tone Attention Signal (853 Hz + 960 Hz)
    const dualToneStart = now + 0.88;
    const dualToneDuration = 3.8;

    // Oscillator 1: 853 Hz
    const osc853 = ctx.createOscillator();
    osc853.type = 'sine';
    osc853.frequency.setValueAtTime(853, dualToneStart);

    // Oscillator 2: 960 Hz
    const osc960 = ctx.createOscillator();
    osc960.type = 'sine';
    osc960.frequency.setValueAtTime(960, dualToneStart);

    const dualGain = ctx.createGain();
    dualGain.gain.setValueAtTime(0.28, dualToneStart);
    dualGain.gain.setValueAtTime(0.28, dualToneStart + dualToneDuration - 0.25);
    dualGain.gain.exponentialRampToValueAtTime(0.0001, dualToneStart + dualToneDuration);

    osc853.connect(dualGain);
    osc960.connect(dualGain);
    dualGain.connect(masterGain);

    osc853.start(dualToneStart);
    osc853.stop(dualToneStart + dualToneDuration);
    osc960.start(dualToneStart);
    osc960.stop(dualToneStart + dualToneDuration);

  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

// Alias playEmergencySiren directly to the Billybov123 EAS Alert Ringtone
export const playEmergencySiren = playEASAlertRingtone;

/**
 * Play subtle dispatch / ping notification sound
 */
export function playDispatchPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.warn('Audio ping error:', err);
  }
}
