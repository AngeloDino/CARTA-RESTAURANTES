import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
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
  try {
    const category = await updateCategory(businessId, params.id, parsed.data.name);
    if (!category) {
      return NextResponse.json({ ok: false, message: "Categoría no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, category });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { ok: false, message: "Ya existe una categoría con ese nombre" },
        { status: 409 }
      );
    }
    throw e;
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { businessId } = await requireSession();
  const ok = await deleteCategory(businessId, params.id);
  if (!ok) {
    return NextResponse.json({ ok: false, message: "Categoría no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
