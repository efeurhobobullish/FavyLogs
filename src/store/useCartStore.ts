import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  image: string;
  isNew?: boolean;
  originalId?: string; // Store original string ID for navigation
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartTotalQuantity: () => number;
  getCartTotalPrice: () => number;
}

 const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product, quantity = 1, size, color) => {
        const { cart } = get();
        const existingItem = cart.find(
          (item) =>
            item.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [
              ...cart,
              {
                ...product,
                quantity,
                selectedSize: size,
                selectedColor: color,
              },
            ],
          });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => {
        set({ cart: [] });
      },
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
      getCartTotalQuantity: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
      getCartTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.priceValue * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;