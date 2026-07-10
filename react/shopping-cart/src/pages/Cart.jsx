import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantityInput from "../components/QuantityInput";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop">Go to the shop →</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Your Cart</h1>

      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <img
              src={item.image}
              alt={item.title}
              className="cart-item-image"
            />

            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p>${item.price.toFixed(2)} each</p>
            </div>

            <QuantityInput
              value={item.quantity}
              onChange={(next) => updateQuantity(item.id, next)}
              min={0}
            />

            <p className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <p className="cart-total">Total: ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Cart;
