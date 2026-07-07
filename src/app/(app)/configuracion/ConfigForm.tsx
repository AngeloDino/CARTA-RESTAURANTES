"use client";

import { useState } from "react";
import type { BusinessDTO } from "@/lib/types";

interface Props {
  business: BusinessDTO;
}

export function ConfigForm({ business }: Props) {
  const [name, setName] = useState(business.name);
  const [whatsapp, setWhatsapp] = useState(business.whatsapp ?? "");
  const [accentColor, setAccentColor] = useState(business.accentColor);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          accentColor,
        }),
      });
      const data = await res.json();
      setMessage({
        ok: data.ok,
        text: data.ok ? "Configuración guardada" : data.message ?? "Error",
      });
    } catch {
      setMessage({ ok: false, text: "Error de conexión" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-sm font-semibold text-muted">Información del restaurante</h2>

      <div>
        <label className="label">Nombre del restaurante</label>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="label">WhatsApp para pedidos</label>
        <input
          className="field"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+57 300 123 4567"
        />
        <p className="mt-1 text-xs text-muted">Número al que llegarán los pedidos de los clientes.</p>
      </div>

      <div>
        <label className="label">Color de acento</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="h-12 w-12 cursor-pointer rounded-xl border-2 border-line bg-transparent"
          />
          <span className="text-sm text-muted font-mono">{accentColor}</span>
        </div>
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            message.ok
              ? "bg-success/15 text-success"
              : "bg-danger/15 text-danger"
          }`}
        >
          {message.text}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Guardando…" : "Guardar configuración"}
      </button>
    </form>
  );
}
