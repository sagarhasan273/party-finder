const delay_ms = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const callGeminiText = async (
  prompt: string,
  systemInstruction = "",
  retries = 3,
  delay = 1000,
) => {
  const apiKey = ""; // Canvas runtime automatically injects valid API key
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    ...(systemInstruction && {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
    }),
  };

  for (let i = 0; i < retries; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        // eslint-disable-next-line no-await-in-loop
        await delay_ms(delay * 2 ** i);
      } else {
        // eslint-disable-next-line no-await-in-loop
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    } catch (e) {
      if (i === retries - 1) throw e;
      // eslint-disable-next-line no-await-in-loop
      await delay_ms(delay * 2 ** i);
    }
  }
  return "";
};

export const callImagenGeneration = async (
  prompt: string,
  retries = 2,
  delay = 1500,
) => {
  const apiKey = ""; // Automatically injected by Canvas at runtime
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

  const payload = {
    instances: [
      {
        prompt: `${prompt}, premium esports profile avatar vector illustration, cyber neon Valorant agent concept art, crisp lighting, high contrast`,
      },
    ],
    parameters: { sampleCount: 1 },
  };

  for (let i = 0; i < retries; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        // eslint-disable-next-line no-await-in-loop
        await delay_ms(delay * 2 ** i);
      } else {
        // eslint-disable-next-line no-await-in-loop
        const result = await response.json();
        if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
          return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        }
      }
    } catch (e) {
      if (i === retries - 1) throw e;
      // eslint-disable-next-line no-await-in-loop
      await delay_ms(delay * 2 ** i);
    }
  }
  return null;
};

export const playPingSound = () => {
  try {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);
  } catch (err) {
    // Silently ignore audio context errors
  }
};
