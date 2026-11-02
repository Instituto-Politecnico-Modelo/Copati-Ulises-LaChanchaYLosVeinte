import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService.js";
import { clearSession, getSession, saveSession } from "../services/session.js";
import { SESSION_EXPIRED_EVENT } from "../services/http.js";
import { useToast } from "./ToastContext.jsx";

const AuthContext = createContext(null);

export const STAFF_ROLES = ["administrador", "recepcionista"];

export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(() => getSession()?.usuario ?? null);

  const login = async (credentials) => {
    const session = await authService.login(credentials);
    saveSession(session);
    setUser(session.usuario);
    return session.usuario;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Si la sesión ya no existe en el servidor igual se cierra en el cliente.
    }
    clearSession();
    setUser(null);
  };

  const onExpired = useCallback(() => {
    setUser(null);
    toast.error("Tu sesión expiró. Volvé a iniciar sesión.");
  }, [toast]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [onExpired]);

  const value = { user, login, logout, isStaff: STAFF_ROLES.includes(user?.rol) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
