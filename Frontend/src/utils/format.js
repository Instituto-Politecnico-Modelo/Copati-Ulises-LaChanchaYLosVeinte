export const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(Number(value));

// "2030-01-10" -> "10/01/2030"
export const formatDate = (isoDate) => isoDate.split("-").reverse().join("/");

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

// Fecha de hoy en formato AAAA-MM-DD (hora local).
export const todayISO = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};
