import { useState } from "react";
// import { signup, login } from "../firebase/auth";
import { auth } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/authForm.css";
import logo from "../assets/logo.svg";
// import dotenv from "dotenv";
// dotenv.config(); // load environment variables

export default function AuthForm() {
  // console.log(process.env.FIREBASE_CLIENT_EMAIL);
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
        //login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        //signup
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        //update display name
        await updateProfile(user, {
          displayName: capitalizeFirstLetter(name),
        });
        //add user data to server-side function
        await addUserData(user.uid, name, email);
      }
      navigate("/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password. Please try again.");
          break;

        case "auth/email-already-in-use":
          setError(
            "An account with this email already exists. Please sign in or use a different email."
          );
          break;

        case "auth/weak-password":
          setError(
            "Please choose a stronger password (at least 6 characters)."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your connection and try again."
          );
          break;

        default:
          // Log the actual error for debugging
          console.error("Auth error:", err.code, err.message);
          setError("An error occurred. Please try again later.");
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
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
            >
              Login
            </button>
            <button
              id="signupToggle"
              className={!isLogin ? "active" : ""}
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
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
