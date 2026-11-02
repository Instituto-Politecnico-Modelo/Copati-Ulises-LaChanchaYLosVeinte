export default function Spinner({ text = "Cargando..." }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__circle" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
