const CATEGORIES = [
  { id: 1, name: "Food", description: "Premium pet food and nutrition products" },
  { id: 2, name: "Accessories", description: "Pet accessories, toys, and lifestyle products" },
  { id: 3, name: "Medicine", description: "Pet health treatments and medications" },
];

const PRODUCTS = [
  { id: 1, category_id: 1, name: "Premium Dog Food", description: "High-quality dry dog food for adult dogs, 5kg pack. Rich in protein and essential nutrients for a healthy, active lifestyle.", price: 2500, stock: 50, image: "" },
  { id: 2, category_id: 1, name: "Cat Wet Food Tuna", description: "Delicious tuna-flavored wet food for cats, 400g can. Made with real fish chunks in gravy.", price: 350, stock: 100, image: "" },
  { id: 3, category_id: 1, name: "Puppy Milk Formula", description: "Nutritional milk formula for newborn puppies. Easy to digest and fortified with vitamins.", price: 800, stock: 30, image: "" },
  { id: 4, category_id: 2, name: "Leather Dog Collar", description: "Durable genuine leather collar with stainless steel buckle. Available in multiple sizes.", price: 600, stock: 40, image: "" },
  { id: 5, category_id: 2, name: "Cat Scratching Post", description: "Natural sisal rope scratching post for cats. Helps keep claws healthy and furniture safe.", price: 1200, stock: 25, image: "" },
  { id: 6, category_id: 2, name: "Pet Grooming Kit", description: "Complete grooming kit with brush, comb, nail clipper, and deshedding tool.", price: 950, stock: 35, image: "" },
  { id: 7, category_id: 3, name: "Dog Deworming Tablet", description: "Broad-spectrum deworming tablets for dogs, pack of 6. Effective against roundworms and tapeworms.", price: 450, stock: 60, image: "" },
  { id: 8, category_id: 3, name: "Cat Flea Collar", description: "Anti-flea collar for cats, effective for 8 months. Waterproof and odorless.", price: 700, stock: 45, image: "" },
  { id: 9, category_id: 3, name: "Pet Antiseptic Spray", description: "First aid antiseptic spray for minor wounds and cuts. Safe for dogs and cats.", price: 300, stock: 80, image: "" },
];

const DEFAULT_ADMIN = {
  id: 1,
  full_name: "Admin",
  email: "admin@pawguards.com",
  password: "admin123",
  role: "admin",
};

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage(key, data) {
  const MAX_STORAGE_BYTES = 3.5 * 1024 * 1024;
  const serialized = JSON.stringify(data);
  if (serialized.length > MAX_STORAGE_BYTES) {
    throw new Error(
      "Browser storage is full. Delete some product images or clear your browser data for this site, then try again."
    );
  }
  try {
    localStorage.setItem(key, serialized);
  } catch {
    throw new Error(
      "Browser storage is full. Delete some product images or clear your browser data for this site, then try again."
    );
  }
}

const MAX_PRODUCT_IMAGE_BYTES = 250 * 1024;

function initializeDB() {
  if (!getFromStorage("pg_initialized", false)) {
    setToStorage("pg_categories", CATEGORIES);
    setToStorage("pg_products", PRODUCTS);
    setToStorage("pg_users", [DEFAULT_ADMIN]);
    setToStorage("pg_orders", []);
    setToStorage("pg_initialized", true);
  }

  // Repair oversized images left over from earlier versions (can freeze the page)
  try {
    const products = getFromStorage("pg_products", PRODUCTS);
    let changed = false;
    const cleaned = products.map((p) => {
      if (p.image && p.image.length > MAX_PRODUCT_IMAGE_BYTES) {
        changed = true;
        return { ...p, image: "" };
      }
      return p;
    });
    if (changed) {
      localStorage.setItem("pg_products", JSON.stringify(cleaned));
    }
  } catch {
    // ignore repair errors
  }
}

const db = {
  // Categories
  getCategories() {
    return getFromStorage("pg_categories", CATEGORIES);
  },

  // Products
  getProducts(categoryId = null) {
    const products = getFromStorage("pg_products", PRODUCTS);
    if (categoryId) return products.filter((p) => p.category_id === Number(categoryId));
    return products;
  },

  getProduct(id) {
    const products = getFromStorage("pg_products", PRODUCTS);
    return products.find((p) => p.id === Number(id));
  },

  addProduct(product) {
    const products = getFromStorage("pg_products", PRODUCTS);
    const newProduct = { ...product, id: generateId() };
    products.push(newProduct);
    setToStorage("pg_products", products);
    return newProduct;
  },

  updateProduct(id, updates) {
    const products = getFromStorage("pg_products", PRODUCTS);
    const index = products.findIndex((p) => p.id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      setToStorage("pg_products", products);
      return products[index];
    }
    return null;
  },
  deleteProduct(id) {
    let products = getFromStorage("pg_products", PRODUCTS);
    products = products.filter((p) => p.id !== Number(id));
    setToStorage("pg_products", products);
  },

  // Users
  getUsers() {
    return getFromStorage("pg_users", [DEFAULT_ADMIN]);
  },

  findUser(email, password) {
    const users = getFromStorage("pg_users", [DEFAULT_ADMIN]);
    return users.find((u) => u.email === email && u.password === password);
  },

  findUserByEmail(email) {
    const users = getFromStorage("pg_users", [DEFAULT_ADMIN]);
    return users.find((u) => u.email === email);
  },

  addUser(user) {
    const users = getFromStorage("pg_users", [DEFAULT_ADMIN]);
    if (users.find((u) => u.email === user.email)) return null;
    const newUser = { ...user, id: generateId(), role: "customer" };
    users.push(newUser);
    setToStorage("pg_users", users);
    return newUser;
  },

  // Orders
  getOrders(userId = null) {
    const orders = getFromStorage("pg_orders", []);
    if (userId) return orders.filter((o) => o.user_id === Number(userId));
    return orders;
  },

  getOrder(id) {
    const orders = getFromStorage("pg_orders", []);
    return orders.find((o) => o.id === Number(id));
  },

  placeOrder(userId, items, totalAmount, shippingAddress, phone) {
    const orders = getFromStorage("pg_orders", []);
    const products = getFromStorage("pg_products", PRODUCTS);

    const newOrder = {
      id: generateId(),
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      phone,
      status: "pending",
      created_at: new Date().toISOString(),
      items: items.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    items.forEach((item) => {
      const pIndex = products.findIndex((p) => p.id === item.product_id);
      if (pIndex !== -1) {
        products[pIndex].stock -= item.quantity;
      }
    });

    orders.unshift(newOrder);
    setToStorage("pg_orders", orders);
    setToStorage("pg_products", products);
    return newOrder;
  },

  updateOrderStatus(orderId, status) {
    const orders = getFromStorage("pg_orders", []);
    const index = orders.findIndex((o) => o.id === Number(orderId));
    if (index !== -1) {
      orders[index].status = status;
      setToStorage("pg_orders", orders);
      return orders[index];
    }
    return null;
  },

  // Stats
  getStats() {
    const products = getFromStorage("pg_products", PRODUCTS);
    const orders = getFromStorage("pg_orders", []);
    const users = getFromStorage("pg_users", [DEFAULT_ADMIN]);
    const customers = users.filter((u) => u.role === "customer");
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total_amount, 0);

    return {
      products: products.length,
      orders: orders.length,
      customers: customers.length,
      revenue,
    };
  },
};

export { db, initializeDB };
