import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import App from "./App.jsx";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,           // the layout (Navbar + Outlet)
    children: [
      { index: true, element: <Home /> },   // "/"      → Home
      { path: "shop", element: <Shop /> },   // "/shop"  → Shop
      { path: "cart", element: <Cart /> },   // "/cart"  → Cart
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
