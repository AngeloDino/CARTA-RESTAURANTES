"use client";

import { useRef, useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  hint?: string;
  /** Relación de aspecto de la vista previa. */
  aspect?: "wide" | "square";
}

// El backend rechaza imageUrl de más de 400.000 caracteres; se comprime
// hasta quedar por debajo con margen.
const MAX_DATA_URL_LENGTH = 390_000;
const MAX_DIMENSION = 1280;

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const quality of [0.82, 0.7, 0.58, 0.45, 0.32]) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= MAX_DATA_URL_LENGTH) return dataUrl;
  }
  throw new Error("La imagen es demasiado grande incluso comprimida");
}

export function ImageUpload({ label, value, onChange, hint, aspect = "wide" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await fileToCompressedDataUrl(file));
    } catch {
      setError("No se pudo procesar la imagen. Intente con otra foto.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="space-y-2">
          <div
            className={`overflow-hidden rounded-xl border border-line bg-surface ${
              aspect === "square" ? "h-24 w-24" : "aspect-[3/1] w-full"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="btn-secondary flex-1 text-sm"
            >
              {busy ? "Procesando…" : "Cambiar foto"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={busy}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-surface/50 text-muted transition-colors hover:border-brand/40 hover:text-ink ${
            aspect === "square" ? "h-24" : "h-20"
          }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 12h.008v.008H18V12zm-4.5 8.25h7.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25h9.75z"
            />
          </svg>
          <span className="text-sm font-medium">{busy ? "Procesando…" : "Subir foto"}</span>
        </button>
      )}

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
