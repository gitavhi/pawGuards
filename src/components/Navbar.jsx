import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="PAW GUARDS" />
          PAWGUARDS
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive("/") && location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className={isActive("/shop") ? "active" : ""}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/cart" className={`cart-link${isActive("/cart") ? " active" : ""}`}>
              🛒 Cart
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to="/orders" className={isActive("/orders") ? "active" : ""}>
                My Orders
              </Link>
            </li>
          )}
          {isLoggedIn && isAdmin && (
            <li>
              <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
                Admin Panel
              </Link>
            </li>
          )}
          {isLoggedIn ? (
            <>
              <li className="nav-user">
                <span className="nav-avatar">{user.full_name.charAt(0).toUpperCase()}</span>
                <span className="nav-name">{user.full_name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  ⏻ Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
