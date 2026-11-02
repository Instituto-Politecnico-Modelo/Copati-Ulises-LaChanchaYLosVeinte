import logo from "../assets/logo.svg";
import Button from "./Button.jsx";

export default function Header({ pages, current, onNavigate, user, onLogout }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <img src={logo} alt="Logo de La Chancha y Los Veinte" width="48" height="48" />
          <div>
            <h1>La Chancha y Los Veinte</h1>
            <p>{user ? `${user.email} · ${user.rol}` : "Bodegón y parrilla"}</p>
          </div>
        </div>
        <nav aria-label="Navegación principal">
          <ul className="nav">
            {pages.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`nav__link ${current === p.id ? "is-active" : ""}`}
                  aria-current={current === p.id ? "page" : undefined}
                  onClick={() => onNavigate(p.id)}
                >
                  {p.label}
                  {p.badge > 0 && <span className="nav__count" aria-label={`${p.badge} productos`}>{p.badge}</span>}
                </button>
              </li>
            ))}
            {user && (
              <li>
                <Button variant="secondary" onClick={onLogout}>Cerrar sesión</Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
