"use client";

import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import type { MenuData, DishDTO } from "@/lib/types";
import type { MenuFont } from "@/lib/validations";
import { formatCOP } from "@/lib/format";
import { hexToRgbTriplet, isLightColor } from "@/lib/color";

interface Props {
  data: MenuData;
}

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

const FONT_STACKS: Record<MenuFont, string> = {
  serif: '"Playfair Display", Georgia, serif',
  sans: '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif',
  rounded: '"Poppins", "Inter", sans-serif',
};

// Sobreescriben las variables de globals.css solo dentro de la carta pública.
const LIGHT_THEME_VARS = {
  "--c-bg": "250 247 242",
  "--c-surface": "255 255 255",
  "--c-ink": "38 32 25",
  "--c-muted": "128 118 104",
  "--c-line": "229 221 208",
};

function DishImage({ src, name, light }: { src: string | null; name: string; light: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const gradientSeed = name
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);

  if (src) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 ${
            loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        />
      </div>
    );
  }

  const hue = gradientSeed % 360;
  const gradient = light
    ? `linear-gradient(135deg, hsl(${hue}, 35%, 90%), hsl(${(hue + 60) % 360}, 30%, 82%))`
    : `linear-gradient(135deg, hsl(${hue}, 30%, 20%), hsl(${(hue + 60) % 360}, 25%, 15%))`;
  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: gradient }}
    >
      <svg
        className={`h-16 w-16 ${light ? "text-black/15" : "text-white/20"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function TagBadge({ tag }: { tag: string }) {
  const styles: Record<string, string> = {
    recomendado: "bg-brand/20 text-brand border-brand/30",
    picante: "bg-danger/20 text-danger border-danger/30",
    vegetariano: "bg-success/20 text-success border-success/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[tag] ?? "border-line bg-surface text-muted"
      }`}
    >
      {tag === "recomendado" && "★ "}
      {tag}
    </span>
  );
}

