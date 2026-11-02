import { useState } from "react";
import useProducts from "../hooks/useProducts.js";
import { createProduct, updateProduct, deleteProduct } from "../services/productService.js";
import { useToast } from "../context/ToastContext.jsx";
import ProductTable from "../components/ProductTable.jsx";
import ProductForm from "../components/ProductForm.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

export default function AdminPage() {
  const { products, loading, error, reload } = useProducts();
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null | "new" | producto
  const [toDelete, setToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing === "new") {
        await createProduct(data);
        toast.success("Producto creado correctamente.");
      } else {
        await updateProduct(editing.codigo, data);
        toast.success("Producto actualizado correctamente.");
      }
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteProduct(toDelete.codigo);
      toast.success("Producto eliminado correctamente.");
      setToDelete(null);
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="titulo-admin">
      <div className="section-head">
        <h2 id="titulo-admin">Administrar productos</h2>
        <Button onClick={() => setEditing("new")}>+ Nuevo producto</Button>
      </div>

      {loading && <Spinner text="Cargando productos..." />}
      {error && <StatusMessage message={error} onRetry={reload} />}
      {!loading && !error && products.length === 0 && (
        <StatusMessage message="No hay productos cargados." />
      )}
      {products.length > 0 && (
        <ProductTable products={products} onEdit={setEditing} onDelete={setToDelete} />
      )}

      {editing && (
        <Modal title={editing === "new" ? "Nuevo producto" : "Editar producto"} onClose={() => setEditing(null)}>
          <ProductForm
            initial={editing === "new" ? null : editing}
            loading={saving}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Seguro que querés eliminar "${toDelete.nombre}"? Esta acción no se puede deshacer.`}
          loading={saving}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  );
}
