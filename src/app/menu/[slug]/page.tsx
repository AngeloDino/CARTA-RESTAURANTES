import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMenuData } from "@/server/services/menu";
import { PublicMenu } from "./PublicMenu";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getMenuData(params.slug);
  if (!data) return { title: "Menú no encontrado" };
  return {
    title: `${data.business.name} — Menú digital`,
    description: `Descubra el menú de ${data.business.name}.`,
    openGraph: {
      title: `${data.business.name} — Menú digital`,
      description: `Descubra el menú de ${data.business.name}.`,
      images: data.business.heroUrl ? [{ url: data.business.heroUrl }] : [],
    },
  };
}

export default async function MenuPage({ params }: Props) {
  const data = await getMenuData(params.slug);
  if (!data) notFound();

  return <PublicMenu data={data} />;
}
