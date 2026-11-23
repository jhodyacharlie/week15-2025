"use client";

import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import OrderCard from "@/components/OrderCard";
import OrderFormModal from "@/components/OrderFormModal";
import ReviewModal from "@/components/ReviewModal";
import {
  createOrder,
  deleteOrder,
  listOrders,
  saveReview,
  updateOrder,
} from "@/lib/api";
import {
  OrderDTO,
  OrderInput,
  OrderStatus,
  STATUS_FLOW,
  STATUS_LABEL,
  formatRupiah,
} from "@/lib/orders";

type Filter = "semua" | OrderStatus;

type FormTarget = { order: OrderDTO | null };

type ToastState = {
  show: boolean;
  message: string;
  variant: "success" | "danger";
};

export default function HomePage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [saving, setSaving] = useState(false);

  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [reviewTarget, setReviewTarget] = useState<OrderDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrderDTO | null>(null);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    let active = true;

    listOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data.orders);
        setReadOnly(data.readOnly);
      })
      .catch((err) => {
        console.error(err);
        if (active) setError("Gagal memuat pesanan dari database.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    const data = await listOrders();
    setOrders(data.orders);
    setReadOnly(data.readOnly);
  };

  const showToast = (message: string, variant: "success" | "danger") => {
    setToast({ show: true, message, variant });
  };

  const run = async (
    action: () => Promise<unknown>,
    successMessage: string
  ): Promise<boolean> => {
    setSaving(true);
    try {
      await action();
      await refresh();
      showToast(successMessage, "success");
      return true;
    } catch (err) {
      console.error(err);
      showToast(
        err instanceof Error ? err.message : "Terjadi kesalahan.",
        "danger"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForm = async (input: OrderInput) => {
    if (!formTarget) return;
    const target = formTarget.order;
    const ok = await run(
      () => (target ? updateOrder(target.id, input) : createOrder(input)),
      target ? "Pesanan berhasil diperbarui." : "Pesanan baru berhasil dibuat."
    );
    if (ok) setFormTarget(null);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!reviewTarget) return;
    const target = reviewTarget;
    const ok = await run(
      () => saveReview(target.id, rating, comment),
      "Ulasan berhasil disimpan."
    );
    if (ok) setReviewTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const ok = await run(() => deleteOrder(target.id), "Pesanan berhasil dihapus.");
    if (ok) setDeleteTarget(null);
  };

  const keyword = search.trim().toLowerCase();

  const searched =
    keyword === ""
      ? orders
      : orders.filter(
          (o) =>
            o.storeName.toLowerCase().includes(keyword) ||
            o.items.some((item) => item.name.toLowerCase().includes(keyword))
        );

  const visibleOrders =
    filter === "semua" ? searched : searched.filter((o) => o.status === filter);

  const countOf = (status: OrderStatus) =>
    searched.filter((o) => o.status === status).length;

  return (
    <main className="container py-4">
      {readOnly && (
        <div className="alert alert-warning">
          <b>Mode demo (read-only).</b> Data dibaca dari database SQLite yang ikut
          di-deploy. Menambah, mengubah, menghapus pesanan, dan menulis ulasan hanya
          bisa dilakukan saat project dijalankan secara lokal.
        </div>
      )}

      <div className="input-group input-group-lg mb-4 shadow-sm rounded-pill">
        <span className="input-group-text bg-body rounded-start-pill ps-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          className={`form-control ${search === "" ? "rounded-end-pill" : ""}`}
          placeholder="Cari pesanan Anda (nama toko atau barang)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari pesanan"
        />
        {search !== "" && (
          <button
            type="button"
            className="btn btn-outline-secondary rounded-end-pill px-3"
            onClick={() => setSearch("")}
          >
            Hapus
          </button>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 fw-bold mb-0">Kelola Pesanan</h1>
        <Button
          variant="primary"
          className="rounded-pill px-3"
          disabled={readOnly}
          title={readOnly ? "Mode demo: hanya bisa dibaca" : undefined}
          onClick={() => setFormTarget({ order: null })}
        >
          + Tambah Pesanan
        </Button>
      </div>

      <Nav
        variant="pills"
        className="flex-nowrap overflow-auto bg-body rounded shadow-sm p-2 mb-3"
        activeKey={filter}
        onSelect={(key) => setFilter((key ?? "semua") as Filter)}
      >
        <Nav.Item>
          <Nav.Link eventKey="semua" className="text-nowrap">
            Semua ({searched.length})
          </Nav.Link>
        </Nav.Item>
        {STATUS_FLOW.map((status) => (
          <Nav.Item key={status}>
            <Nav.Link eventKey={status} className="text-nowrap">
              {STATUS_LABEL[status]} ({countOf(status)})
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-muted text-center py-5">
          Belum ada pesanan. Klik Tambah Pesanan untuk membuat yang pertama.
        </p>
      )}

      {!loading && orders.length > 0 && visibleOrders.length === 0 && (
        <p className="text-muted text-center py-4">
          {keyword === ""
            ? "Tidak ada pesanan dengan status ini."
            : `Tidak ada pesanan yang cocok dengan "${search.trim()}".`}
        </p>
      )}

      {visibleOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          readOnly={readOnly}
          onEdit={(o) => setFormTarget({ order: o })}
          onDelete={setDeleteTarget}
          onReview={setReviewTarget}
        />
      ))}

      {formTarget && (
        <OrderFormModal
          key={formTarget.order?.id ?? "baru"}
          order={formTarget.order}
          saving={saving}
          onClose={() => setFormTarget(null)}
          onSubmit={handleSubmitForm}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          key={reviewTarget.id}
          order={reviewTarget}
          saving={saving}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      <Modal show={deleteTarget !== null} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Pesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Hapus pesanan dari <b>{deleteTarget?.storeName}</b> senilai{" "}
          <b>{deleteTarget ? formatRupiah(deleteTarget.total) : ""}</b>? Tindakan
          ini tidak bisa dibatalkan.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={saving}>
            {saving ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{ position: "fixed" }}
      >
        <Toast
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
}
