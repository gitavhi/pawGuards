import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { getProductIcon } from "../utils/productImage";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { showAlert } = useAlert();

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    showAlert("success", `${name} removed from cart.`);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: "30px", fontFamily: "var(--font-primary)", fontWeight: 700 }}>
          Shopping Cart
        </h1>
        {items.length > 0 ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product_id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div className="cart-item-img">
                          {item.image ? <img src={item.image} alt={item.name} /> : <span style={{ fontSize: "1.5rem" }}>{getProductIcon(item)}</span>}
                        </div>
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                      </div>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, Math.min(item.stock, item.quantity + 1))}>+</button>
                      </div>
                    </td>
                    <td><strong>{formatPrice(item.price * item.quantity)}</strong></td>
                    <td>
                      <button className="btn btn-danger btn-sm delete-btn" onClick={() => handleRemove(item.product_id, item.name)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-summary">
              <div className="total">Total: {formatPrice(total)}</div>
              <div style={{ textAlign: "right" }}>
                <Link to="/shop" className="btn btn-secondary" style={{ marginRight: "10px" }}>Continue Shopping</Link>
                <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Start shopping to add items to your cart!</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: "20px" }}>Browse Products</Link>
          </div>
        )}
      </div>
    </section>
  );
}
