import { requireSession } from "@/server/auth";
import { getBusiness } from "@/server/services/business";
import { Nav } from "@/components/Nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { businessId } = await requireSession();
  const business = await getBusiness(businessId);

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col">
      <header className="no-print sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm"
            style={{
              backgroundColor: business?.accentColor ?? "#d4a853",
              color: "#121216",
            }}
          >
            {business?.name?.charAt(0) ?? "C"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold leading-tight text-ink">
              {business?.name ?? "Mi restaurante"}
            </p>
            <p className="text-xs text-muted">Carta</p>
          </div>
        </div>
      </header>

      {business?.isDemo && (
        <div className="no-print bg-warning/15 px-4 py-2 text-center text-sm font-semibold text-warning">
          Modo demo: datos de prueba que se reinician al volver a entrar.
        </div>
      )}

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <Nav />
    </div>
  );
}
