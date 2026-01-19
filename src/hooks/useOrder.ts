import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/config/api";
import { useState } from "react";
import { toast } from "sonner";
import useAuth from "./useAuth";

interface CreateOrderData {
  name: string;
  deliveryNote?: string;
  price: number;
  images: string[];
  category: string;
  sizes?: string;
  colors?: string;
  totalPrice: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
  };
  paymentMethod?: "paystack" | "delivery";
  paymentStatus?: "pending" | "completed" | "failed";
}

interface OrderResponse {
  success: boolean;
  message: string;
  order?: IOrder;
  orders?: IOrder[];
  count?: number;
}

export default function useOrder() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Initialize Paystack payment
  const initializePayment = async (
    amount: number,
    email: string,
    onSuccess: (reference: string) => void
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const PaystackPop = (window as { PaystackPop?: { setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void } } }).PaystackPop;
      
      if (!PaystackPop) {
        toast.error("Paystack is not loaded. Please refresh the page.");
        resolve(false);
        return;
      }

      const handler = PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount * 100, // Amount in kobo
        currency: "NGN",
        ref: `DRI-${Date.now()}`,
        callback: function (response: { reference: string }) {
          onSuccess(response.reference);
          resolve(true);
        },
        onClose: function () {
          toast.error("Payment cancelled");
          resolve(false);
        },
      });
      handler.openIframe();
    });
  };

  // Create order
  const createOrder = async (orderData: CreateOrderData): Promise<IOrder | undefined> => {
    setLoading(true);
    try {
      const response = await api.post<OrderResponse>("/v1/orders", orderData);

      if (response.data.success && response.data.order) {
        toast.success("Order created successfully");
        // Invalidate orders query to refetch
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        return response.data.order;
      }
      throw new Error("Failed to create order");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create order";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create order with payment
  const createOrderWithPayment = async (
    orderData: CreateOrderData,
    paymentMethod: "paystack" | "delivery"
  ): Promise<IOrder | undefined> => {
    try {
      // If payment method is delivery, create order directly with pending payment status
      if (paymentMethod === "delivery") {
        const order = await createOrder({
          ...orderData,
          paymentMethod: "delivery",
          paymentStatus: "pending",
        });
        return order;
      }

      // If payment method is paystack, initialize payment first
      if (paymentMethod === "paystack" && user?.email) {
        const paymentSuccess = await initializePayment(
          orderData.totalPrice,
          user.email,
          async () => {
            // Create order after successful payment with completed payment status
            try {
              await createOrder({
                ...orderData,
                paymentMethod: "paystack",
                paymentStatus: "completed", // Payment was successful, so mark as completed
              });
              toast.success("Payment successful! Order created.");
            } catch (error) {
              console.error("Error creating order after payment:", error);
              toast.error("Payment successful but failed to create order. Please contact support.");
            }
          }
        );

        if (!paymentSuccess) {
          throw new Error("Payment was cancelled or failed");
        }
      }
    } catch (error) {
      console.error("Create order with payment error:", error);
      throw error;
    }
  };

  // Get user orders
  const getUserOrders = async (status?: OrderStatus, paymentStatus?: PaymentStatus): Promise<IOrder[]> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);

      const response = await api.get<OrderResponse>(
        `/v1/orders/my-orders${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (response.data.success) {
        return response.data.orders || [];
      }
      return [];
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch orders";
      toast.error(errorMessage);
      return [];
    }
  };

  // Get single order by ID
  const getOrderById = async (orderId: string): Promise<IOrder> => {
    try {
      const response = await api.get<OrderResponse>(`/v1/orders/${orderId}`);

      if (response.data.success && response.data.order) {
        return response.data.order;
      }
      throw new Error("Order not found");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch order";
      toast.error(errorMessage);
      throw error;
    }
  };

  // React Query hooks for fetching orders
  const useUserOrders = (status?: OrderStatus, paymentStatus?: PaymentStatus) => {
    return useQuery({
      queryKey: ["orders", "user", status, paymentStatus],
      queryFn: () => getUserOrders(status, paymentStatus),
      enabled: !!user, // Only fetch if user is logged in
    });
  };

  const useOrder = (orderId: string) => {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderById(orderId),
      enabled: !!orderId && !!user, // Only fetch if orderId and user exist
    });
  };

  return {
    createOrder,
    createOrderWithPayment,
    initializePayment,
    getUserOrders,
    getOrderById,
    useUserOrders,
    useOrder,
    loading,
  };
}
