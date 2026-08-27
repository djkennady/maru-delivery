export type VenueThemeId =
  | "the-bird"
  | "buddu-lounge"
  | "mare"
  | "chilling-lounge"
  | "urman"
  | "chillout-ethno"
  | "chillout-club";

export interface VenueTheme {
  id: VenueThemeId;
  accent: string;
  accentSoft: string;
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textMuted: string;
  buttonText: string;
  heroOverlay: string;
  glow: string;
  cardClass: string;
  heroClass: string;
  instagram: string;
  backdropImage?: string;
  backdropPosition?: string;
  backdropSize?: string;
  backdropOpacity?: number;
}
