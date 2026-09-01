import { ThemeColors } from "../styles/colors";

export interface ThemeContextData {
  isDark: boolean;
  fontScale: number;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
  setFontScale: (scale: number) => Promise<void>;
}