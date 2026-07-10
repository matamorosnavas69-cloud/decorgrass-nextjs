import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import WhatsAppButton from "@/app/components/layout/WhatsAppButton";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
