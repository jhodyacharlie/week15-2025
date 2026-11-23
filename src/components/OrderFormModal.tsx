"use client";

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  OrderDTO,
  OrderInput,
  OrderItemInput,
  OrderStatus,
  PRODUCT_IMAGES,
  STATUS_FLOW,
  STATUS_LABEL,
  STORE_LOGOS,
} from "@/lib/orders";

type ItemRow = {
  name: string;
  variant: string;
  price: string;
  qty: string;
  image: string;
};

type OrderFormModalProps = {
  order: OrderDTO | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: OrderInput) => void;
};

const EMPTY_ROW: ItemRow = { name: "", variant: "", price: "", qty: "1", image: "" };

export default function OrderFormModal({
  order,
  saving,
  onClose,
  onSubmit,
}: OrderFormModalProps) {
  const [storeName, setStoreName] = useState(order?.storeName ?? "");
  const [storeLogo, setStoreLogo] = useState(order?.storeLogo ?? "");
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? "gudang");
  const [rows, setRows] = useState<ItemRow[]>(
    order
      ? order.items.map((item) => ({
          name: item.name,
          variant: item.variant,
          price: String(item.price),
          qty: String(item.qty),
          image: item.image ?? "",
        }))
      : [{ ...EMPTY_ROW }]
  );
  const [error, setError] = useState("");

  const updateRow = (index: number, patch: Partial<ItemRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (storeName.trim() === "") {
      setError("Nama toko wajib diisi.");
      return;
    }

    const items: OrderItemInput[] = [];
    for (const row of rows) {
      const price = Number(row.price);
      const qty = Number(row.qty);
      const invalid =
        row.name.trim() === "" ||
        row.price.trim() === "" ||
        !Number.isInteger(price) ||
        price < 0 ||
        !Number.isInteger(qty) ||
        qty < 1;
      if (invalid) {
        setError(
          "Lengkapi nama barang, harga (angka bulat), dan jumlah (minimal 1) di setiap baris."
        );
        return;
      }
      items.push({
        name: row.name.trim(),
        variant: row.variant.trim(),
        price,
        qty,
        image: row.image === "" ? null : row.image,
      });
    }

    setError("");
    onSubmit({
      storeName: storeName.trim(),
      storeLogo: storeLogo === "" ? null : storeLogo,
      status,
      items,
    });
  };

  return (
    <Modal show onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{order ? "Ubah Pesanan" : "Tambah Pesanan"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Form.Label>Nama Toko</Form.Label>
            <Form.Control
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: TechZone Official"
            />
          </div>
          <div className="col-md-3">
            <Form.Label>Logo Toko</Form.Label>
            <Form.Select value={storeLogo} onChange={(e) => setStoreLogo(e.target.value)}>
              <option value="">Tanpa logo</option>
              {STORE_LOGOS.map((logo) => (
                <option key={logo.value} value={logo.value}>
                  {logo.label}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
            >
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="mb-0 fw-semibold">Barang</Form.Label>
          <Button variant="outline-primary" size="sm" onClick={addRow}>
            + Tambah Barang
          </Button>
        </div>

        {rows.map((row, index) => (
          <div key={index} className="border rounded p-3 mb-2">
            <div className="row g-2">
              <div className="col-md-5">
                <Form.Control
                  placeholder="Nama barang"
                  value={row.name}
                  onChange={(e) => updateRow(index, { name: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <Form.Control
                  placeholder="Varian"
                  value={row.variant}
                  onChange={(e) => updateRow(index, { variant: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2">
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="Harga"
                  value={row.price}
                  onChange={(e) => updateRow(index, { price: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2">
                <Form.Control
                  type="number"
                  min={1}
                  placeholder="Jumlah"
                  value={row.qty}
                  onChange={(e) => updateRow(index, { qty: e.target.value })}
                />
              </div>
              <div className="col-8 col-md-10">
                <Form.Select
                  value={row.image}
                  onChange={(e) => updateRow(index, { image: e.target.value })}
                >
                  <option value="">Tanpa gambar</option>
                  {PRODUCT_IMAGES.map((img) => (
                    <option key={img.value} value={img.value}>
                      {img.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-4 col-md-2 d-grid">
                <Button
                  variant="outline-danger"
                  disabled={rows.length === 1}
                  onClick={() => removeRow(index)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}

        {error && <div className="text-danger small mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Menyimpan..." : order ? "Simpan Perubahan" : "Buat Pesanan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
