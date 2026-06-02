import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  linked?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "onLight" | "onDark";
  className?: string;
}

const sizes = {
  sm: {
    title: "text-[1.35rem] leading-none",
    tag: "mt-1 text-[6px] tracking-[0.32em]",
  },
  md: {
    title: "text-[1.65rem] leading-none",
    tag: "mt-1 text-[7px] tracking-[0.32em]",
  },
  lg: {
    title: "text-[2.35rem] leading-none",
    tag: "mt-1.5 text-[9px] tracking-[0.34em]",
  },
} as const;

export function BrandLogo({
  href = "/",
  linked = true,
  size = "md",
  variant = "onLight",
  className = "",
}: BrandLogoProps) {
  const config = sizes[size];
  const onDark = variant === "onDark";

  const logo = (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`font-brand font-black tracking-[-0.04em] ${config.title} ${
          onDark ? "text-white" : "text-neutral-900"
        }`}
      >
        МАРУ
      </span>
      <span
        className={`font-sans font-medium uppercase ${config.tag} ${
          onDark ? "text-white/80" : "text-neutral-500"
        }`}
      >
        Кухня и кофе
      </span>
    </div>
  );

  if (linked) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {logo}
      </Link>
    );
  }

  return logo;
}
