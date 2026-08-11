import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;
  const isActive = (route) => path === route || path.startsWith(route + "/");

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>
          <img src="/logo.png" alt="" style={{ width: 28, height: 28, borderRadius: 6, verticalAlign: "middle", marginRight: 6 }} />
          PAWGUARDS
        </h2>
        <p>Admin Panel</p>
      </div>
      <nav>
        <Link to="/admin" className={path === "/admin" ? "active" : ""}>📊 Dashboard</Link>
        <Link to="/admin/products" className={isActive("/admin/products") || isActive("/admin/add-product") || isActive("/admin/edit-product") ? "active" : ""}>📦 Products</Link>
        <Link to="/admin/orders" className={isActive("/admin/orders") ? "active" : ""}>🛒 Orders</Link>
        <Link to="/">🏪 View Store</Link>
        <Link to="/logout">🚪 Logout</Link>
      </nav>
    </aside>
  );
}
