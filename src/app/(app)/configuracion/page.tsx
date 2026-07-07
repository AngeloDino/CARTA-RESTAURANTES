import { requireSession } from "@/server/auth";
import { getBusiness } from "@/server/services/business";
import { ConfigForm } from "./ConfigForm";
import { QRGenerator } from "./QRGenerator";

export default async function ConfigPage() {
  const { businessId } = await requireSession();
  const business = await getBusiness(businessId);
  if (!business) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-ink">Configuración</h1>

      <ConfigForm business={business} />

      <QRGenerator
        businessName={business.name}
        slug={business.slug}
        accentColor={business.accentColor}
      />
    </div>
  );
}
