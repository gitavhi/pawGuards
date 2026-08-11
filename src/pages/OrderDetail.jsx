import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../data/db";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function OrderDetail() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  if (!isLoggedIn) { navigate("/login"); return null; }

  const order = db.getOrder(id);
  if (!order || order.user_id !== user.id) { navigate("/orders"); return null; }

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ fontFamily: "var(--font-primary)", fontWeight: 700 }}>Order #{order.id}</h1>
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
            <h3>Shipping Details</h3>
            <p style={{ marginBottom: "10px" }}><strong>Phone:</strong> {order.phone}</p>
            <p style={{ marginBottom: "20px" }}><strong>Address:</strong><br />{order.shipping_address}</p>
            <p style={{ marginBottom: "10px" }}><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <div style={{ marginTop: "30px" }}><Link to="/orders" className="btn btn-outline">Back to Orders</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
