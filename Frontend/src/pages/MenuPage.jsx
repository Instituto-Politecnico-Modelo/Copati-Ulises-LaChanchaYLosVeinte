import useProducts from "../hooks/useProducts.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import Button from "../components/Button.jsx";

export default function MenuPage({ onNavigate }) {
  const { products, loading, error, reload } = useProducts();
  const { user } = useAuth();
  const cart = useCart();
  const toast = useToast();

  const handleAdd = (product) => {
    cart.add(product);
    toast.success(`${product.nombre} agregado al pedido.`);
  };

  return (
    <section aria-labelledby="titulo-carta">
      <h2 id="titulo-carta">Nuestra carta</h2>
      <p className="lead">Porciones generosas, precios accesibles y sabor de bodegón.</p>
      {!user && (
        <div className="status">
          <p>Para hacer un pedido o reservar una mesa necesitás una cuenta.</p>
          <Button variant="secondary" onClick={() => onNavigate("login")}>Ingresar o registrarme</Button>
        </div>
      )}
      {loading && <Spinner text="Cargando carta..." />}
      {error && <StatusMessage message={error} onRetry={reload} />}
      {!loading && !error && products.length === 0 && (
        <StatusMessage message="Todavía no hay productos en la carta." />
      )}
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.codigo} product={p} onAdd={user ? handleAdd : undefined} />
        ))}
      </div>
    </section>
  );
}
