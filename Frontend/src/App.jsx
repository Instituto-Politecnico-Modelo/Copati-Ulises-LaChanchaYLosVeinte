import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ReservationsPage from "./pages/ReservationsPage.jsx";
import TablesPage from "./pages/TablesPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useCart } from "./context/CartContext.jsx";
import { useToast } from "./context/ToastContext.jsx";

// Qué páginas ve cada tipo de usuario.
const getPages = (user, cartCount) => {
  if (!user) {
    return [{ id: "menu", label: "Carta" }, { id: "login", label: "Ingresar" }];
  }
  const pages = [
    { id: "menu", label: "Carta" },
    { id: "carrito", label: "Mi pedido", badge: cartCount },
    { id: "pedidos", label: "Pedidos" },
    { id: "reservas", label: "Reservas" }
  ];
  if (user.rol !== "usuario") pages.push({ id: "mesas", label: "Mesas" });
  if (user.rol === "administrador") pages.push({ id: "productos", label: "Productos" });
  return pages;
};

export default function App() {
  const { user, logout } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const [page, setPage] = useState("menu");

  const pages = getPages(user, cart.count);
  // Si la página actual no está permitida (ej. cerró sesión) se vuelve a la carta.
  const current = pages.some((p) => p.id === page) ? page : "menu";

  const handleLogout = async () => {
    await logout();
    cart.clear();
    setPage("menu");
    toast.success("Sesión cerrada.");
  };

  const renderPage = () => {
    switch (current) {
      case "login": return <AuthPage onSuccess={() => setPage("menu")} />;
      case "carrito": return <CartPage onNavigate={setPage} />;
      case "pedidos": return <OrdersPage />;
      case "reservas": return <ReservationsPage />;
      case "mesas": return <TablesPage />;
      case "productos": return <AdminPage />;
      default: return <MenuPage onNavigate={setPage} />;
    }
  };

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header pages={pages} current={current} onNavigate={setPage} user={user} onLogout={handleLogout} />
      <main id="contenido" className="container">{renderPage()}</main>
      <Footer />
    </>
  );
}
