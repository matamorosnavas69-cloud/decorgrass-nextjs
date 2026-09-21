import type { Metadata } from "next";
import AuthProvider from "@/app/components/auth/AuthProvider";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ClerkLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">{children}</div>
    </AuthProvider>
  );
}
