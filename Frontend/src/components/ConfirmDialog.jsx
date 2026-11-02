import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

export default function ConfirmDialog({ title, message, confirmText = "Eliminar", loading, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="actions">
        <Button variant="secondary" onClick={onCancel}>Volver</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  );
}
