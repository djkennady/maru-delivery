export type CategoryTheme = {
  from: string;
  mid: string;
  to: string;
  glow: string;
  accent: string;
};

const BY_ID: Record<string, CategoryTheme> = {
  breakfast: {
    from: "#2a1c10",
    mid: "#1a120c",
    to: "#050505",
    glow: "rgba(251, 191, 36, 0.28)",
    accent: "#fbbf24",
  },
  coffee: {
    from: "#3a1e0c",
    mid: "#1c1008",
    to: "#050505",
    glow: "rgba(249, 115, 22, 0.32)",
    accent: "#fb923c",
  },
  drinks: {
    from: "#0f2a22",
    mid: "#0a1814",
    to: "#050505",
    glow: "rgba(45, 212, 191, 0.28)",
    accent: "#2dd4bf",
  },
  food: {
    from: "#1a2030",
    mid: "#10141c",
    to: "#050505",
    glow: "rgba(96, 165, 250, 0.26)",
    accent: "#60a5fa",
  },
  desserts: {
    from: "#2a1420",
    mid: "#180c14",
    to: "#050505",
    glow: "rgba(244, 114, 182, 0.28)",
    accent: "#f472b6",
  },
};

const FALLBACK: CategoryTheme = {
  from: "#1a1c28",
  mid: "#101218",
  to: "#050505",
  glow: "rgba(139, 92, 246, 0.24)",
  accent: "#a78bfa",
};

export function getCategoryTheme(categoryId: string): CategoryTheme {
  return BY_ID[categoryId] ?? FALLBACK;
}
