import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../data/db";
import AdminSidebar from "../../components/AdminSidebar";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);
  if (!isAdmin) return null;

  const order = db.getOrder(id);
  if (!order) { navigate("/admin/orders"); return null; }

  const users = db.getUsers();
  const customer = users.find((u) => u.id === order.user_id);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Order #{order.id}</h1>
          <span className={`badge badge-${order.status}`} style={{ fontSize: "1rem", padding: "8px 20px" }}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <div className="checkout-grid">
          <div className="order-summary">
            <h3>Order Items</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ color: "var(--ppp-text-muted)", fontSize: "0.85rem" }}>Qty: {item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <strong>{formatPrice(item.quantity * item.price)}</strong>
              </div>
            ))}
            <div className="order-item" style={{ borderTop: "2px solid var(--neutral-200)", paddingTop: "15px", marginTop: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}><strong>Total</strong></span>
              <strong style={{ color: "var(--primary)", fontSize: "1.5rem" }}>{formatPrice(order.total_amount)}</strong>
            </div>
          </div>
          <div className="admin-form">
            <h3>Customer Details</h3>
            <p style={{ marginBottom: "10px" }}><strong>Name:</strong> {customer?.full_name || "Unknown"}</p>
            <p style={{ marginBottom: "10px" }}><strong>Email:</strong> {customer?.email || "N/A"}</p>
            <p style={{ marginBottom: "10px" }}><strong>Phone:</strong> {order.phone}</p>
            <p style={{ marginBottom: "20px" }}><strong>Address:</strong><br />{order.shipping_address}</p>
            <p style={{ marginBottom: "10px" }}><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <div style={{ marginTop: "30px" }}><Link to="/admin/orders" className="btn btn-outline">Back to Orders</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
