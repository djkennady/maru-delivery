import Image from "next/image";
import { galleryImages } from "@/lib/media";

function GalleryTile({
  photo,
  className,
  sizes,
  priority,
}: {
  photo: { src: string; alt: string };
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

export function VisualGallery() {
  return (
    <section className="px-4 py-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Атмосфера
          </p>
          <h2 className="text-xl font-black text-[var(--text)]">
            Как у нас в кофейне
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <GalleryTile
            photo={galleryImages[0]}
            className="aspect-[16/10] rounded-[1.75rem]"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />

          <div className="grid grid-cols-2 gap-2">
            {galleryImages.slice(1, 3).map((photo) => (
              <GalleryTile
                key={photo.src}
                photo={photo}
                className="aspect-[4/3] rounded-2xl"
                sizes="(max-width: 512px) 50vw, 256px"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
