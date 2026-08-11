# PAW GUARDS - Pet Ecommerce Website

A React (Vite) single-page ecommerce application for pet products — food, accessories, and healthcare for dogs, cats, birds, and fish.

## Features

- Storefront: Home, Shop (search + category filter), Product detail pages
- Shopping cart for both guests and logged-in users
- Authentication: register / login / logout (admin account included)
- Admin panel: dashboard, product management, order management
- Product image upload with automatic compression (stored in browser localStorage)
- Smart product icons when no photo is uploaded
- Responsive, warm orange theme matching mypawguards.com

## Tech Stack

- React 19 + React Router 7
- Vite 8
- Oxlint
- No backend — data persists in browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```

## Admin Access

- Email: `admin@pawguards.com`
- Password: `admin123`

## Notes

- Products, users, orders, and cart are stored in the browser's localStorage, so data is per-browser and per-device.
- Uploaded photos are resized to a maximum of 300px and stored as compressed JPEG data URLs.
