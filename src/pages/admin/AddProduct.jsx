import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { db } from "../../data/db";
import AdminSidebar from "../../components/AdminSidebar";
import ImageUpload from "../../components/ImageUpload";

export default function AddProduct() {
  const { isAdmin } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);
  if (!isAdmin) return null;

  const categories = db.getCategories();
  const [form, setForm] = useState({ name: "", category_id: "", description: "", price: "", stock: "" });
  const [image, setImage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      db.addProduct({ name: form.name, category_id: Number(form.category_id), description: form.description, price: Number(form.price), stock: Number(form.stock), image });
      showAlert("success", "Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      showAlert("danger", err.message);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header"><h1>Add New Product</h1></div>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Product Name</label><input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required /></div>
          <div className="form-group"><label>Category</label><select name="category_id" className="form-control" value={form.category_id} onChange={handleChange} required><option value="">Select Category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="form-group"><label>Description</label><textarea name="description" className="form-control" value={form.description} onChange={handleChange} required /></div>
          <div className="form-group"><label>Price (Rs.)</label><input type="number" name="price" className="form-control" step="0.01" min="0" value={form.price} onChange={handleChange} required /></div>
          <div className="form-group"><label>Stock Quantity</label><input type="number" name="stock" className="form-control" min="0" value={form.stock} onChange={handleChange} required /></div>
          <div className="form-group"><ImageUpload value={image} onChange={setImage} /></div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="btn btn-primary">Add Product</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/products")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
