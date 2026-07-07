import { prisma } from "../db";
import type { BusinessDTO } from "@/lib/types";

export async function getBusiness(businessId: string): Promise<BusinessDTO | null> {
  const b = await prisma.business.findUnique({
    where: { id: businessId },
  });
  if (!b) return null;
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    heroUrl: b.heroUrl,
    whatsapp: b.whatsapp,
    accentColor: b.accentColor,
    isDemo: b.isDemo,
  };
}

export async function getBusinessBySlug(slug: string): Promise<BusinessDTO | null> {
  const b = await prisma.business.findUnique({
    where: { slug },
  });
  if (!b) return null;
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    heroUrl: b.heroUrl,
    whatsapp: b.whatsapp,
    accentColor: b.accentColor,
    isDemo: b.isDemo,
  };
}

export async function updateBusinessConfig(
  businessId: string,
  data: {
    name: string;
    whatsapp?: string;
    accentColor?: string;
    logoUrl?: string | null;
    heroUrl?: string | null;
  }
): Promise<BusinessDTO | null> {
  const b = await prisma.business.update({
    where: { id: businessId },
    data: {
      name: data.name,
      whatsapp: data.whatsapp || null,
      accentColor: data.accentColor || "#d4a853",
      logoUrl: data.logoUrl || null,
      heroUrl: data.heroUrl || null,
    },
  });
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    heroUrl: b.heroUrl,
    whatsapp: b.whatsapp,
    accentColor: b.accentColor,
    isDemo: b.isDemo,
  };
}
