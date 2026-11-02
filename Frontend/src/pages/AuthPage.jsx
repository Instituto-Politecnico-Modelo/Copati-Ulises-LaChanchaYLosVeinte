import { useState } from "react";
import FormField from "../components/FormField.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { register } from "../services/authService.js";
import { validateLogin, validateRegister } from "../utils/validators.js";

const EMPTY = { email: "", contrasenia: "", telefono: "" };

export default function AuthPage({ onSuccess }) {
  const { login } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = isLogin ? validateLogin(values) : validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      if (!isLogin) {
        await register({ ...values, email: values.email.trim(), telefono: values.telefono.trim() });
        toast.success("Cuenta creada correctamente.");
      }
      const user = await login({ email: values.email.trim(), contrasenia: values.contrasenia });
      toast.success(`¡Bienvenido/a, ${user.email}!`);
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel" aria-labelledby="titulo-auth">
      <h2 id="titulo-auth">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" type="email" label="Email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField id="contrasenia" type="password" label="Contraseña" autoComplete={isLogin ? "current-password" : "new-password"} value={values.contrasenia} onChange={handleChange} error={errors.contrasenia} />
        {!isLogin && (
          <FormField id="telefono" type="tel" label="Teléfono" autoComplete="tel" value={values.telefono} onChange={handleChange} error={errors.telefono} />
        )}
        <Button type="submit" loading={loading}>{isLogin ? "Ingresar" : "Registrarme"}</Button>
      </form>
      <p>
        {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
        <button type="button" className="link" onClick={switchMode}>
          {isLogin ? "Registrate" : "Iniciá sesión"}
        </button>
      </p>
    </section>
  );
}
