import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../data/db";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { getProductIcon } from "../utils/productImage";

const CATEGORY_ICONS = { Food: "🍖", Accessories: "🦴", Medicine: "💊" };

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function Home() {
  const categories = db.getCategories();
  const products = db.getProducts().slice(-6).reverse();
  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const [quantities, setQuantities] = useState({});

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, value) => setQuantities({ ...quantities, [id]: value });

  const handleAddToCart = (product) => {
    addToCart(product, getQty(product.id));
    showAlert("success", `${product.name} added to cart!`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            Welcome to <span>PAW GUARDS</span>
          </h1>
          <p>
            Your one-stop pet ecommerce destination for premium food,
            accessories, and healthcare products for your beloved companions.
          </p>
          <Link to="/shop" className="btn">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our Categories</h2>
            <p>Browse through our carefully curated product categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="category-card"
              >
                <div className="icon">{CATEGORY_ICONS[cat.name] || "🐾"}</div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--neutral-0)" }}>
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Check out our latest and most popular products</p>
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="placeholder-img">{getProductIcon(product)}</div>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">
                    {categories.find((c) => c.id === product.category_id)?.name}
                  </span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <p className="product-stock">
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}
                  </p>
                  {product.stock > 0 && (
                    <div className="product-qty">
                      <label>Qty:</label>
                      <div className="qty-control">
                        <button onClick={() => setQty(product.id, Math.max(1, getQty(product.id) - 1))}>-</button>
                        <span>{getQty(product.id)}</span>
                        <button onClick={() => setQty(product.id, Math.min(product.stock, getQty(product.id) + 1))}>+</button>
                      </div>
                    </div>
                  )}
                  <div className="product-actions">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      View Details
                    </Link>
                    {product.stock > 0 && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Link to="/shop" className="btn btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose PAW GUARDS?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">🚚</div>
              <h4>Fast Delivery</h4>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="icon">✅</div>
              <h4>Quality Products</h4>
              <p>Only the best and verified products for your pets</p>
            </div>
            <div className="feature-card">
              <div className="icon">💰</div>
              <h4>Best Prices</h4>
              <p>Competitive pricing on all pet supplies</p>
            </div>
            <div className="feature-card">
              <div className="icon">🛡️</div>
              <h4>Secure Shopping</h4>
              <p>Safe and secure checkout process</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
