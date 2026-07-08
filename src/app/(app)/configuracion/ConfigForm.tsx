"use client";

import { useState } from "react";
import type { BusinessDTO } from "@/lib/types";
import type { MenuTheme, MenuFont, MenuLayout } from "@/lib/validations";
import { ImageUpload } from "@/components/ImageUpload";

interface Props {
  business: BusinessDTO;
}

function OptionPicker<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; title: string; caption?: string; previewClass?: string }[];
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border-2 px-2 py-3 text-center transition-colors ${
              value === opt.value
                ? "border-brand bg-brand/10"
                : "border-line bg-surface hover:border-brand/40"
            }`}
          >
            <span className={`block text-lg leading-none text-ink ${opt.previewClass ?? ""}`}>
              {opt.title}
            </span>
            {opt.caption && (
              <span className="mt-1 block text-xs text-muted">{opt.caption}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ConfigForm({ business }: Props) {
  const [name, setName] = useState(business.name);
  const [whatsapp, setWhatsapp] = useState(business.whatsapp ?? "");
  const [accentColor, setAccentColor] = useState(business.accentColor);
  const [logoUrl, setLogoUrl] = useState(business.logoUrl ?? "");
  const [heroUrl, setHeroUrl] = useState(business.heroUrl ?? "");
  const [theme, setTheme] = useState<MenuTheme>(business.theme);
  const [fontStyle, setFontStyle] = useState<MenuFont>(business.fontStyle);
  const [layoutStyle, setLayoutStyle] = useState<MenuLayout>(business.layoutStyle);
  const [tagline, setTagline] = useState(business.tagline ?? "");
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
          logoUrl,
          heroUrl,
          theme,
          fontStyle,
          layoutStyle,
          tagline: tagline.trim(),
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-muted">Información del restaurante</h2>

        <div>
          <label className="label">Nombre del restaurante</label>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="label">Frase de bienvenida</label>
          <input
            className="field"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={120}
            placeholder="Ej: Cocina tradicional hecha con amor"
          />
          <p className="mt-1 text-xs text-muted">Aparece bajo el nombre en la carta. Opcional.</p>
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

        <ImageUpload
          label="Logo del restaurante"
          value={logoUrl}
          onChange={setLogoUrl}
          aspect="square"
          hint="Se muestra en círculo al inicio de la carta."
        />

        <ImageUpload
          label="Foto de portada"
          value={heroUrl}
          onChange={setHeroUrl}
          hint="Imagen grande en la cabecera de la carta pública."
        />
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-muted">Apariencia de la carta</h2>

        <OptionPicker<MenuTheme>
          label="Tema"
          value={theme}
          onChange={setTheme}
          options={[
            { value: "dark", title: "🌙", caption: "Oscuro" },
            { value: "light", title: "☀️", caption: "Claro" },
          ]}
        />

        <OptionPicker<MenuFont>
          label="Tipografía de títulos"
          value={fontStyle}
          onChange={setFontStyle}
          options={[
            { value: "serif", title: "Aa", caption: "Elegante", previewClass: "font-serif" },
            { value: "sans", title: "Aa", caption: "Moderna", previewClass: "font-sans font-semibold" },
            {
              value: "rounded",
              title: "Aa",
              caption: "Redondeada",
              previewClass: "font-semibold [font-family:Poppins,sans-serif]",
            },
          ]}
        />

        <OptionPicker<MenuLayout>
          label="Estilo de los platos"
          value={layoutStyle}
          onChange={setLayoutStyle}
          options={[
            { value: "grid", title: "🖼️", caption: "Tarjetas con foto" },
            { value: "list", title: "📋", caption: "Lista compacta" },
          ]}
        />

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
          <p className="mt-1 text-xs text-muted">
            Tiñe títulos, precios, botones y etiquetas de la carta.
          </p>
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
