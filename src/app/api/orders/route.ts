import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_READ_ONLY } from "@/lib/mode";
import { toDTO } from "@/lib/serialize";
import { parseOrderInput } from "@/lib/validate";
import { badRequest, readOnlyResponse } from "@/lib/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: rows.map(toDTO),
    readOnly: IS_READ_ONLY,
  });
}

export async function POST(request: Request) {
  if (IS_READ_ONLY) return readOnlyResponse();

  const input = parseOrderInput(await request.json().catch(() => null));
  if (!input) return badRequest("Data pesanan tidak valid.");

  const created = await prisma.order.create({
    data: {
      storeName: input.storeName,
      storeLogo: input.storeLogo,
      status: input.status,
      arrivedAt: input.status === "sampai" ? new Date() : null,
      items: { create: input.items },
    },
    include: { items: true },
  });

  return NextResponse.json(toDTO(created), { status: 201 });
}
