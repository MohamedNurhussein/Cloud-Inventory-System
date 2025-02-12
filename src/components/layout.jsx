// src/components/Layout.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import NavBar from "./NavBar";
import "../styles/dashboard.css";  // Styles for your main content

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  let pageTitle = "";

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("logout failed: ", e);
    }
    navigate("/");
  };

  // Determine the page title based on the route
  switch (location.pathname) {
    case "/dashboard":
      pageTitle = "Dashboard";
      break;
    case "/market":
      pageTitle = "Market";
      break;
    case "/orders":
      pageTitle = "Orders";
      break;
    default:
      pageTitle = "";
  }

  return (
    <>
      <NavBar onLogout={onLogout} pageTitle={pageTitle} />
      <div className="dashboard-container">
        <main>{children}</main>
      </div>
    </>
  );
}
