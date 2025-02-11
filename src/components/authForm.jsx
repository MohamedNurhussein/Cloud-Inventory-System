import { useState } from "react";
import { signup, login } from "../firebase/auth";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/authForm.css";
import logo from "../assets/logo.svg";

export default function AuthForm() {
  const navigate = useNavigate();
  const { userLoggedIn, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  async function addUserData(userId, name, email) {
    try {
      console.log("on async addUserData");
      await fetch("/.netlify/functions/addUserData", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          name: capitalizeFirstLetter(name),
          email: email,
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
        const user = await signup(name, email, password);
        if (user) {
          //add user data to server-side function
          await addUserData(user.uid, name, email);
        }
      }
      navigate("/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/user-not-found":
          setError("User not found");
          break;
        default:
          setError(err.message);
          break;
      }
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
