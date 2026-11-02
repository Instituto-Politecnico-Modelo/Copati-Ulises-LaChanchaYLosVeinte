export default function Button({ variant = "primary", type = "button", loading = false, children, ...props }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? "Procesando..." : children}
    </button>
  );
}
