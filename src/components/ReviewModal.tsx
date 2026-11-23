"use client";

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { OrderDTO } from "@/lib/orders";

type ReviewModalProps = {
  order: OrderDTO;
  saving: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
};

export default function ReviewModal({
  order,
  saving,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(order.reviewRating ?? 0);
  const [comment, setComment] = useState(order.reviewComment ?? "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Pilih jumlah bintang dulu.");
      return;
    }
    setError("");
    onSubmit(rating, comment);
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {order.reviewRating === null ? "Tulis Ulasan" : "Ubah Ulasan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small mb-2">{order.storeName}</p>
        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="btn btn-link p-0 me-1 fs-2 text-decoration-none text-warning"
              onClick={() => setRating(star)}
              aria-label={`${star} bintang`}
            >
              {star <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
        <Form.Group>
          <Form.Label>Komentar (opsional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan pengalaman belanja kamu..."
          />
        </Form.Group>
        {error && <div className="text-danger small mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Menyimpan..." : "Kirim Ulasan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
