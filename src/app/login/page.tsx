import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión — Carta" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-serif text-5xl font-bold tracking-tight text-brand">
          Carta
        </h1>
        <p className="text-lg text-muted">
          Menú digital para su restaurante
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted">
        ¿Aún no tiene cuenta? Escríbanos y la creamos por usted.
        <br />
        Un producto de <strong className="text-ink">New Tech Industries</strong>.
      </p>
    </main>
  );
}
