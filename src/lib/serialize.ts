import { OrderDTO, OrderStatus } from "./orders";

type OrderRow = {
  id: number;
  storeName: string;
  storeLogo: string | null;
  status: string;
  createdAt: Date;
  arrivedAt: Date | null;
  reviewRating: number | null;
  reviewComment: string | null;
  items: {
    id: number;
    name: string;
    variant: string;
    price: number;
    qty: number;
    image: string | null;
  }[];
};

export function toDTO(row: OrderRow): OrderDTO {
  return {
    id: row.id,
    storeName: row.storeName,
    storeLogo: row.storeLogo,
    status: row.status as OrderStatus,
    createdAt: row.createdAt.toISOString(),
    arrivedAt: row.arrivedAt ? row.arrivedAt.toISOString() : null,
    reviewRating: row.reviewRating,
    reviewComment: row.reviewComment,
    items: row.items,
    total: row.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  };
}
