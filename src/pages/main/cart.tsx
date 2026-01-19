import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck } from "lucide-react";
import useCart from "@/hooks/useCart";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotalPrice, getCartTotalQuantity } = useCart();
  const { createOrderWithPayment, loading: orderLoading } = useOrder();
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "delivery">("paystack");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = getCartTotalPrice();
  const totalQuantity = getCartTotalQuantity();
  const shippingFee = totalPrice >= 50000 ? 0 : 2000; // Free shipping over ₦50,000
  const finalTotal = totalPrice + shippingFee;

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Check auth on mount
  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) {
          toast.error("Please login to place an order");
          navigate("/auth");
        }
      });
    }
  }, [user, checkAuth, navigate]);

  const prepareOrderData = () => {
    if (!user || !user.address) {
      toast.error("Please complete your profile with delivery address");
      navigate("/profile");
      return null;
    }

    // Combine all cart items into order data
    const allImages = cart.flatMap((item) => item.image);
    const allCategories = [...new Set(cart.map((item) => item.category))];
    const allSizes = cart
      .map((item) => item.selectedSize)
      .filter((size): size is string => !!size)
      .join(", ");
    const allColors = cart
      .map((item) => item.selectedColor)
      .filter((color): color is string => !!color)
      .join(", ");

    // Create order name from cart items
    const orderName =
      cart.length === 1
        ? cart[0].name
        : `${cart[0].name}${cart.length > 1 ? ` and ${cart.length - 1} more item${cart.length > 2 ? "s" : ""}` : ""}`;

    return {
      name: orderName,
      price: totalPrice,
      images: allImages,
      category: allCategories.join(", "),
      sizes: allSizes || undefined,
      colors: allColors || undefined,
      totalPrice: finalTotal,
      deliveryAddress: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
      },
    };
  };

  const handlePaystackPayment = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/auth");
      return;
    }

    const orderData = prepareOrderData();
    if (!orderData) return;

    setIsProcessing(true);
    try {
      // createOrderWithPayment handles payment and order creation internally
      // For paystack, it will create the order after successful payment in the callback
      // The function resolves when payment is successful, order is created in callback
      await createOrderWithPayment(orderData, "paystack");
      // Clear cart and navigate - order will be created in the payment callback
      // The orders page will automatically refetch and show the new order
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Payment error:", error);
      // Error is already handled in the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayOnDelivery = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/auth");
      return;
    }

    const orderData = prepareOrderData();
    if (!orderData) return;

    setIsProcessing(true);
    try {
      await createOrderWithPayment(orderData, "delivery");
      clearCart();
      toast.success("Order placed successfully! You will pay on delivery.");
      navigate("/orders");
    } catch (error) {
      console.error("Order creation error:", error);
      // Error is already handled in the hook
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingBag size={48} className="text-muted" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
              >
                <ShoppingBag size={18} />
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-main uppercase font-space mb-2">
                Shopping Cart
              </h1>
              <p className="text-muted text-sm md:text-base">
                {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                // Use originalId for navigation if available, otherwise use numeric id
                const productId = item.originalId || item.id.toString();
                
                return (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="bg-secondary p-4 md:p-6 flex flex-col md:flex-row gap-4"
                  >
                  {/* Product Image */}
                  <Link
                    to={`/shop/${productId}`}
                    className="w-full md:w-32 h-32 bg-background flex-shrink-0 overflow-hidden"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const placeholder = img.nextElementSibling as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    {/* Placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
                      <span className="text-muted text-xs font-space uppercase text-center px-2">
                        {item.name}
                      </span>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/shop/${productId}`}
                          className="text-lg font-semibold text-main hover:text-main/80 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted font-space uppercase">
                          {item.category}
                        </p>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-2 mt-2">
                            {item.selectedSize && (
                              <span className="text-xs px-2 py-1 bg-background text-main font-space">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-xs px-2 py-1 bg-background text-main font-space">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted hover:text-main transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-background transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-space font-semibold text-main min-w-[50px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-background transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-main font-space">
                        ₦{(item.priceValue * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-main uppercase font-space mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-main font-semibold">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-main font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₦${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-line pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-main uppercase font-space">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-main font-space">
                      ₦{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6 space-y-3">
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                    Payment Method
                  </label>
                  <button
                    onClick={() => setPaymentMethod("paystack")}
                    className={`w-full flex items-center gap-3 p-4 border-2 transition-all ${
                      paymentMethod === "paystack"
                        ? "border-main bg-main/10"
                        : "border-line hover:border-main/50"
                    }`}
                  >
                    <CreditCard size={20} />
                    <span className="font-space font-semibold text-sm">Pay with Paystack</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("delivery")}
                    className={`w-full flex items-center gap-3 p-4 border-2 transition-all ${
                      paymentMethod === "delivery"
                        ? "border-main bg-main/10"
                        : "border-line hover:border-main/50"
                    }`}
                  >
                    <Truck size={20} />
                    <span className="font-space font-semibold text-sm">Pay on Delivery</span>
                  </button>
                </div>

                {/* Payment Buttons */}
                {paymentMethod === "paystack" ? (
                  <button
                    onClick={handlePaystackPayment}
                    disabled={isProcessing || orderLoading || !user}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    <span>{isProcessing || orderLoading ? "Processing..." : "Pay Now with Paystack"}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePayOnDelivery}
                    disabled={isProcessing || orderLoading || !user}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Truck size={18} />
                    <span>{isProcessing || orderLoading ? "Placing Order..." : "Place Order (Pay on Delivery)"}</span>
                  </button>
                )}

                <Link
                  to="/shop"
                  className="block text-center text-sm text-muted hover:text-main transition-colors font-space uppercase"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

