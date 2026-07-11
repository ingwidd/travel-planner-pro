import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand bg-light border-bottom mb-3">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/home">
          Travel Planner
        </NavLink>
        <div className="navbar-nav ms-auto">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/diary"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Diary
          </NavLink>
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Todo
          </NavLink>
          <NavLink
            to="/currency"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Currency Converter
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
