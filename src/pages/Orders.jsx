import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../data/db";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Orders() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  if (!isLoggedIn) { navigate("/login"); return null; }

  const orders = db.getOrders(user.id);

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: "30px", fontFamily: "var(--font-primary)", fontWeight: 700 }}>My Orders</h1>
        {orders.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date &amp; Time</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td>
                    <div style={{ lineHeight: 1.6 }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: "0.9rem" }}>
                          {item.name} <span style={{ color: "var(--ppp-text-muted)" }}>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td><strong>{formatPrice(order.total_amount)}</strong></td>
                  <td><span className={`badge badge-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                  <td><Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline">View Details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Start shopping to place your first order!</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: "20px" }}>Browse Products</Link>
          </div>
        )}
      </div>
    </section>
  );
}
