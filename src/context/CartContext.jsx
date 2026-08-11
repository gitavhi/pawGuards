import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("pg_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persistCart = (cartItems) => {
    localStorage.setItem("pg_cart", JSON.stringify(cartItems));
  };

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity,
          },
        ];
      }
      persistCart(updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      persistCart(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.product_id !== productId);
      persistCart(updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("pg_cart");
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
