"use client";

import { useState } from "react";
import type { DishDTO, CategoryDTO } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { DishForm } from "./DishForm";
import { CategoryManager } from "./CategoryManager";

interface Props {
  dishes: DishDTO[];
  categories: CategoryDTO[];
}

export function MenuList({ dishes: initialDishes, categories: initialCategories }: Props) {
  const [dishes, setDishes] = useState(initialDishes);
  const [categories, setCategories] = useState(initialCategories);
  const [showDishForm, setShowDishForm] = useState(false);
  const [editingDish, setEditingDish] = useState<DishDTO | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggleSoldOut(dishId: string) {
    setToggling(dishId);
    try {
      const res = await fetch("/api/toggle-sold-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId }),
      });
      const data = await res.json();
      if (data.ok) {
        setDishes((prev) =>
          prev.map((d) =>
            d.id === dishId ? { ...d, soldOut: !d.soldOut } : d
          )
        );
      }
    } finally {
      setToggling(null);
    }
  }

  const grouped = categories
    .map((cat) => ({
      ...cat,
      dishes: dishes.filter((d) => d.categoryId === cat.id),
    }))
    .filter((g) => g.dishes.length > 0);

  const uncategorized = dishes.filter((d) => !d.categoryId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-ink">Menú</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="btn-secondary text-sm"
          >
            Categorías
          </button>
          <button
            onClick={() => {
              setEditingDish(null);
              setShowDishForm(true);
            }}
            className="btn-primary text-sm"
          >
            + Plato
          </button>
        </div>
      </div>

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onUpdate={(updated) => {
            setCategories(updated);
            setShowCategoryManager(false);
          }}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {showDishForm && (
        <DishForm
          dish={editingDish}
          categories={categories}
          onSave={(dish) => {
            if (editingDish) {
              setDishes((prev) =>
                prev.map((d) => (d.id === dish.id ? dish : d))
              );
            } else {
              setDishes((prev) => [...prev, dish]);
            }
            setShowDishForm(false);
            setEditingDish(null);
          }}
          onClose={() => {
            setShowDishForm(false);
            setEditingDish(null);
          }}
        />
      )}

      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.id}>
            <h2 className="mb-3 font-serif text-xl font-semibold text-brand">
              {group.name}
            </h2>
            <div className="space-y-2">
              {group.dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  toggling={toggling === dish.id}
                  onToggle={() => toggleSoldOut(dish.id)}
                  onEdit={() => {
                    setEditingDish(dish);
                    setShowDishForm(true);
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {uncategorized.length > 0 && (
          <div>
            <h2 className="mb-3 font-serif text-xl font-semibold text-muted">
              Sin categoría
            </h2>
            <div className="space-y-2">
              {uncategorized.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  toggling={toggling === dish.id}
                  onToggle={() => toggleSoldOut(dish.id)}
                  onEdit={() => {
                    setEditingDish(dish);
                    setShowDishForm(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DishCard({
  dish,
  toggling,
  onToggle,
  onEdit,
}: {
  dish: DishDTO;
  toggling: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={`card flex items-center gap-3 transition-all ${
        dish.soldOut ? "opacity-50" : ""
      }`}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
        {dish.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{dish.name}</p>
        <p className="text-sm text-muted">{formatCOP(dish.price)}</p>
        {dish.soldOut && (
          <span className="text-xs font-medium text-danger">Agotado</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggle}
          disabled={toggling}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
            dish.soldOut
              ? "bg-success/20 text-success"
              : "bg-surface text-muted hover:bg-danger/20 hover:text-danger"
          }`}
        >
          {toggling ? "…" : dish.soldOut ? "Disponible" : "Agotar"}
        </button>
        <button
          onClick={onEdit}
          className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
