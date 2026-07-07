"use client";

import { useState } from "react";
import type { CategoryDTO } from "@/lib/types";

interface Props {
  categories: CategoryDTO[];
  onUpdate: (categories: CategoryDTO[]) => void;
  onClose: () => void;
}

export function CategoryManager({ categories: initial, onUpdate, onClose }: Props) {
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setCategories((prev) => [...prev, data.category]);
        setNewName("");
      } else {
        setError(data.message ?? "Error");
      }
    } catch {
      setError("Error de conexión");
    }
  }

  async function handleUpdate(id: string, name: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, name } : c))
        );
        setEditing(null);
      }
    } catch {
      setError("Error al actualizar");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría? Los platos quedarán sin categoría.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      setError("Error al eliminar");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center">
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-bg p-6 sm:mx-auto sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink">Categorías</h2>
          <button onClick={onClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-danger/15 px-4 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <form onSubmit={handleCreate} className="mb-4 flex gap-2">
          <input
            className="field flex-1"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nueva categoría…"
          />
          <button type="submit" className="btn-primary">
            +
          </button>
        </form>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
            >
              {editing?.id === cat.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(cat.id, editing.name);
                  }}
                  className="flex flex-1 gap-2"
                >
                  <input
                    className="field flex-1"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    autoFocus
                  />
                  <button type="submit" className="btn-primary text-sm">
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="btn-secondary text-sm"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <>
                  <span className="text-sm font-medium text-ink">{cat.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing({ id: cat.id, name: cat.name })}
                      className="rounded-lg px-2 py-1 text-xs text-muted hover:text-ink"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="rounded-lg px-2 py-1 text-xs text-danger hover:text-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
