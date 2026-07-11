import { useState } from "react";

import { playPingSound } from "../utils/helpers";

export const useAudio = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const playSound = () => {
    if (soundEnabled) {
      playPingSound();
    }
  };

  return { soundEnabled, toggleSound, playSound };
};
