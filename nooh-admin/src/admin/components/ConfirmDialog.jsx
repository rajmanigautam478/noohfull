import Modal from "./Modal";

export default function ConfirmDialog({ title, message, onCancel, onConfirm, confirmLabel = "Delete" }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ color: "var(--nooh-text-muted)", lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}
