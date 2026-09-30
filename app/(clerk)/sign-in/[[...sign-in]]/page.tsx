import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Ingresar — Decorgrass Admin" };

export default function SignInPage() {
  return <SignIn />;
}
