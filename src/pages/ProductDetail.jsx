import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { getProductIcon } from "../utils/productImage";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const [quantity, setQuantity] = useState(1);

  const product = db.getProduct(id);
  const categories = db.getCategories();

  if (!product) {
    navigate("/shop");
    return null;
  }

  const category = categories.find((c) => c.id === product.category_id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showAlert("success", `${product.name} added to cart!`);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="placeholder-img-lg">{getProductIcon(product)}</div>
            )}
          </div>
          <div className="product-detail-info">
            <span className="product-category">{category?.name}</span>
            <h1>{product.name}</h1>
            <p className="product-price" style={{ fontSize: "2rem" }}>
              {formatPrice(product.price)}
            </p>
            <p style={{
              color: product.stock > 0 ? "var(--success)" : "var(--error)",
              fontWeight: 600,
              marginBottom: "20px",
            }}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </p>
            <p style={{ lineHeight: 1.8, color: "var(--ppp-text-muted)", marginBottom: "30px" }}>
              {product.description}
            </p>

            {product.stock > 0 && (
              <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "30px" }}>
                <label style={{ fontWeight: 600 }}>Quantity:</label>
                <div className="qty-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            )}

            <div style={{ marginTop: "30px" }}>
              <Link to="/shop" className="btn btn-outline">Back to Shop</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
