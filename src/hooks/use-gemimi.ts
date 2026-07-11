import { useState } from "react";

import { callGeminiText, callImagenGeneration } from "../utils/helpers";

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (prompt: string, systemInstruction?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callGeminiText(prompt, systemInstruction);
      return result;
    } catch (err) {
      setError("Failed to generate text");
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callImagenGeneration(prompt);
      return result;
    } catch (err) {
      setError("Failed to generate image");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateText, generateImage, isLoading, error };
};
