export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span>{t.message}</span>
          <button type="button" aria-label="Cerrar notificación" onClick={() => onDismiss(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
