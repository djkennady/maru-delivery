import type { VenueTheme } from "@/types/venue-theme";
import type { CSSProperties, ReactNode } from "react";

interface VenueThemeShellProps {
  theme: VenueTheme;
  children: ReactNode;
}

export function VenueThemeShell({ theme, children }: VenueThemeShellProps) {
  const themeVars = {
    "--venue-accent": theme.accent,
    "--venue-accent-soft": theme.accentSoft,
    "--venue-bg": theme.background,
    "--venue-surface": theme.surface,
    "--venue-surface-border": theme.surfaceBorder,
    "--venue-text": theme.text,
    "--venue-text-muted": theme.textMuted,
    "--venue-btn-text": theme.buttonText,
    "--venue-hero-overlay": theme.heroOverlay,
    "--venue-glow": theme.glow,
  } as CSSProperties;

  const photoStyle = theme.backdropImage
    ? ({
        backgroundImage: `url(${theme.backdropImage})`,
        backgroundPosition: theme.backdropPosition ?? "center",
        backgroundSize: theme.backdropSize ?? "cover",
        opacity: theme.backdropOpacity ?? 0.45,
      } as CSSProperties)
    : undefined;

  return (
    <div
      className={`venue-theme venue-theme--${theme.id} min-h-full`}
      style={{
        ...themeVars,
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {theme.backdropImage && (
        <div className="venue-backdrop-photo" style={photoStyle} aria-hidden />
      )}
      <div className="venue-backdrop" aria-hidden />
      <div className="venue-backdrop-glow" aria-hidden />
      <div className="venue-backdrop-vignette" aria-hidden />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
