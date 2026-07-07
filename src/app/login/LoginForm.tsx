"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleDemo() {
    setLoading(true);
    await signIn("credentials", { demo: "true", redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-xl bg-danger/15 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <div>
        <label className="label">Correo electrónico</label>
        <input
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className="label">Contraseña</label>
        <input
          type="password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary mt-2">
        {loading ? "Entrando…" : "Iniciar sesión"}
      </button>
      <button
        type="button"
        onClick={handleDemo}
        disabled={loading}
        className="btn-secondary"
      >
        Probar demo
      </button>
    </form>
  );
}
