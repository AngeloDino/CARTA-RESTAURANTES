import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth";
import { updateBusinessConfig } from "@/server/services/business";
import { businessConfigSchema } from "@/lib/validations";

export async function PUT(req: Request) {
  const { businessId } = await requireSession();
  const raw = await req.json();
  const parsed = businessConfigSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.errors[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }
  const business = await updateBusinessConfig(businessId, parsed.data);
  return NextResponse.json({ ok: true, business });
}
