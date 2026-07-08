import type { Business } from "@prisma/client";
import { prisma } from "../db";
import type { BusinessDTO } from "@/lib/types";
import {
  asMenuTheme,
  asMenuFont,
  asMenuLayout,
  type BusinessConfigInput,
} from "@/lib/validations";

function toDTO(b: Business): BusinessDTO {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    heroUrl: b.heroUrl,
    whatsapp: b.whatsapp,
    accentColor: b.accentColor,
    theme: asMenuTheme(b.theme),
    fontStyle: asMenuFont(b.fontStyle),
    layoutStyle: asMenuLayout(b.layoutStyle),
    tagline: b.tagline,
    isDemo: b.isDemo,
  };
}

export async function getBusiness(businessId: string): Promise<BusinessDTO | null> {
  const b = await prisma.business.findUnique({ where: { id: businessId } });
  return b ? toDTO(b) : null;
}

export async function getBusinessBySlug(slug: string): Promise<BusinessDTO | null> {
  const b = await prisma.business.findUnique({ where: { slug } });
  return b ? toDTO(b) : null;
}

export async function updateBusinessConfig(
  businessId: string,
  data: BusinessConfigInput
): Promise<BusinessDTO> {
  const b = await prisma.business.update({
    where: { id: businessId },
    data: {
      name: data.name,
      whatsapp: data.whatsapp || null,
      accentColor: data.accentColor || "#d4a853",
      logoUrl: data.logoUrl || null,
      heroUrl: data.heroUrl || null,
      theme: data.theme,
      fontStyle: data.fontStyle,
      layoutStyle: data.layoutStyle,
      tagline: data.tagline || null,
    },
  });
  return toDTO(b);
}
