import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../data/db";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
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
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>{formatPrice(order.total_amount)}</td>
                  <td><span className={`badge badge-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                  <td><Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline">View</Link></td>
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
