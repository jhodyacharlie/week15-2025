export type OrderStatus = "gudang" | "disortir" | "diantar" | "sampai";

export type OrderItemDTO = {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  image: string | null;
};

export type OrderDTO = {
  id: number;
  storeName: string;
  storeLogo: string | null;
  status: OrderStatus;
  createdAt: string;
  arrivedAt: string | null;
  reviewRating: number | null;
  reviewComment: string | null;
  items: OrderItemDTO[];
  total: number;
};

export type OrderItemInput = {
  name: string;
  variant: string;
  price: number;
  qty: number;
  image: string | null;
};

export type OrderInput = {
  storeName: string;
  storeLogo: string | null;
  status: OrderStatus;
  items: OrderItemInput[];
};

export const STATUS_FLOW: OrderStatus[] = ["gudang", "disortir", "diantar", "sampai"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  gudang: "Di Gudang",
  disortir: "Disortir",
  diantar: "Sedang Diantar",
  sampai: "Sampai Tujuan",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  gudang: "secondary",
  disortir: "info",
  diantar: "warning",
  sampai: "success",
};

export const STORE_LOGOS = [
  { label: "Logo toko 1", value: "/images/pppenjual1.jpg" },
  { label: "Logo toko 3", value: "/images/pppenjual3.jpg" },
  { label: "Logo toko 4", value: "/images/pppenjual4.jpg" },
  { label: "Logo toko 5", value: "/images/pppenjual5.jpg" },
];

export const PRODUCT_IMAGES = [
  { label: "Earphone TWS", value: "/images/tws.jpg" },
  { label: "Kabel USB", value: "/images/kabelusb.jpg" },
  { label: "Mouse Wireless", value: "/images/mousewireless.webp" },
  { label: "Casing HP", value: "/images/casinghp.jpg" },
  { label: "Power Bank", value: "/images/powerbank10000mah.webp" },
  { label: "Keyboard Mekanik", value: "/images/keyboardmekanik.jpg" },
];

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  });
}
