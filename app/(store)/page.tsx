import Hero from "@/app/components/home/Hero";
import CategoryBar from "@/app/components/home/CategoryBar";
import Solutions from "@/app/components/home/Solutions";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";
import QuickQuote from "@/app/components/home/QuickQuote";
import BeforeAfter from "@/app/components/home/BeforeAfter";
import Process from "@/app/components/home/Process";
import Benefits from "@/app/components/home/Benefits";
import Testimonials from "@/app/components/home/Testimonials";
import PromoBanner from "@/app/components/home/PromoBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryBar />
      <Solutions />
      <FeaturedProducts />
      <QuickQuote />
      <BeforeAfter />
      <Process />
      <Benefits />
      <Testimonials />
      <PromoBanner />
    </>
  );
}
