import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/authForm";
import Dashboard from "./pages/dashboard";
import Market from "./pages/market";
import Activity from "./pages/activity";
import { useAuth } from "./context/authContext";
import { ErrorBoundary } from "react-error-boundary";
const ProtectedRoute = ({ element }) => {
  const { userLoggedIn } = useAuth();
  //check if user is already logged in
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
            element={
              <ProtectedRoute
                element={
                  <ErrorBoundary fallback={<h1>Something went wrong</h1>}>
                    <Dashboard />
                  </ErrorBoundary>
                }
              />
            }
          />
          <Route
            path="/market"
            element={<ProtectedRoute element={<Market />} />}
          />
          <Route
            path="/activity"
            element={<ProtectedRoute element={<Activity />} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
