import type { VenueTheme, VenueThemeId } from "@/types/venue-theme";

const themes: Record<VenueThemeId, VenueTheme> = {
  "the-bird": {
    id: "the-bird",
    accent: "#d4af37",
    accentSoft: "rgba(212, 175, 55, 0.15)",
    background: "#0a0908",
    surface: "#161210",
    surfaceBorder: "rgba(212, 175, 55, 0.2)",
    text: "#f5f0e8",
    textMuted: "#a89f92",
    buttonText: "#0a0908",
    heroOverlay:
      "linear-gradient(to top, #0a0908 0%, rgba(10,9,8,0.55) 45%, rgba(139,38,53,0.25) 100%)",
    glow: "radial-gradient(ellipse at 70% 20%, rgba(212,175,55,0.18) 0%, transparent 55%)",
    cardClass: "venue-glass rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#161210]/75",
    heroClass: "venue-hero-the-bird",
    instagram: "https://www.instagram.com/bird_restclub/",
    backdropImage: "/backgrounds/the-bird-birds.jpg",
    backdropPosition: "center 15%",
    backdropSize: "cover",
    backdropOpacity: 0.42,
  },
  "buddu-lounge": {
    id: "buddu-lounge",
    accent: "#c084fc",
    accentSoft: "rgba(192, 132, 252, 0.15)",
    background: "#0c0a12",
    surface: "#151222",
    surfaceBorder: "rgba(192, 132, 252, 0.18)",
    text: "#f3effa",
    textMuted: "#9d93b0",
    buttonText: "#0c0a12",
    heroOverlay:
      "linear-gradient(to top, #0c0a12 0%, rgba(12,10,18,0.5) 50%, rgba(124,58,237,0.3) 100%)",
    glow: "radial-gradient(ellipse at 30% 0%, rgba(192,132,252,0.2) 0%, transparent 50%)",
    cardClass: "venue-glass rounded-2xl border border-[rgba(192,132,252,0.15)] bg-[#151222]/75",
    heroClass: "venue-hero-buddu",
    instagram: "https://www.instagram.com/buddu_lounge.nch/",
    backdropImage: "/backgrounds/buddu-buddha.jpg",
    backdropPosition: "center 25%",
    backdropSize: "cover",
    backdropOpacity: 0.48,
  },
  mare: {
    id: "mare",
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.15)",
    background: "#061018",
    surface: "#0c1a28",
    surfaceBorder: "rgba(56, 189, 248, 0.18)",
    text: "#eef6fb",
    textMuted: "#8ba3b8",
    buttonText: "#061018",
    heroOverlay:
      "linear-gradient(to top, #061018 0%, rgba(6,16,24,0.45) 50%, rgba(14,116,144,0.35) 100%)",
    glow: "radial-gradient(ellipse at 80% 10%, rgba(56,189,248,0.22) 0%, transparent 45%)",
    cardClass: "venue-glass rounded-2xl border border-[rgba(56,189,248,0.15)] bg-[#0c1a28]/75",
    heroClass: "venue-hero-mare",
    instagram: "https://www.instagram.com/mare__rest/",
    backdropImage: "/backgrounds/mare-greece.jpg",
    backdropPosition: "center bottom",
    backdropSize: "cover",
    backdropOpacity: 0.55,
  },
  "chilling-lounge": {
    id: "chilling-lounge",
    accent: "#e879f9",
    accentSoft: "rgba(232, 121, 249, 0.15)",
    background: "#0a0810",
    surface: "#14101c",
    surfaceBorder: "rgba(232, 121, 249, 0.18)",
    text: "#f8f0fc",
    textMuted: "#a394b5",
    buttonText: "#0a0810",
    heroOverlay:
      "linear-gradient(to top, #0a0810 0%, rgba(10,8,16,0.5) 50%, rgba(168,85,247,0.28) 100%)",
    glow: "radial-gradient(ellipse at 50% 0%, rgba(232,121,249,0.2) 0%, transparent 55%)",
    cardClass: "venue-glass rounded-2xl border border-[rgba(232,121,249,0.15)] bg-[#14101c]/75",
    heroClass: "venue-hero-chilling",
    instagram: "https://www.instagram.com/chilling_smoke_lounge_nch/",
  },
  urman: {
    id: "urman",
    accent: "#4ade80",
    accentSoft: "rgba(74, 222, 128, 0.15)",
    background: "#08100c",
    surface: "#0f1a14",
    surfaceBorder: "rgba(74, 222, 128, 0.18)",
    text: "#eef8f1",
    textMuted: "#8faa96",
    buttonText: "#08100c",
    heroOverlay:
      "linear-gradient(to top, #08100c 0%, rgba(8,16,12,0.45) 50%, rgba(21,128,61,0.3) 100%)",
    glow: "radial-gradient(ellipse at 20% 20%, rgba(74,222,128,0.18) 0%, transparent 50%)",
    cardClass: "venue-glass rounded-2xl border border-[rgba(74,222,128,0.15)] bg-[#0f1a14]/75",
    heroClass: "venue-hero-urman",
    instagram: "https://www.instagram.com/urman.nch/",
  },
  "chillout-ethno": {
    id: "chillout-ethno",
    accent: "#f59e0b",
    accentSoft: "rgba(245, 158, 11, 0.15)",
    background: "#100e08",
    surface: "#1a1610",
    surfaceBorder: "rgba(245, 158, 11, 0.2)",
    text: "#faf6ef",
    textMuted: "#b0a590",
    buttonText: "#100e08",
    heroOverlay:
      "linear-gradient(to top, #100e08 0%, rgba(16,14,8,0.5) 50%, rgba(180,83,9,0.28) 100%)",
    glow: "radial-gradient(ellipse at 60% 15%, rgba(245,158,11,0.2) 0%, transparent 50%)",
    cardClass: "venue-glass rounded-xl border border-[rgba(245,158,11,0.18)] bg-[#1a1610]/75",
    heroClass: "venue-hero-ethno",
    instagram: "https://www.instagram.com/chillout_ethno_bar_elabuga/",
  },
  "chillout-club": {
    id: "chillout-club",
    accent: "#ef4444",
    accentSoft: "rgba(239, 68, 68, 0.15)",
    background: "#0a0000",
    surface: "#160808",
    surfaceBorder: "rgba(239, 68, 68, 0.2)",
    text: "#fff0f0",
    textMuted: "#b59090",
    buttonText: "#ffffff",
    heroOverlay:
      "linear-gradient(to top, #0a0000 0%, rgba(10,0,0,0.55) 45%, rgba(220,38,38,0.35) 100%)",
    glow: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.25) 0%, transparent 55%)",
    cardClass: "venue-glass rounded-lg border border-[rgba(239,68,68,0.2)] bg-[#160808]/75",
    heroClass: "venue-hero-club",
    instagram: "https://www.instagram.com/chillout_almetyevsk/",
  },
};

const slugToTheme: Record<string, VenueThemeId> = {
  "the-bird": "the-bird",
  "buddu-lounge": "buddu-lounge",
  mare: "mare",
  "chilling-lounge-prospekt": "chilling-lounge",
  "chilling-lounge-torgovy": "chilling-lounge",
  "chilling-lounge-kazan": "chilling-lounge",
  urman: "urman",
  "chillout-ethno-yelabuga": "chillout-ethno",
  "chillout-resto-almetievsk": "chillout-club",
};

const kazanInstagram = "https://www.instagram.com/chilling_smoke_lounge_kzn/";

export function getVenueTheme(slug: string): VenueTheme {
  const themeId = slugToTheme[slug] ?? "the-bird";
  const theme = { ...themes[themeId] };

  if (slug === "chilling-lounge-kazan") {
    theme.instagram = kazanInstagram;
  } else if (slug === "chilling-lounge-torgovy") {
    theme.instagram = themes["chilling-lounge"].instagram;
  }

  return theme;
}
