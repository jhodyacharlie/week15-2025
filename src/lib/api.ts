import { OrderDTO, OrderInput } from "./orders";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Terjadi kesalahan.");
  return data as T;
}

export const listOrders = () =>
  request<{ orders: OrderDTO[]; readOnly: boolean }>("/api/orders");

export const createOrder = (input: OrderInput) =>
  request<OrderDTO>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateOrder = (id: number, input: OrderInput) =>
  request<OrderDTO>(`/api/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteOrder = (id: number) =>
  request<void>(`/api/orders/${id}`, { method: "DELETE" });

export const saveReview = (id: number, rating: number, comment: string) =>
  request<OrderDTO>(`/api/orders/${id}/review`, {
    method: "PUT",
    body: JSON.stringify({ rating, comment }),
  });
