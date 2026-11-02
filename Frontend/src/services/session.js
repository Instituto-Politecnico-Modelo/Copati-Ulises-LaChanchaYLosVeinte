// Guarda la sesión (token + usuario) en localStorage.
const KEY = "chancha_session";

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const saveSession = (session) => localStorage.setItem(KEY, JSON.stringify(session));

export const clearSession = () => localStorage.removeItem(KEY);

export const getToken = () => getSession()?.token ?? null;
