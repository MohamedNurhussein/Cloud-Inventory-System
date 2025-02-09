import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/authForm";
import Dashboard from "./pages/dashboard";
import Market from "./pages/market";
import Orders from "./pages/orders";
import { useAuth } from "./context/authContext";

const ProtectedRoute = ({ element }) => {
  const { userLoggedIn } = useAuth();
  console.log("userLoggedIn: ", userLoggedIn);
  return userLoggedIn ? element : <Navigate to="/" />;
};
function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/market"
            element={<ProtectedRoute element={<Market />} />}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute element={<Orders />} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
