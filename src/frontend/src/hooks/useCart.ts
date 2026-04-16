import { useCartContext } from "../context/CartContext";

// Re-export cart context as a named hook for convenience
export function useCart() {
  return useCartContext();
}
