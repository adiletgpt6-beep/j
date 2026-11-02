// Visual system for the Zeket explainer series. Brand green/gold taken from zeket.kg (logo + #006633 accents).
export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const colors = {
  brand: "#006633",        // Zeket green (site accent)
  brandDeep: "#0A4A2C",
  brandSoft: "#2E8B57",
  mint: "#DFEFE4",
  mintLight: "#EEF6F0",
  cream: "#FAF6EE",        // default background
  creamDark: "#F1E9D8",
  sand: "#E6D3AE",
  gold: "#E0A93A",         // logo gold
  goldDeep: "#B9821F",
  terracotta: "#C9774B",
  sky: "#CFE3EE",
  skyDeep: "#9FC3D6",
  night: "#1E2E4A",
  nightDeep: "#101A2E",
  mountain: "#7E9AAE",
  mountainFar: "#A9BFCD",
  ink: "#1F2A2E",
  inkSoft: "#4A5A60",
  white: "#FFFFFF",
  skin1: "#F1C9A5",
  skin2: "#D9A379",
  skin3: "#B57B55",
  red: "#C94F4F",
};

export const fonts = {
  display: "'Nunito', 'Inter', sans-serif",
  body: "'Inter', 'Nunito', sans-serif",
};

// Safe areas for Reels / TikTok / Shorts UI overlays
export const safe = {
  top: 190,
  bottom: 420,
  side: 64,
};

export const sizes = {
  title: 88,
  caption: 64,
  note: 36,
  subtitle: 48,
};

// Illustration zone between caption area and subtitle/note area
export const zone = { top: 430, bottom: 1230, cx: W / 2, cy: 830 };
