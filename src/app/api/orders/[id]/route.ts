import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_READ_ONLY } from "@/lib/mode";
import { toDTO } from "@/lib/serialize";
import { parseOrderInput } from "@/lib/validate";
import { badRequest, notFound, readOnlyResponse } from "@/lib/guard";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

async function parseId(context: Context): Promise<number | null> {
  const { id } = await context.params;
  const orderId = Number(id);
  return Number.isInteger(orderId) ? orderId : null;
}

export async function GET(_: Request, context: Context) {
  const orderId = await parseId(context);
  if (orderId === null) return badRequest("ID pesanan tidak valid.");

  const row = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!row) return notFound();

  return NextResponse.json(toDTO(row));
}

export async function PUT(request: Request, context: Context) {
  if (IS_READ_ONLY) return readOnlyResponse();

  const orderId = await parseId(context);
  if (orderId === null) return badRequest("ID pesanan tidak valid.");

  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) return notFound();

  const input = parseOrderInput(await request.json().catch(() => null));
  if (!input) return badRequest("Data pesanan tidak valid.");

  let arrivedAt = existing.arrivedAt;
  if (input.status === "sampai" && !arrivedAt) arrivedAt = new Date();
  if (input.status !== "sampai") arrivedAt = null;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      storeName: input.storeName,
      storeLogo: input.storeLogo,
      status: input.status,
      arrivedAt,
      items: { deleteMany: {}, create: input.items },
    },
    include: { items: true },
  });

  return NextResponse.json(toDTO(updated));
}

export async function DELETE(_: Request, context: Context) {
  if (IS_READ_ONLY) return readOnlyResponse();

  const orderId = await parseId(context);
  if (orderId === null) return badRequest("ID pesanan tidak valid.");

  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) return notFound();

  await prisma.order.delete({ where: { id: orderId } });

  return new NextResponse(null, { status: 204 });
}
