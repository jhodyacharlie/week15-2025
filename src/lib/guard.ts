import { NextResponse } from "next/server";

export function readOnlyResponse() {
  return NextResponse.json(
    {
      error:
        "Mode demo: data hanya bisa dibaca di Vercel. Jalankan project secara lokal untuk menambah, mengubah, atau menghapus data.",
    },
    { status: 403 }
  );
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound() {
  return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
}
