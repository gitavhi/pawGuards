import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { db } from "../data/db";

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isLoggedIn) { navigate("/"); return null; }

  const handleLogin = (e) => {
    e.preventDefault();
    const user = db.findUser(email, password);
    if (user) {
      login(user);
      showAlert("success", `Welcome back, ${user.full_name}!`);
      navigate(user.role === "admin" ? "/admin" : "/");
    } else {
      showAlert("danger", "Invalid email or password.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to PAW GUARDS</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" className="form-control" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Login</button>
      </form>
      <div className="form-footer">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
      <div className="form-footer" style={{ marginTop: "10px", fontSize: "0.85rem" }}>
        <p>Admin: <strong>admin@pawguards.com</strong> / <strong>admin123</strong></p>
      </div>
    </div>
  );
}
