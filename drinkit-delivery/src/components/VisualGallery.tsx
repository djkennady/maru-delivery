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
    <div className={`relative overflow-hidden ring-1 ring-white/10 ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition duration-700 hover:scale-105"
        sizes={sizes}
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
}

export function VisualGallery() {
  return (
    <section className="px-4 py-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3">
          <p className="text-[11px] font-medium lowercase tracking-[0.18em] text-white/40">
            атмосфера
          </p>
          <h2 className="text-xl font-semibold lowercase text-white md:text-2xl">
            как у нас в кофейне
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-white/55">
            Не только еда в корзине — зал, стойка бариста и настроение МАРУ.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <GalleryTile
            photo={galleryImages[0]}
            className="aspect-[16/10] rounded-[1.75rem] md:col-span-2 md:aspect-auto md:min-h-[280px]"
            sizes="(max-width: 768px) 100vw, 70vw"
            priority
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {galleryImages.slice(1, 3).map((photo) => (
              <GalleryTile
                key={photo.src}
                photo={photo}
                className="aspect-[4/3] rounded-2xl md:min-h-[134px]"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
