import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { db } from "../data/db";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function Checkout() {
  const { user, isLoggedIn } = useAuth();
  const { items, total, clearCart } = useCart();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  if (!isLoggedIn) { navigate("/login"); return null; }
  if (items.length === 0) { navigate("/cart"); return null; }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!phone.trim() || !address.trim()) {
      showAlert("danger", "Please fill in all required fields.");
      return;
    }
    const order = db.placeOrder(user.id, items, total, address.trim(), phone.trim());
    clearCart();
    showAlert("success", `Order #${order.id} placed successfully!`);
    navigate(`/orders/${order.id}`);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: "30px", fontFamily: "var(--font-primary)", fontWeight: 700 }}>Checkout</h1>
        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-grid">
            <div className="admin-form">
              <h2>Shipping Details</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" value={user.full_name} disabled />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="text" className="form-control" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Shipping Address *</label>
                <textarea className="form-control" placeholder="Enter your full shipping address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Place Order</button>
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              {items.map((item) => (
                <div key={item.product_id} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="order-item" style={{ borderTop: "2px solid var(--neutral-200)", paddingTop: "15px", marginTop: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}><strong>Total</strong></span>
                <strong style={{ color: "var(--primary)", fontSize: "1.5rem" }}>{formatPrice(total)}</strong>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
