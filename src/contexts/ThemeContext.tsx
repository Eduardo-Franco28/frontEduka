import { createContext, ReactNode, useEffect, useState } from "react";
import * as storageService from "../services/storageService";
import { COLORS, DARK_COLORS } from "../styles/colors";
import { ThemeContextData } from "../types/theme";

export const ThemeContext = createContext({} as ThemeContextData);

const THEME_KEY = "theme";
const FONT_SCALE_KEY = "fontScale";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [fontScale, setFontScaleState] = useState(1);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await storageService.get(THEME_KEY);
        if (storedTheme === "dark") setIsDark(true);

        const storedScale = await storageService.get(FONT_SCALE_KEY);
        if (storedScale) setFontScaleState(Number(storedScale));
      } catch (error) {
        console.error("Theme error:", error);
      }
    };

    loadPreferences();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await storageService.save(THEME_KEY, next ? "dark" : "light");
    } catch (error) {
      console.error("Theme error:", error);
    }
  };

  const setFontScale = async (scale: number) => {
    setFontScaleState(scale);
    try {
      await storageService.save(FONT_SCALE_KEY, String(scale));
    } catch (error) {
      console.error("Theme error:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        fontScale,
        colors: isDark ? DARK_COLORS : COLORS,
        toggleTheme,
        setFontScale,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}