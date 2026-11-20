let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function playSoftTone(
  frequency: number,
  durationSec: number,
  volume = 0.08,
  delaySec = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime + delaySec;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0008, startTime + durationSec);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + durationSec + 0.02);
  } catch {
    // Fail silently if browser blocks audio
  }
}

export function playTapSound(enabled: boolean): void {
  if (!enabled) return;
  playSoftTone(440, 0.12, 0.05);
}

export function playMatchSound(enabled: boolean): void {
  if (!enabled) return;
  playSoftTone(523.25, 0.16, 0.07, 0);
  playSoftTone(659.25, 0.22, 0.07, 0.09);
}

export function playGentleNudgeSound(enabled: boolean): void {
  if (!enabled) return;
  playSoftTone(330, 0.18, 0.045, 0);
}

export function playLevelCompleteSound(enabled: boolean): void {
  if (!enabled) return;
  playSoftTone(523.25, 0.22, 0.08, 0);
  playSoftTone(659.25, 0.22, 0.08, 0.12);
  playSoftTone(783.99, 0.35, 0.08, 0.24);
}

export function playSequenceNote(enabled: boolean, frequency: number): void {
  if (!enabled) return;
  playSoftTone(frequency, 0.28, 0.08, 0);
}
