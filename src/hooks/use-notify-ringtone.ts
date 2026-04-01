import { useRef, useCallback } from "react";

interface NotificationOptions {
  enabled?: boolean;
  volume?: number;
}

type SoundType = "request" | "accept" | "reject" | "lobby-created" | "message";

const SOUND_CONFIG: Record<
  SoundType,
  { freq: number; duration: number; type: OscillatorType }
> = {
  request: { freq: 880, duration: 0.15, type: "sine" },
  accept: { freq: 1046, duration: 0.2, type: "sine" },
  reject: { freq: 440, duration: 0.25, type: "sawtooth" },
  "lobby-created": { freq: 660, duration: 0.3, type: "sine" },
  message: { freq: 740, duration: 0.1, type: "sine" },
};

export const useNotifyRingtone = (options: NotificationOptions = {}) => {
  const { enabled = true, volume = 0.5 } = options;
  const audioContextRef = useRef<AudioContext | null>(null);

  const getContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioContextRef.current;
  };

  const play = useCallback(
    (type: string) => {
      if (!enabled) return;

      const cfg = SOUND_CONFIG[type as SoundType] ?? SOUND_CONFIG.message;

      try {
        const ctx = getContext();
        ctx.resume();

        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + cfg.duration + 0.05,
        );

        const osc = ctx.createOscillator();
        osc.connect(gain);
        osc.type = cfg.type;
        osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + cfg.duration);
      } catch (e) {
        console.log("Audio play failed:", e);
      }
    },
    [enabled, volume],
  );

  // Keep playBeep as an alias for backward compat
  const playBeep = useCallback(() => play("message"), [play]);

  return { play, playBeep };
};
