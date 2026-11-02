import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getTables, getTableSchedules } from "../services/mesaService.js";
import { getReservations, createReservation, cancelReservation } from "../services/reservaService.js";
import { formatDate, todayISO } from "../utils/format.js";
import FormField from "../components/FormField.jsx";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

const describeTable = (t) => `Mesa ${t.codigo} · ${t.espacio} personas · ${t.adentro ? "Salón" : "Exterior"}`;

export default function ReservationsPage() {
  const { user, isStaff } = useAuth();
  const toast = useToast();
  const tables = useFetch(getTables);
  const reservations = useFetch(getReservations);

  const [mesa, setMesa] = useState("");
  const [fecha, setFecha] = useState(todayISO());
  const [hora, setHora] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toCancel, setToCancel] = useState(null);

  const loadSchedules = async () => {
    if (!mesa || !fecha) {
      setSchedules([]);
      return;
    }
    setLoadingSchedules(true);
    try {
      setSchedules(await getTableSchedules(mesa, fecha));
    } catch (err) {
      setSchedules([]);
      toast.error(err.message);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Cada vez que cambia la mesa o la fecha se consultan los horarios al backend.
  useEffect(() => {
    setHora("");
    loadSchedules();
  }, [mesa, fecha]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mesa || !fecha || !hora) {
      toast.error("Elegí una mesa, una fecha y un horario.");
      return;
    }
    setSaving(true);
    try {
      await createReservation({ codigoMesa: Number(mesa), fecha, hora });
      toast.success(`Reserva confirmada: mesa ${mesa}, ${formatDate(fecha)} a las ${hora}.`);
      setHora("");
      await Promise.all([reservations.reload(), loadSchedules()]);
    } catch (err) {
      toast.error(err.message);
      await loadSchedules();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setSaving(true);
    try {
      await cancelReservation(toCancel.codigo);
      toast.success("Reserva cancelada correctamente.");
      setToCancel(null);
      await Promise.all([reservations.reload(), loadSchedules()]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tableById = (id) => tables.data.find((t) => t.codigo === id);
  const sorted = [...reservations.data].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));

  return (
    <section aria-labelledby="titulo-reservas">
      <h2 id="titulo-reservas">Reservar una mesa</h2>
      <p className="lead">Las mesas se llenan entre las 20:30 y las 21:00, ¡reservá con anticipación!</p>

      {tables.loading && <Spinner text="Cargando mesas..." />}
      {tables.error && <StatusMessage message={tables.error} onRetry={tables.reload} />}

      {!tables.loading && !tables.error && (
        <form className="panel" onSubmit={handleSubmit} noValidate>
          <FormField id="mesa" as="select" label="Mesa" value={mesa} onChange={(e) => setMesa(e.target.value)}>
            <option value="">Seleccioná una mesa</option>
            {tables.data.filter((t) => t.disponible).map((t) => (
              <option key={t.codigo} value={t.codigo}>{describeTable(t)}</option>
            ))}
          </FormField>
          <FormField id="fecha" type="date" label="Fecha" min={todayISO()} value={fecha} onChange={(e) => setFecha(e.target.value)} />

          <fieldset className="schedules">
            <legend>Horarios</legend>
            {!mesa && <p className="muted">Elegí una mesa para ver los horarios.</p>}
            {loadingSchedules && <Spinner text="Consultando horarios..." />}
            {mesa && !loadingSchedules && (
              <div className="chips">
                {schedules.map((s) => (
                  <label key={s.hora} className={`chip ${!s.disponible ? "is-disabled" : ""} ${hora === s.hora ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="hora"
                      value={s.hora}
                      disabled={!s.disponible}
                      checked={hora === s.hora}
                      onChange={() => setHora(s.hora)}
                    />
                    {s.hora}
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <Button type="submit" loading={saving}>Confirmar reserva</Button>
        </form>
      )}

      <h2>{isStaff ? "Todas las reservas" : "Mis reservas"}</h2>
      {reservations.loading && <Spinner text="Cargando reservas..." />}
      {reservations.error && <StatusMessage message={reservations.error} onRetry={reservations.reload} />}
      {!reservations.loading && !reservations.error && sorted.length === 0 && (
        <StatusMessage message="No hay reservas realizadas." />
      )}
      {sorted.length > 0 && (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Listado de reservas</caption>
            <thead>
              <tr>
                <th scope="col">Mesa</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                {isStaff && <th scope="col">Usuario</th>}
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.codigo}>
                  <td>{tableById(r.codigoMesa) ? describeTable(tableById(r.codigoMesa)) : `Mesa ${r.codigoMesa}`}</td>
                  <td>{formatDate(r.fecha)}</td>
                  <td>{r.hora}</td>
                  {isStaff && <td>{r.emailUsuario}</td>}
                  <td><StatusBadge status={r.estado} /></td>
                  <td>
                    {r.estado === "Reservada" && r.codigoUsuario === user.codigo && (
                      <Button variant="danger" aria-label={`Cancelar reserva de la mesa ${r.codigoMesa}`} onClick={() => setToCancel(r)}>
                        Cancelar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toCancel && (
        <ConfirmDialog
          title="Cancelar reserva"
          message={`¿Seguro que querés cancelar tu reserva del ${formatDate(toCancel.fecha)} a las ${toCancel.hora}?`}
          confirmText="Cancelar reserva"
          loading={saving}
          onConfirm={handleCancel}
          onCancel={() => setToCancel(null)}
        />
      )}
    </section>
  );
}
