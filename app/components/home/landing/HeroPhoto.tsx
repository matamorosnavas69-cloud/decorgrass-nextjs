import { getImageProps } from "next/image";

interface HeroPhotoProps {
  /** Recorte horizontal (1920×1150) en /public/landing */
  src: string;
  /** Recorte vertical (780×1560) para móvil; si falta se usa `src` */
  mobileSrc?: string;
  alt: string;
  /** Solo para la primera foto de la página (LCP) */
  priority?: boolean;
}

/**
 * Foto a sangre de una sección hero, con dirección de arte móvil/escritorio.
 * Va `absolute inset-0`: el contenedor posicionado más cercano define su área.
 */
export default function HeroPhoto({ src, mobileSrc, alt, priority = false }: HeroPhotoProps) {
  const common = { alt, sizes: "100vw" };
  const { props: desktop } = getImageProps({ ...common, src, width: 1920, height: 1150 });
  const mobile = mobileSrc
    ? getImageProps({ ...common, src: mobileSrc, width: 780, height: 1560 }).props.srcSet
    : undefined;

  return (
    <picture>
      {mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
      {/* <picture> necesita <img>; getImageProps ya entrega srcSet optimizado.
          Sin `preload` (un <link> no sabe de <source media>); en la primera foto basta
          eager + fetchPriority: el navegador solo descarga la fuente que elige. */}
      <img
        {...desktop}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}
