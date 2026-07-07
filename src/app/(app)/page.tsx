import { requireSession } from "@/server/auth";
import { getBusiness } from "@/server/services/business";
import { listDishes } from "@/server/services/dishes";
import { listCategories } from "@/server/services/categories";
import { formatCOP } from "@/lib/format";
import Link from "next/link";

export default async function DashboardPage() {
  const { businessId } = await requireSession();
  const [business, dishes, categories] = await Promise.all([
    getBusiness(businessId),
    listDishes(businessId),
    listCategories(businessId),
  ]);

  const soldOutCount = dishes.filter((d) => d.soldOut).length;
  const totalDishes = dishes.length;
  const whatsapp = business?.whatsapp;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Panel</h1>
        <p className="text-sm text-muted">
          {business?.name} · {categories.length} categorías · {totalDishes} platos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/menu"
          className="card flex flex-col items-center gap-2 py-6 text-center transition-colors hover:border-brand/40"
        >
          <span className="text-3xl">🍽️</span>
          <span className="text-sm font-semibold text-ink">Menú</span>
          <span className="text-xs text-muted">{totalDishes} platos</span>
        </Link>
        <Link
          href="/configuracion"
          className="card flex flex-col items-center gap-2 py-6 text-center transition-colors hover:border-brand/40"
        >
          <span className="text-3xl">⚙️</span>
          <span className="text-sm font-semibold text-ink">Configuración</span>
          <span className="text-xs text-muted">QR · Colores · WhatsApp</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-muted">Resumen</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-ink">{totalDishes}</p>
            <p className="text-xs text-muted">Platos activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-danger">{soldOutCount}</p>
            <p className="text-xs text-muted">Agotados hoy</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Link */}
      {whatsapp && (
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold text-muted">Tu menú público</h2>
          <p className="text-sm text-ink">
            Comparte este enlace con tus clientes:
          </p>
          <a
            href={`/menu/${business?.slug}`}
            target="_blank"
            className="block break-all rounded-xl bg-brand/10 px-3 py-2 text-sm font-medium text-brand"
          >
            {typeof window !== "undefined"
              ? `${window.location.origin}/menu/${business?.slug}`
              : `/menu/${business?.slug}`}
          </a>
        </div>
      )}
    </div>
  );
}
