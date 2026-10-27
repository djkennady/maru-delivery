export type ProductTheme = {
  from: string;
  mid: string;
  to: string;
  wash: string;
  cta: string;
  ctaShadow: string;
};

const THEMES: ProductTheme[] = [
  {
    from: "#1a1428",
    mid: "#12101c",
    to: "#0a0910",
    wash: "rgba(139, 92, 246, 0.18)",
    cta: "#8b5cf6",
    ctaShadow: "rgba(139, 92, 246, 0.28)",
  },
  {
    from: "#12201a",
    mid: "#0e1612",
    to: "#080c0a",
    wash: "rgba(16, 185, 129, 0.16)",
    cta: "#10b981",
    ctaShadow: "rgba(16, 185, 129, 0.26)",
  },
  {
    from: "#221810",
    mid: "#16120c",
    to: "#0c0906",
    wash: "rgba(249, 115, 22, 0.16)",
    cta: "#f97316",
    ctaShadow: "rgba(249, 115, 22, 0.26)",
  },
  {
    from: "#121c28",
    mid: "#0e141c",
    to: "#080b10",
    wash: "rgba(59, 130, 246, 0.18)",
    cta: "#3b82f6",
    ctaShadow: "rgba(59, 130, 246, 0.28)",
  },
  {
    from: "#24161c",
    mid: "#181014",
    to: "#0c080a",
    wash: "rgba(244, 114, 182, 0.15)",
    cta: "#f472b6",
    ctaShadow: "rgba(244, 114, 182, 0.24)",
  },
  {
    from: "#12201e",
    mid: "#0e1615",
    to: "#080c0b",
    wash: "rgba(45, 212, 191, 0.15)",
    cta: "#14b8a6",
    ctaShadow: "rgba(45, 212, 191, 0.24)",
  },
  {
    from: "#1c1624",
    mid: "#141018",
    to: "#0a0810",
    wash: "rgba(167, 139, 250, 0.16)",
    cta: "#a78bfa",
    ctaShadow: "rgba(167, 139, 250, 0.26)",
  },
  {
    from: "#221616",
    mid: "#161010",
    to: "#0c0808",
    wash: "rgba(248, 113, 113, 0.14)",
    cta: "#f87171",
    ctaShadow: "rgba(248, 113, 113, 0.22)",
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
