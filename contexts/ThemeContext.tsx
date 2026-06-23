import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type ColorScheme,
  type ThemeColors,
  getColors,
} from "@/constants/theme";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  const toggleColorScheme = useCallback(() => {
    setColorScheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      colorScheme,
      colors: getColors(colorScheme),
      isDark: colorScheme === "dark",
      setColorScheme,
      toggleColorScheme,
    }),
    [colorScheme, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
