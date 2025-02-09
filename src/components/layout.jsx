// src/components/Layout.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import NavBar from "./NavBar";
import "../styles/dashboard.css"; // or import your dashboard styles
import "../styles/pageTitle.css"; // if you want to separate the page title styles

export default function Layout({ children }) {
  const navigate = useLocation();
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
  // You can adjust this logic as needed
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
      <NavBar onLogout={onLogout} />
      {pageTitle && (
        <div className="page-title">
          <h2>{pageTitle}</h2>
        </div>
      )}
      <div className="dashboard-container">
        <main>{children}</main>
      </div>
    </>
  );
}
