interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  type: string;
  label?: string;
  error?: string;
}
interface InputWithoutIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label?: string;
  error?: string;
}

interface ButtonWithLoaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  initialText: string;
  loadingText: string;
}

interface SelectWithIconProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ReactNode;
  label?: string;
  error?: string;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface SelectWithoutIconProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface CartStore {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartTotalQuantity: () => number;
  getCartTotalPrice: () => number;
  getCartTotalQuantity: () => number;
}

// User Interface
interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country?: string;
  };
  isNewUser: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Interface
interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
}

// Order Status Types
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentMethod = "paystack" | "delivery";
type PaymentStatus = "pending" | "completed" | "failed";

// Order Interface
interface IOrder {
  id: string;
  user?: string | IUser; // Can be ObjectId string or populated User object
  name: string;
  deliveryNote?: string;
  price: number;
  images: string[];
  category: string;
  sizes?: string;
  colors?: string;
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}