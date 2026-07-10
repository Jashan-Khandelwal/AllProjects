import { useState } from "react";
import { useCart } from "../context/CartContext";
import QuantityInput from "./QuantityInput";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  function handleQuantityChange(next) {
    // never let the "amount to add" drop below 1
    setQuantity(Math.max(1, next));
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    setQuantity(1); // reset the card back to 1 after adding
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} className="product-image" />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>

      <QuantityInput value={quantity} onChange={handleQuantityChange} min={1} />

      <button type="button" className="add-to-cart" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
