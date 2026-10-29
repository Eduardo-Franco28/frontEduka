import { useEffect, useState } from "react";
import * as storageService from "../services/storageService";

const VOICE_MUTED_KEY = "voiceMuted";

export default function useVoice() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const muted = await storageService.get(VOICE_MUTED_KEY);

        if (muted) setVoiceEnabled(false);
      } catch (error) {
        console.error("Voice error:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadPreference();
  }, []);

  const toggleVoice = async () => {
    setVoiceEnabled(!voiceEnabled);

    try {
      if (voiceEnabled) {
        await storageService.save(VOICE_MUTED_KEY, "true");
        return;
      }

      await storageService.remove(VOICE_MUTED_KEY);
    } catch (error) {
      console.error("Voice error:", error);
    }
  };

  return { voiceEnabled, loaded, toggleVoice };
}
