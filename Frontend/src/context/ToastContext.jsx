import { createContext, useCallback, useContext, useState } from "react";
import ToastContainer from "../components/ToastContainer.jsx";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const api = {
    success: (m) => notify("success", m),
    error: (m) => notify("error", m)
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
