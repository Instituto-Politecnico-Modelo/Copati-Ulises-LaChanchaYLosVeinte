import { getToken, clearSession } from "./session.js";

export const SESSION_EXPIRED_EVENT = "session-expired";

// Cliente HTTP común: agrega el token y procesa la respuesta del backend
// ({ success, data } o { success: false, message }).
export async function request(url, options = {}) {
  const token = getToken();
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || (body && body.success === false)) {
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw new Error(body?.message || "Ocurrió un error inesperado.");
  }
  return body?.data ?? null;
}
