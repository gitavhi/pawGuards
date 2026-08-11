import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/logo.png" alt="" style={{ width: 32, height: 32, borderRadius: 8 }} />
              PAW GUARDS
            </h3>
            <p>
              Your trusted online destination for premium pet food, accessories,
              and healthcare products. We are committed to keeping your furry
              friends happy and healthy.
            </p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/shop">Shop</Link></p>
            <p><Link to="/login">Login</Link></p>
            <p><Link to="/register">Register</Link></p>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>Nayabazar, Khusibu, Kathmandu</p>
            <p>Nepal</p>
            <p>Email: info@pawguards.com</p>
            <p>Phone: +977-1-1234567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PAW GUARDS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
