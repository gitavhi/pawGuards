import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { db } from "../../data/db";
import AdminSidebar from "../../components/AdminSidebar";
import { getProductIcon } from "../../utils/productImage";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function AdminProducts() {
  const { isAdmin } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);
  if (!isAdmin) return null;

  const products = db.getProducts();
  const categories = db.getCategories();

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      db.deleteProduct(id);
      showAlert("success", "Product deleted successfully!");
      window.location.reload();
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Manage Products</h1>
          <Link to="/admin/add-product" className="btn btn-primary">+ Add New Product</Link>
        </div>
        <table className="data-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><div className="table-img">{p.image ? <img src={p.image} alt="" /> : <span style={{ fontSize: "1.5rem" }}>{getProductIcon(p)}</span>}</div></td>
                <td><strong>{p.name}</strong></td>
                <td>{categories.find((c) => c.id === p.category_id)?.name}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/edit-product/${p.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                    <button className="btn btn-sm btn-danger delete-btn" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
