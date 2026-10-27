export type ProductTheme = {
  from: string;
  via: string;
  to: string;
  glow: string;
  cta: string;
  ctaShadow: string;
};

const THEMES: ProductTheme[] = [
  {
    from: "#1b1233",
    via: "#0c0a14",
    to: "#050508",
    glow: "rgba(139, 92, 246, 0.38)",
    cta: "#8b5cf6",
    ctaShadow: "rgba(139, 92, 246, 0.35)",
  },
  {
    from: "#10241c",
    via: "#0a120f",
    to: "#050807",
    glow: "rgba(16, 185, 129, 0.34)",
    cta: "#10b981",
    ctaShadow: "rgba(16, 185, 129, 0.32)",
  },
  {
    from: "#24160c",
    via: "#140e08",
    to: "#080604",
    glow: "rgba(249, 115, 22, 0.34)",
    cta: "#f97316",
    ctaShadow: "rgba(249, 115, 22, 0.32)",
  },
  {
    from: "#0d1b2e",
    via: "#081018",
    to: "#04070c",
    glow: "rgba(59, 130, 246, 0.38)",
    cta: "#3b82f6",
    ctaShadow: "rgba(59, 130, 246, 0.35)",
  },
  {
    from: "#2a1020",
    via: "#140810",
    to: "#080407",
    glow: "rgba(244, 114, 182, 0.34)",
    cta: "#f472b6",
    ctaShadow: "rgba(244, 114, 182, 0.32)",
  },
  {
    from: "#102422",
    via: "#0a1413",
    to: "#050908",
    glow: "rgba(45, 212, 191, 0.32)",
    cta: "#14b8a6",
    ctaShadow: "rgba(45, 212, 191, 0.3)",
  },
  {
    from: "#1e1430",
    via: "#100c18",
    to: "#07050c",
    glow: "rgba(167, 139, 250, 0.36)",
    cta: "#a78bfa",
    ctaShadow: "rgba(167, 139, 250, 0.32)",
  },
  {
    from: "#241818",
    via: "#120c0c",
    to: "#080505",
    glow: "rgba(248, 113, 113, 0.3)",
    cta: "#f87171",
    ctaShadow: "rgba(248, 113, 113, 0.28)",
  },
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getProductTheme(productId: string): ProductTheme {
  return THEMES[hashId(productId) % THEMES.length];
}
