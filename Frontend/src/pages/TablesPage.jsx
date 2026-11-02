import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { useToast } from "../context/ToastContext.jsx";
import { getTables, createTable, updateTable, deleteTable } from "../services/mesaService.js";
import { validateTable } from "../utils/validators.js";
import FormField from "../components/FormField.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

function TableForm({ initial, loading, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    espacio: initial ? String(initial.espacio) : "",
    adentro: initial ? initial.adentro : true,
    disponible: initial ? initial.disponible : true
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateTable(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ espacio: Number(values.espacio), adentro: values.adentro, disponible: values.disponible });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField id="espacio" type="number" min="1" label="Cantidad de personas" value={values.espacio} onChange={(e) => setValues({ ...values, espacio: e.target.value })} error={errors.espacio} />
      <FormField id="ubicacion" as="select" label="Ubicación" value={values.adentro ? "true" : "false"} onChange={(e) => setValues({ ...values, adentro: e.target.value === "true" })}>
        <option value="true">Salón interior</option>
        <option value="false">Exterior</option>
      </FormField>
      <FormField id="estadoMesa" as="select" label="Estado" value={values.disponible ? "true" : "false"} onChange={(e) => setValues({ ...values, disponible: e.target.value === "true" })}>
        <option value="true">Habilitada para reservas</option>
        <option value="false">Deshabilitada</option>
      </FormField>
      <div className="actions">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? "Guardar cambios" : "Crear mesa"}</Button>
      </div>
    </form>
  );
}

export default function TablesPage() {
  const toast = useToast();
  const { data: tables, loading, error, reload } = useFetch(getTables);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const run = async (action, message, close) => {
    setSaving(true);
    try {
      await action();
      toast.success(message);
      close();
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = (data) =>
    editing === "new"
      ? run(() => createTable(data), "Mesa creada correctamente.", () => setEditing(null))
      : run(() => updateTable(editing.codigo, data), "Mesa actualizada correctamente.", () => setEditing(null));

  return (
    <section aria-labelledby="titulo-mesas">
      <div className="section-head">
        <h2 id="titulo-mesas">Administrar mesas</h2>
        <Button onClick={() => setEditing("new")}>+ Nueva mesa</Button>
      </div>
      {loading && <Spinner text="Cargando mesas..." />}
      {error && <StatusMessage message={error} onRetry={reload} />}
      {tables.length > 0 && (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Listado de mesas</caption>
            <thead>
              <tr>
                <th scope="col">Número</th>
                <th scope="col">Personas</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.codigo}>
                  <td>{t.codigo}</td>
                  <td>{t.espacio}</td>
                  <td>{t.adentro ? "Salón interior" : "Exterior"}</td>
                  <td>{t.disponible ? "Habilitada" : "Deshabilitada"}</td>
                  <td className="actions">
                    <Button variant="secondary" aria-label={`Editar mesa ${t.codigo}`} onClick={() => setEditing(t)}>Editar</Button>
                    <Button variant="danger" aria-label={`Eliminar mesa ${t.codigo}`} onClick={() => setToDelete(t)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing === "new" ? "Nueva mesa" : `Editar mesa ${editing.codigo}`} onClose={() => setEditing(null)}>
          <TableForm initial={editing === "new" ? null : editing} loading={saving} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar mesa"
          message={`¿Seguro que querés eliminar la mesa ${toDelete.codigo}?`}
          loading={saving}
          onConfirm={() => run(() => deleteTable(toDelete.codigo), "Mesa eliminada correctamente.", () => setToDelete(null))}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  );
}
