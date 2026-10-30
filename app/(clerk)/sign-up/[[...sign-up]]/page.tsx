import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Crear cuenta — Decorgrass Admin" };

// El registro está en modo "solo por invitación" (Clerk → sign_up_mode: restricted):
// esta página solo sirve para aceptar una invitación enviada desde /dashboard/usuarios.
export default function SignUpPage() {
  return <SignUp />;
}
