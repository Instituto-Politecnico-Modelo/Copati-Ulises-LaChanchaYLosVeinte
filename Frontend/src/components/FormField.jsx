export default function FormField({ id, label, error, as = "input", ...props }) {
  const Tag = as;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag
        id={id}
        name={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
