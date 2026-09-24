import { createTheme } from "@mui/material/styles";

// Crema — Terracotta palette
export const brand = {
  espresso: "#3E2723",
  roast: "#2B1D1A",
  terracotta: "#B5472F", // accessible on white (5.4:1)
  terracottaBright: "#C8553D",
  clay: "#E07A5F", // accent on dark surfaces
  sand: "#E8DCD3",
  milk: "#FAF7F2",
  night: "#141110",
  nightPaper: "#1F1A18",
};

export function buildTheme(mode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? brand.clay : brand.terracotta,
        dark: isDark ? brand.terracottaBright : "#963A26",
        contrastText: isDark ? brand.night : "#fff",
      },
      secondary: {
        main: isDark ? brand.sand : brand.espresso,
        contrastText: isDark ? brand.night : "#fff",
      },
      background: {
        default: isDark ? brand.night : brand.milk,
        paper: isDark ? brand.nightPaper : "#fff",
      },
      text: {
        primary: isDark ? "#F3ECE6" : brand.roast,
        secondary: isDark ? "#B8A9A2" : "#6B5A55",
      },
      divider: isDark ? "rgba(243,236,230,0.12)" : "rgba(62,39,35,0.12)",
      // Chart series, validated for lightness, chroma, colour-blind separation
      // and contrast against the paper surface of each mode
      chart: isDark
        ? { first: "#D96A4E", second: "#1A9CBD", grid: "rgba(243,236,230,0.10)" }
        : { first: "#B5472F", second: "#00809D", grid: "rgba(62,39,35,0.10)" },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h5: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Hide scrollbars everywhere; scrolling still works with wheel, touch and keys
          "*": { scrollbarWidth: "none" },
          "*::-webkit-scrollbar": { width: 0, height: 0 },
          "::selection": { backgroundColor: isDark ? "rgba(224,122,95,0.35)" : "rgba(181,71,47,0.2)" },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark
              ? "0 4px 16px rgba(0,0,0,0.4)"
              : "0 4px 16px rgba(62,39,35,0.08)",
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });
}
