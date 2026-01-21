import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import {
  Package,
  ArrowLeft,
  Eye,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "completed" | "failed";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus | "all">("all");

  const { useUserOrders, loading } = useOrder();
  const { data: orders = [], isLoading } = useUserOrders(
    selectedStatus === "all" ? undefined : selectedStatus,
    selectedPaymentStatus === "all" ? undefined : selectedPaymentStatus
  );

  const orderSteps: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) navigate("/auth");
      });
    }
  }, [user, checkAuth, navigate]);

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8">
          <div className="main">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="main">
          {isLoading || loading ? (
            <p className="text-center py-16 text-muted">Loading orders...</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const currentIndex = orderSteps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 border border-line"
                  >
                    {/* HEADER */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold uppercase">
                          {order.name}
                        </h3>
                        <p className="text-sm text-muted uppercase">
                          {order.category}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted mt-2">
                          <Calendar size={14} />
                          Ordered on {formatDate(order.createdAt)}
                        </div>
                      </div>

                      {/* PRICE + ID + TIMELINE */}
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted uppercase mb-2">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>

                        {/* CONNECTED TIMELINE */}
                        {order.status !== "cancelled" && (
                          <div className="flex flex-col items-end">
                            {orderSteps.map((step, index) => {
                              const completed = index <= currentIndex;

                              return (
                                <div key={step} className="flex flex-col items-center">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center
                                      ${
                                        completed
                                          ? "bg-green-600 border-green-600 text-white"
                                          : "bg-background border-line text-muted"
                                      }`}
                                  >
                                    <Package size={10} />
                                  </div>

                                  <span
                                    className={`text-[10px] uppercase font-bold mt-1 ${
                                      completed ? "text-green-600" : "text-muted"
                                    }`}
                                  >
                                    {step}
                                  </span>

                                  {index !== orderSteps.length - 1 && (
                                    <div
                                      className={`w-px h-5 my-1 ${
                                        completed ? "bg-green-600" : "bg-line"
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PAYMENT BADGE */}
                    <div className="mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs uppercase border ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                    </div>

                    {/* ✅ PRODUCT IMAGES — RESTORED */}
                    {order.images && order.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {order.images.slice(0, 3).map((image, index) => (
                          <div
                            key={index}
                            className="w-16 h-16 bg-background overflow-hidden border border-line"
                          >
                            <img
                              src={image}
                              alt={order.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.images.length > 3 && (
                          <div className="w-16 h-16 border border-line flex items-center justify-center">
                            <span className="text-xs text-muted">
                              +{order.images.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ADDRESS + PAYMENT METHOD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs uppercase text-muted flex items-center gap-2">
                          <MapPin size={14} />
                          Delivery Address
                        </p>
                        <p>
                          {order.deliveryAddress.street},{" "}
                          {order.deliveryAddress.city},{" "}
                          {order.deliveryAddress.state}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-muted flex items-center gap-2">
                          {order.paymentMethod === "paystack" ? (
                            <CreditCard size={14} />
                          ) : (
                            <Truck size={14} />
                          )}
                          Payment Method
                        </p>
                        <p className="uppercase">
                          {order.paymentMethod === "paystack"
                            ? "Paystack"
                            : "Pay on Delivery"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="pt-4 border-t border-line flex justify-between">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-2 uppercase text-sm font-semibold"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}