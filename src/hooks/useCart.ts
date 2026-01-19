import { useCartStore } from "@/store";
import type { Product } from "@/store/useCartStore";

export default function useCart() {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const getCartTotalQuantity = useCartStore((state) => state.getCartTotalQuantity);
  const getCartTotalPrice = useCartStore((state) => state.getCartTotalPrice);

  return {
    cart,
    addToCart: (product: Product, quantity?: number, size?: string, color?: string) =>
      addToCart(product, quantity, size, color),
    removeFromCart: (productId: number) => removeFromCart(productId),
    updateQuantity: (productId: number, quantity: number) =>
      updateQuantity(productId, quantity),
    clearCart: () => clearCart(),
    getCartTotal: () => getCartTotal(),
    getCartTotalQuantity: () => getCartTotalQuantity(),
    getCartTotalPrice: () => getCartTotalPrice(),
  };
}
