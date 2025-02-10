import { useState } from "react";
import { signup, login } from "../firebase/auth";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/authForm.css";
import logo from "../assets/logo.svg";

export default function AuthForm() {
  const navigate = useNavigate();
  const { userLoggedIn, loading, currentUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  async function addUserData() {
    try {
      await fetch("/.netlify/functions/addUserData", {
        method: "POST",
        body: JSON.stringify({
          userId: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
        }),
      });
    } catch (e) {
      console.error("failed to add user Data ,", e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
        //add user data to server-side function
        addUserData()
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <header>
        <img src={logo} alt="Cloud Inventory Logo" className="logo" />
        <h1>Cloud Inventory</h1>
      </header>
      <main>
        {userLoggedIn && navigate("/dashboard")}
        <div className="form-container">
          <div className="form-toggle">
            <button
              id="loginToggle"
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              id="signupToggle"
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Signup
            </button>
          </div>

          {/* Render Login Form */}
          {isLogin && (
            <form id="loginForm" className="active" onSubmit={handleSubmit}>
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              {loading ? (
                <div className="processing-contianer">
                  <p className="processing">Processing...</p>
                </div>
              ) : (
                <button type="submit">Login</button>
              )}
            </form>
          )}

          {/* Render Signup Form */}
          {!isLogin && (
            <form id="signupForm" className="active" onSubmit={handleSubmit}>
              <h2>Signup</h2>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              {loading ? (
                <div className="processing-contianer">
                  <p className="processing">Processing...</p>
                </div>
              ) : (
                <button type="submit">Signup</button>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
