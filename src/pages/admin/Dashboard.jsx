import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../data/db";
import AdminSidebar from "../../components/AdminSidebar";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);
  if (!isAdmin) return null;

  const stats = db.getStats();
  const recentOrders = db.getOrders().slice(0, 5);
  const users = db.getUsers();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome, {user.full_name}!</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><h3>{stats.products}</h3><p>Total Products</p></div>
          <div className="stat-card" style={{ borderLeftColor: "var(--success)" }}><h3>{stats.orders}</h3><p>Total Orders</p></div>
          <div className="stat-card" style={{ borderLeftColor: "var(--info)" }}><h3>{stats.customers}</h3><p>Registered Customers</p></div>
          <div className="stat-card" style={{ borderLeftColor: "var(--error)" }}><h3>{formatPrice(stats.revenue)}</h3><p>Total Revenue</p></div>
        </div>
        <h2 style={{ marginBottom: "20px", fontFamily: "var(--font-primary)", fontWeight: 700 }}>Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {recentOrders.map((order) => {
                const customer = users.find((u) => u.id === order.user_id);
                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{customer?.full_name || "Unknown"}</td>
                    <td>{formatPrice(order.total_amount)}</td>
                    <td><span className={`badge badge-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td>{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <div className="empty-state"><h3>No orders yet</h3></div>}
      </div>
    </div>
  );
}
