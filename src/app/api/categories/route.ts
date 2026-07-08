import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireSession } from "@/server/auth";
import { createCategory, listCategories } from "@/server/services/categories";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  const { businessId } = await requireSession();
  const categories = await listCategories(businessId);
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
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
    const category = await createCategory(businessId, parsed.data.name);
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
