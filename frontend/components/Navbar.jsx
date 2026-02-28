import { Link } from "react-router-dom";
import Notification from "./Notification";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container-fluid">
        
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Telecom Maintenance
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/assets">Assets</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/plans">Plans</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/tasks/">My Tasks</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/workers">Workers</Link>
            </li>

          </ul>

          {/* Notification Right Side */}
          <div className="d-flex">
            <Notification />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;