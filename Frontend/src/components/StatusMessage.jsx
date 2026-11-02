import Button from "./Button.jsx";

export default function StatusMessage({ message, onRetry }) {
  return (
    <div className="status" role="alert">
      <p>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Reintentar</Button>}
    </div>
  );
}
