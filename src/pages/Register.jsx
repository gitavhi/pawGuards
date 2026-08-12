import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { db } from "../data/db";
import { validateEmail, validatePassword, validateFullName, validatePhone } from "../utils/validation";

const errorStyle = { color: "var(--error)", fontSize: "0.85rem", marginTop: "6px" };

export default function Register() {
  const { isLoggedIn } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "", password: "" });
  const [errors, setErrors] = useState({});

  if (isLoggedIn) { navigate("/"); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();

    const fieldErrors = {
      full_name: validateFullName(form.full_name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      address: form.address.trim() ? "" : "Address is required.",
      password: validatePassword(form.password),
    };

    if (Object.values(fieldErrors).some((msg) => msg)) {
      setErrors(fieldErrors);
      return;
    }

    const user = db.addUser({ ...form, email: form.email.trim() });
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
      <form onSubmit={handleRegister} noValidate>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="full_name" className="form-control" placeholder="Enter your full name" value={form.full_name} onChange={handleChange} />
          {errors.full_name && <p style={errorStyle}>{errors.full_name}</p>}
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" className="form-control" placeholder="Enter your email" value={form.email} onChange={handleChange} />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" className="form-control" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} />
          {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" className="form-control" placeholder="Enter your address" value={form.address} onChange={handleChange} />
          {errors.address && <p style={errorStyle}>{errors.address}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-control" placeholder="Create a password" value={form.password} onChange={handleChange} />
          {errors.password && <p style={errorStyle}>{errors.password}</p>}
          <p style={{ color: "var(--ppp-text-muted)", fontSize: "0.8rem", marginTop: "6px" }}>
            Must be at least 6 characters with at least one letter, one number and one special character.
          </p>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Register</button>
      </form>
      <div className="form-footer">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}
