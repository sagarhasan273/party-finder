// utils/playSound.ts
let audioContext: AudioContext | null = null;

export const initAudio = async () => {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    await audioContext.resume();
  }
};

export const playRingtone = async (soundFile: string, volume: number = 0.5) => {
  try {
    // Initialize audio context first
    await initAudio();

    const audio = new Audio(soundFile);
    audio.volume = volume;
    await audio.play();
  } catch (error) {
    console.log("Error playing sound:", error);
  }
};
