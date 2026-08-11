import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { db } from "../data/db";

export default function Register() {
  const { isLoggedIn } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "", password: "" });

  if (isLoggedIn) { navigate("/"); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    const user = db.addUser(form);
    if (user) {
      showAlert("success", "Registration successful! Please login.");
      navigate("/login");
    } else {
      showAlert("danger", "Email already registered. Please login.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="full_name" className="form-control" placeholder="Enter your full name" value={form.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" className="form-control" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" className="form-control" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" className="form-control" placeholder="Enter your address" value={form.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-control" placeholder="Create a password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Register</button>
      </form>
      <div className="form-footer">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}
