import Image from "next/image";
import { getPagePhoto } from "@/lib/page-photos";

/** A supporting editorial image; it never changes or substitutes for flow status. */
export function PagePhoto({ route, priority = false, compact = false }: { route: string; priority?: boolean; compact?: boolean }) {
  const photo = getPagePhoto(route);
  if (!photo) return null;
  return (
    <figure data-page-photo={route} className={`page-photo page-photo-${photo.frame}${compact ? " page-photo-compact" : ""}`}>
      <div className="page-photo-window">
        <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} priority={priority} sizes={compact ? "(max-width: 767px) 100vw, 420px" : "(max-width: 1023px) 100vw, 560px"} />
      </div>
    </figure>
  );
}
