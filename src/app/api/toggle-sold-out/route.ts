import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth";
import { toggleSoldOut } from "@/server/services/dishes";

export async function POST(req: Request) {
  const { businessId } = await requireSession();
  const { dishId } = await req.json();
  if (!dishId) {
    return NextResponse.json({ ok: false, message: "Falta dishId" }, { status: 400 });
  }
  const dish = await toggleSoldOut(businessId, dishId);
  if (!dish) {
    return NextResponse.json({ ok: false, message: "Plato no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, dish });
}