function QtyControls({
  qty,
  soldOut,
  onAdd,
  onChange,
}: {
  qty: number;
  soldOut: boolean;
  onAdd: () => void;
  onChange: (delta: number) => void;
}) {
  if (qty > 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-surface px-3 py-1.5">
        <button
          onClick={() => onChange(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-muted hover:bg-line hover:text-ink"
        >
          −
        </button>
        <span className="min-w-[1.5rem] text-center font-semibold text-ink">{qty}</span>
        <button
          onClick={() => onChange(1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-muted hover:bg-line hover:text-ink"
        >
          +
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onAdd}
      disabled={soldOut}
      className="rounded-xl bg-brand/20 px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/30 disabled:opacity-0"
    >
      Agregar
    </button>
  );
}

export function PublicMenu({ data }: Props) {
  const { business, categories } = data;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const activeColor = business.accentColor || "#d4a853";
  const isLightTheme = business.theme === "light";
  const compact = business.layoutStyle === "list";

  const themeStyle = {
    ...(isLightTheme ? LIGHT_THEME_VARS : {}),
    "--c-brand": hexToRgbTriplet(activeColor) ?? "212 168 83",
    "--c-brand-ink": isLightColor(activeColor) ? "24 22 18" : "255 255 255",
    "--font-display": FONT_STACKS[business.fontStyle],
  } as CSSProperties;

  const setCategoryRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      categoryRefs.current.set(id, el);
    } else {
      categoryRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSelectedCategory(entry.target.id.replace("cat-", ""));
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    categoryRefs.current.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  function addToCart(dish: { id: string; name: string; price: number; soldOut: boolean }) {
    if (dish.soldOut) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.dishId === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dishId === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
    });
  }

  function updateQty(dishId: string, delta: number) {
    setCart((prev) => {
      const item = prev.find((i) => i.dishId === dishId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.dishId !== dishId);
      return prev.map((i) =>
        i.dishId === dishId ? { ...i, quantity: newQty } : i
      );
    });
  }

  function getItemQty(dishId: string): number {
    return cart.find((item) => item.dishId === dishId)?.quantity ?? 0;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleWhatsAppOrder() {
    if (!business.whatsapp || totalItems === 0) return;
    const digits = business.whatsapp.replace(/\D/g, "");
    const waNumber = digits.startsWith("57") ? digits : `57${digits}`;

    let message = "¡Hola! Quiero hacer un pedido:\n\n";
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} — ${formatCOP(item.price * item.quantity)}\n`;
    });
    message += `\n💰 *Total: ${formatCOP(totalPrice)}*`;
    message += `\n\n🪑 Mesa / Dirección: (escriba aquí)`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  function scrollToCategory(id: string) {
    setSelectedCategory(id);
    const el = categoryRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderGridCard(dish: DishDTO, dishIdx: number) {
    const qty = getItemQty(dish.id);
    return (
      <div
        key={dish.id}
        className={`animate-fade-in-up rounded-2xl border bg-surface/80 transition-all duration-300 ${
          dish.soldOut
            ? "border-line/40 opacity-50"
            : "border-line hover:border-brand/40"
        }`}
        style={{
          animationDelay: `${(dishIdx % 4) * 100}ms`,
        }}
      >
        <div className="relative">
          <DishImage src={dish.imageUrl} name={dish.name} light={isLightTheme} />
          {dish.soldOut && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
              <span className="rounded-full bg-surface/90 px-4 py-1.5 text-sm font-bold text-muted backdrop-blur-sm">
                Agotado hoy
              </span>
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-tight text-ink">
              {dish.name}
            </h3>
            <span
              className="shrink-0 text-lg font-bold"
              style={{ color: activeColor }}
            >
              {formatCOP(dish.price)}
            </span>
          </div>
          {dish.description && (
            <p className="text-sm leading-relaxed text-muted">
              {dish.description}
            </p>
          )}
          {dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {dish.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-1">
            <QtyControls
              qty={qty}
              soldOut={dish.soldOut}
              onAdd={() => addToCart(dish)}
              onChange={(delta) => updateQty(dish.id, delta)}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderListCard(dish: DishDTO, dishIdx: number) {
    const qty = getItemQty(dish.id);
    return (
      <div
        key={dish.id}
        className={`animate-fade-in-up flex gap-3 rounded-2xl border bg-surface/80 p-3 transition-all duration-300 ${
          dish.soldOut
            ? "border-line/40 opacity-50"
            : "border-line hover:border-brand/40"
        }`}
        style={{
          animationDelay: `${(dishIdx % 6) * 60}ms`,
        }}
      >
        {dish.imageUrl && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dish.imageUrl}
              alt={dish.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-ink">{dish.name}</h3>
            <span
              className="shrink-0 font-bold"
              style={{ color: activeColor }}
            >
              {formatCOP(dish.price)}
            </span>
          </div>
          {dish.description && (
            <p className="mt-0.5 text-sm leading-snug text-muted line-clamp-2">
              {dish.description}
            </p>
          )}
          <div className="mt-1.5 flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {dish.soldOut ? (
                <span className="text-xs font-bold text-danger">Agotado hoy</span>
              ) : (
                dish.tags.map((tag) => <TagBadge key={tag} tag={tag} />)
              )}
            </div>
            <QtyControls
              qty={qty}
              soldOut={dish.soldOut}
              onAdd={() => addToCart(dish)}
              onChange={(delta) => updateQty(dish.id, delta)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-ink" style={themeStyle}>
      {/* Hero */}
      <div className="relative">
        {business.heroUrl ? (
          <div className="relative h-64 overflow-hidden md:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={business.heroUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/30 to-bg" />
          </div>
        ) : (
          <div
            className="flex h-56 items-end md:h-72"
            style={{
              background: isLightTheme
                ? "linear-gradient(135deg, #f0e9dd, #e5d8c3)"
                : "linear-gradient(135deg, #1a1a20, #2a2520)",
            }}
          />
        )}

        {/* Logo + Name */}
        <div className="relative -mt-20 flex flex-col items-center px-6 pb-6">
          {business.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-24 w-24 rounded-full border-4 border-bg object-cover shadow-xl"
            />
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-bg text-3xl font-bold shadow-xl"
              style={{ backgroundColor: activeColor, color: "#121216" }}
            >
              {business.name.charAt(0)}
            </div>
          )}
          <h1
            className="mt-4 text-center font-display text-3xl font-bold tracking-tight"
            style={{ color: activeColor }}
          >
            {business.name}
          </h1>
          {business.tagline && (
            <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-muted">
              {business.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Sticky Category Bar */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-md">
        <div className="flex gap-1 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-brand text-brand-ink shadow-lg"
                  : "bg-surface text-muted hover:text-ink"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes by Category */}
      <div className="px-4 pb-8 pt-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            id={`cat-${cat.id}`}
            ref={(el) => setCategoryRef(cat.id, el)}
            className="scroll-mt-28"
          >
            <h2
              className="mb-4 mt-6 font-display text-2xl font-semibold"
              style={{ color: activeColor }}
            >
              {cat.name}
            </h2>
            <div className={compact ? "space-y-2.5" : "grid gap-4 sm:grid-cols-2"}>
              {cat.dishes.map((dish, dishIdx) =>
                compact ? renderListCard(dish, dishIdx) : renderGridCard(dish, dishIdx)
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mx-4 border-t border-line pb-32 pt-6 text-center">
        <p className="text-xs text-muted">
          Carta digital desarrollada por{" "}
          <span className="font-semibold text-ink">New Tech Industries</span>
        </p>
      </footer>

      {/* Floating WhatsApp Button */}
      {totalItems > 0 && business.whatsapp && (
        <div className="no-print fixed bottom-0 left-0 right-0 z-20 animate-fade-in">
          <div className="mx-auto max-w-2xl px-4 pb-4">
            <button
              onClick={handleWhatsAppOrder}
              className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold shadow-2xl transition-all active:scale-[0.98]"
              style={{
                backgroundColor: "#25D366",
                color: "#fff",
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp ({totalItems}{" "}
              {totalItems === 1 ? "item" : "items"} — {formatCOP(totalPrice)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
