import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { db } from "../../data/db";
import AdminSidebar from "../../components/AdminSidebar";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);
  if (!isAdmin) return null;

  const orders = db.getOrders();
  const users = db.getUsers();

  const handleStatusChange = (orderId, status) => {
    db.updateOrderStatus(orderId, status);
    showAlert("success", `Order #${orderId} status updated to ${status}.`);
    setRefresh(!refresh);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header"><h1>Manage Orders</h1></div>
        <table className="data-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map((order) => {
              const customer = users.find((u) => u.id === order.user_id);
              return (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{customer?.full_name || "Unknown"}</td>
                  <td>{formatPrice(order.total_amount)}</td>
                  <td><span className={`badge badge-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                  <td>{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-secondary">View</Link>
                      <select className="form-control" style={{ width: "auto", padding: "5px 10px", fontSize: "0.85rem" }} value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
