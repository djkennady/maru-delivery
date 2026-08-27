import Image from "next/image";
import { cn } from "@/lib/cn";

interface VenueLogoProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function VenueLogo({
  src,
  alt,
  className,
  imageClassName,
  sizes = "120px",
  priority,
}: VenueLogoProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-white/5",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-contain p-1.5", imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
