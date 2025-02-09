// src/components/NavBar.tsx
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/navBar.css";

export default function NavBar({ onLogout }) {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Cloud Inventory Logo" className="logo" />
        <h1 className="title">Cloud Inventory</h1>
      </div>
      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/market">Market</Link>
        <Link to="/orders">Orders</Link>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
}
