import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth";
import { createDish, listDishes } from "@/server/services/dishes";
import { dishSchema } from "@/lib/validations";

export async function GET() {
  const { businessId } = await requireSession();
  const dishes = await listDishes(businessId);
  return NextResponse.json(dishes);
}

export async function POST(req: Request) {
  const { businessId } = await requireSession();
  const raw = await req.json();
  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.errors[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }
  const dish = await createDish(businessId, parsed.data);
  return NextResponse.json({ ok: true, dish });
}
