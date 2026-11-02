// Prueba de humo del backend. Uso: iniciar el servidor (npm start) y luego `node smoke-test.mjs`.
const BASE = process.env.API_URL || "http://localhost:3000";

const call = async (label, method, path, body, token) => {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
    const json = await res.json();
    const detail = json.success ? JSON.stringify(json.data).slice(0, 90) : json.message;
    console.log(`${String(res.status).padEnd(4)} ${label.padEnd(28)} ${detail}`);
    return json.data;
};

const email = `test${Date.now()}@mail.com`;
await call("registro email inválido", "POST", "/usuarios/registro", { email: "x", contrasenia: "123456", telefono: "1122334455" });
await call("registro contraseña corta", "POST", "/usuarios/registro", { email, contrasenia: "123", telefono: "1122334455" });
await call("registro OK", "POST", "/usuarios/registro", { email, contrasenia: "123456", telefono: "1122334455" });
await call("registro duplicado", "POST", "/usuarios/registro", { email, contrasenia: "123456", telefono: "1122334455" });
await call("login incorrecto", "POST", "/usuarios/login", { email, contrasenia: "xxxxxx" });
const { token: user } = await call("login usuario", "POST", "/usuarios/login", { email, contrasenia: "123456" });
const { token: admin } = await call("login admin", "POST", "/usuarios/login", { email: "admin@chancha.com", contrasenia: "admin123" });

await call("mesas sin sesión", "GET", "/mesas");
await call("horarios", "GET", "/mesas/1/horarios?fecha=2030-01-10", null, user);
const reserva = await call("reserva OK", "POST", "/reservas", { codigoMesa: 1, fecha: "2030-01-10", hora: "21:00" }, user);
await call("reserva duplicada", "POST", "/reservas", { codigoMesa: 1, fecha: "2030-01-10", hora: "21:00" }, admin);
await call("reserva en el pasado", "POST", "/reservas", { codigoMesa: 2, fecha: "2020-01-10", hora: "21:00" }, user);
await call("cancelar reserva ajena", "DELETE", `/reservas/${reserva.codigo}`, null, admin);
await call("cancelar reserva propia", "DELETE", `/reservas/${reserva.codigo}`, null, user);

await call("pedido vacío", "POST", "/pedidos", { items: [] }, user);
await call("pedido sin stock", "POST", "/pedidos", { items: [{ codigoProducto: 3, cantidad: 999 }] }, user);
const pedido = await call("pedido OK", "POST", "/pedidos", { items: [{ codigoProducto: 3, cantidad: 2 }, { codigoProducto: 6, cantidad: 1 }] }, user);
await call("stock descontado", "GET", "/productos/3");
await call("usuario cambia estado", "PATCH", `/pedidos/${pedido.codigo}/estado`, { estado: "Pagado" }, user);
await call("admin salta de estado", "PATCH", `/pedidos/${pedido.codigo}/estado`, { estado: "Entregado" }, admin);
await call("admin avanza a Pagado", "PATCH", `/pedidos/${pedido.codigo}/estado`, { estado: "Pagado" }, admin);
await call("cancelar pedido", "DELETE", `/pedidos/${pedido.codigo}`, null, user);
await call("stock restaurado", "GET", "/productos/3");

await call("crear producto (usuario)", "POST", "/productos", { nombre: "x", precio: 1, cantidadDisponible: 1 }, user);
await call("crear producto inválido", "POST", "/productos", { nombre: "", precio: -1, cantidadDisponible: 1 }, admin);
await call("crear mesa (admin)", "POST", "/mesas", { espacio: 4, adentro: true }, admin);
