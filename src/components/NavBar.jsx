// src/components/NavBar.tsx
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/navBar.css";
import "../styles/pageTitle.css";

export default function NavBar({ onLogout, pageTitle }) {
  return (
    <>
      {/* Top navigation bar – fixed at the top */}
      <div className="navbar-top">
        <div className="header-left">
          <img src={logo} alt="Cloud Inventory Logo" className="logo" />
          <h1 className="title">Cloud Inventory</h1>
        </div>
        <nav className="nav-links">
          <Link to="/dashboard">Inventory</Link>
          <Link to="/market">Market</Link>
          <Link to="/activity">Activity</Link>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </div>

      {/* Page title – sticky so that it stays just below the fixed navbar */}
      {pageTitle && (
        <div className="page-title">
          <h2>{pageTitle}</h2>
        </div>
      )}
    </>
  );
}
