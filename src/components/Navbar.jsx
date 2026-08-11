import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li>
            <Link to="/cart" className="cart-link">
              Cart
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
              <li>
                <span style={{ color: "var(--neutral-500)", fontSize: "0.9rem" }}>
                  Hi, {user.full_name}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
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
