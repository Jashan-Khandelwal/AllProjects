import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { totalCount } = useCart();
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        PokéMart
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart">
          Cart ({totalCount > 0 ? `(${totalCount})` : ""})
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
