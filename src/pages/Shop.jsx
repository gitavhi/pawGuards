import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { db } from "../data/db";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { getProductIcon } from "../utils/productImage";

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  const categories = db.getCategories();
  const products = db.getProducts(selectedCategory || null);
  const { addToCart } = useCart();
  const { showAlert } = useAlert();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    if (val) setSearchParams({ category: val });
    else setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    showAlert("success", `${product.name} added to cart!`);
  };

  return (
    <>
      <section className="shop-header">
        <div className="container">
          <h1>Our Products</h1>
          <p>Browse our complete collection of pet products</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map((product) => (
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
                      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </p>
                    <div className="product-actions">
                      <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm">
                        View Details
                      </Link>
                      {product.stock > 0 && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
