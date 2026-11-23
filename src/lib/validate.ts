import { OrderInput, OrderItemInput, OrderStatus, STATUS_FLOW } from "./orders";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseItem(raw: unknown): OrderItemInput | null {
  if (!isRecord(raw)) return null;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const variant = typeof raw.variant === "string" ? raw.variant.trim() : "";
  const price = Number(raw.price);
  const qty = Number(raw.qty);
  const image = typeof raw.image === "string" && raw.image !== "" ? raw.image : null;

  if (name === "") return null;
  if (!Number.isInteger(price) || price < 0) return null;
  if (!Number.isInteger(qty) || qty < 1) return null;

  return { name, variant, price, qty, image };
}

export function parseOrderInput(body: unknown): OrderInput | null {
  if (!isRecord(body)) return null;

  const storeName = typeof body.storeName === "string" ? body.storeName.trim() : "";
  if (storeName === "") return null;

  const storeLogo =
    typeof body.storeLogo === "string" && body.storeLogo !== "" ? body.storeLogo : null;

  const status = (typeof body.status === "string" ? body.status : "gudang") as OrderStatus;
  if (!STATUS_FLOW.includes(status)) return null;

  if (!Array.isArray(body.items) || body.items.length === 0) return null;
  const items: OrderItemInput[] = [];
  for (const raw of body.items) {
    const item = parseItem(raw);
    if (!item) return null;
    items.push(item);
  }

  return { storeName, storeLogo, status, items };
}

export function parseReviewInput(
  body: unknown
): { rating: number; comment: string } | null {
  if (!isRecord(body)) return null;
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  return { rating, comment };
}
