import {
  HeroInicio,
  HeroDecorativa,
  HeroParques,
  HeroDeportiva,
  HeroProceso,
  HeroProyectos,
  HeroContacto,
} from "@/app/components/home/landing/sections";

// Cada sección es un hero a pantalla completa con su propia foto real y su CTA.
// Tapetes y atrapamugres entra aquí cuando haya fotos y textos reales.
export default function HomePage() {
  return (
    <>
      <HeroInicio />
      <HeroDecorativa />
      <HeroParques />
      <HeroDeportiva />
      <HeroProceso />
      <HeroProyectos />
      <HeroContacto />
    </>
  );
}
