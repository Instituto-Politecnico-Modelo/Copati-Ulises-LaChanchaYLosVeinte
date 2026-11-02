const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const isEmail = (value) => typeof value === "string" && EMAIL_REGEX.test(value.trim());

export const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

export const isPositiveInt = (value) => Number.isInteger(value) && value > 0;

export const isNonNegativeInt = (value) => Number.isInteger(value) && value >= 0;

export const isValidDate = (value) => {
    if (typeof value !== "string" || !DATE_REGEX.test(value)) {
        return false;
    }
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

// Fecha y hora de inicio en horario local del servidor.
export const toDateTime = (fecha, hora) => new Date(`${fecha}T${hora}:00`);
