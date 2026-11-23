"use client";

import Image from "next/image";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import {
  OrderDTO,
  STATUS_COLOR,
  STATUS_FLOW,
  STATUS_LABEL,
  formatRupiah,
  formatTanggal,
} from "@/lib/orders";

type OrderCardProps = {
  order: OrderDTO;
  readOnly: boolean;
  onEdit: (order: OrderDTO) => void;
  onDelete: (order: OrderDTO) => void;
  onReview: (order: OrderDTO) => void;
};

export default function OrderCard({
  order,
  readOnly,
  onEdit,
  onDelete,
  onReview,
}: OrderCardProps) {
  const stepIndex = STATUS_FLOW.indexOf(order.status);
  const isArrived = order.status === "sampai";
  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
  const lockedTitle = readOnly ? "Mode demo: hanya bisa dibaca" : undefined;

  return (
    <div className="card mb-3 border-0 shadow-sm overflow-hidden">
      <div className="card-header bg-body d-flex justify-content-between align-items-center py-3 px-4">
        <div className="d-flex align-items-center gap-2">
          {order.storeLogo ? (
            <Image
              src={order.storeLogo}
              alt={order.storeName}
              width={36}
              height={36}
              className="rounded-circle border"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{ width: 36, height: 36, backgroundColor: "#03ac0e" }}
            >
              {order.storeName.charAt(0)}
            </div>
          )}
          <span className="fw-bold">{order.storeName}</span>
          <span className="text-muted small">
            • Dipesan {formatTanggal(order.createdAt)}
          </span>
        </div>
        <Badge bg={STATUS_COLOR[order.status]}>{STATUS_LABEL[order.status]}</Badge>
      </div>

      <div className="row g-0">
        <div className="col-lg-8 p-4">
          <div className="d-flex mb-4">
            {STATUS_FLOW.map((step, i) => {
              const done = i <= stepIndex;
              return (
                <div key={step} className="flex-fill text-center small">
                  <div
                    className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center text-white ${
                      done ? "bg-success" : "bg-secondary-subtle"
                    }`}
                    style={{ width: 28, height: 28 }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={done ? "fw-semibold" : "text-muted"}>
                    {STATUS_LABEL[step]}
                  </span>
                </div>
              );
            })}
          </div>

          {isArrived && order.arrivedAt && (
            <div className="alert alert-success py-2 small">
              Sampai tujuan pada <b>{formatTanggal(order.arrivedAt)}</b>
            </div>
          )}

          <ul className="list-unstyled mb-0">
            {order.items.map((item) => (
              <li key={item.id} className="d-flex align-items-center gap-3 py-2">
                <div className="item-thumb">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={72}
                      height={72}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.name}</div>
                  {item.variant && (
                    <div className="text-muted small">{item.variant}</div>
                  )}
                </div>
                <div className="text-end">
                  <div>{formatRupiah(item.price)}</div>
                  <div className="text-muted small">x{item.qty}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-4 p-4 order-side d-flex flex-column">
          <div className="text-muted small">Total Belanja ({totalQty} barang)</div>
          <div className="fw-bold fs-3 mb-3" style={{ color: "#03ac0e" }}>
            {formatRupiah(order.total)}
          </div>

          {order.reviewRating !== null && (
            <div className="bg-body border rounded p-2 small mb-3">
              <div className="text-warning">
                {"★".repeat(order.reviewRating)}
                {"☆".repeat(5 - order.reviewRating)}
              </div>
              {order.reviewComment && <div>{order.reviewComment}</div>}
            </div>
          )}

          <div className="d-grid gap-2 mt-auto">
            {isArrived && (
              <Button
                variant="primary"
                disabled={readOnly}
                title={lockedTitle}
                onClick={() => onReview(order)}
              >
                {order.reviewRating === null ? "Tulis Ulasan" : "Ubah Ulasan"}
              </Button>
            )}
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                className="flex-fill"
                disabled={readOnly}
                title={lockedTitle}
                onClick={() => onEdit(order)}
              >
                Ubah
              </Button>
              <Button
                variant="outline-danger"
                className="flex-fill"
                disabled={readOnly}
                title={lockedTitle}
                onClick={() => onDelete(order)}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
