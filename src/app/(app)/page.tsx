import { requireSession } from "@/server/auth";
import { getBusiness } from "@/server/services/business";
import { listDishes } from "@/server/services/dishes";
import { listCategories } from "@/server/services/categories";
import Link from "next/link";
import { PublicLinkCard } from "@/components/PublicLinkCard";

export default async function DashboardPage() {
  const { businessId } = await requireSession();
  const [business, dishes, categories] = await Promise.all([
    getBusiness(businessId),
    listDishes(businessId),
    listCategories(businessId),
  ]);

  const soldOutCount = dishes.filter((d) => d.soldOut).length;
  const totalDishes = dishes.length;

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

      {business && <PublicLinkCard slug={business.slug} />}
    </div>
  );
}
