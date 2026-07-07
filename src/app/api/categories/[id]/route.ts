import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth";
import { updateCategory, deleteCategory } from "@/server/services/categories";
import { categorySchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { businessId } = await requireSession();
  const raw = await req.json();
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.errors[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }
  const category = await updateCategory(businessId, params.id, parsed.data.name);
  if (!category) {
    return NextResponse.json({ ok: false, message: "Categoría no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, category });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { businessId } = await requireSession();
  const ok = await deleteCategory(businessId, params.id);
  if (!ok) {
    return NextResponse.json({ ok: false, message: "Categoría no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
