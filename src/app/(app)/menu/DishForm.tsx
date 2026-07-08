"use client";

import { useState } from "react";
import type { DishDTO, CategoryDTO } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { ImageUpload } from "@/components/ImageUpload";

interface Props {
  dish: DishDTO | null;
  categories: CategoryDTO[];
  onSave: (dish: DishDTO) => void;
  onClose: () => void;
}

export function DishForm({ dish, categories, onSave, onClose }: Props) {
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [priceText, setPriceText] = useState(dish ? formatCOP(dish.price).replace("$", "") : "");
  const [categoryId, setCategoryId] = useState(dish?.categoryId ?? "");
  const [tags, setTags] = useState(dish?.tags.join(", ") ?? "");
  const [imageUrl, setImageUrl] = useState(dish?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function parsePrice(text: string): number {
    const clean = text.replace(/[^\d]/g, "");
    return clean ? parseInt(clean, 10) : 0;
  }

  function formatInputPrice(text: string): string {
    const n = parsePrice(text);
    if (n === 0 && text === "") return "";
    return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(n);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const price = parsePrice(priceText);
    if (!name.trim() || price <= 0) {
      setError("Nombre y precio son obligatorios");
      setSaving(false);
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price,
      categoryId,
      tags: tagList,
      imageUrl,
    };

    try {
      const method = dish ? "PUT" : "POST";
      const url = dish ? `/api/dishes/${dish.id}` : "/api/dishes";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        onSave(data.dish);
      } else {
        setError(data.message ?? "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center">
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-bg p-6 sm:mx-auto sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink">
            {dish ? "Editar plato" : "Nuevo plato"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-danger/15 px-4 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div>
            <label className="label">Nombre del plato</label>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Bandeja paisa" required />
          </div>

          <ImageUpload
            label="Foto del plato"
            value={imageUrl}
            onChange={setImageUrl}
            hint="Opcional. Se comprime automáticamente."
          />

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="field min-h-[80px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción apetitosa…"
            />
          </div>

          <div>
            <label className="label">Precio (COP)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
              <input
                className="field pl-8"
                value={priceText}
                onChange={(e) => setPriceText(formatInputPrice(e.target.value))}
                placeholder="25.000"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Categoría</label>
            <select
              className="field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Etiquetas (separadas por coma)</label>
            <input
              className="field"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="recomendado, picante, vegetariano"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "Guardando…" : dish ? "Guardar cambios" : "Crear plato"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
