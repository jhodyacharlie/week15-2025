import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_READ_ONLY } from "@/lib/mode";
import { toDTO } from "@/lib/serialize";
import { parseReviewInput } from "@/lib/validate";
import { badRequest, notFound, readOnlyResponse } from "@/lib/guard";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  if (IS_READ_ONLY) return readOnlyResponse();

  const { id } = await context.params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) return badRequest("ID pesanan tidak valid.");

  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) return notFound();
  if (existing.status !== "sampai") {
    return badRequest("Ulasan hanya bisa ditulis untuk pesanan yang sudah sampai.");
  }

  const input = parseReviewInput(await request.json().catch(() => null));
  if (!input) return badRequest("Rating harus berupa angka 1 sampai 5.");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      reviewRating: input.rating,
      reviewComment: input.comment,
      reviewedAt: new Date(),
    },
    include: { items: true },
  });

  return NextResponse.json(toDTO(updated));
}
