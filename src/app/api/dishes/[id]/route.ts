import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth";
import { updateDish, deactivateDish } from "@/server/services/dishes";
import { dishSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { businessId } = await requireSession();
  const raw = await req.json();
  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.errors[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }
  const dish = await updateDish(businessId, params.id, parsed.data);
  if (!dish) {
    return NextResponse.json({ ok: false, message: "Plato no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, dish });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { businessId } = await requireSession();
  const ok = await deactivateDish(businessId, params.id);
  if (!ok) {
    return NextResponse.json({ ok: false, message: "Plato no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
