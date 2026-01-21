import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import {
  Package,
  ArrowLeft,
  Eye,
  Calendar,
  MapPin,
  CreditCard,
  Truck
} from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";

// Types
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

  const getPaymentStatusColor = (status: string) => {
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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading...</p>
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
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
              My Orders
            </h1>
            <p className="text-muted text-sm md:text-base">
              View and track all your orders
            </p>
          </div>

          {/* Orders List */}
          {isLoading || loading ? (
            <div className="text-center py-16">
              <p className="text-muted">Loading orders...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const currentIndex = orderSteps.indexOf(order.status);
                const isCancelled = order.status === "cancelled";

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 md:p-8 border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                          {order.name}
                        </h3>
                        <p className="text-sm text-muted uppercase mb-1">
                          {order.category}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted mt-2">
                          <Calendar size={14} />
                          <span>Ordered on {formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* PRICE + ID + TIMELINE */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-main font-space mb-1">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted uppercase mb-2">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>

                        {/* ✅ TIMELINE UNDER ID */}
                        {!isCancelled && (
                          <div className="flex flex-col items-end">
                            {orderSteps.map((step, index) => {
                              const completed = index <= currentIndex;
                              return (
                                <div key={step} className="flex items-center gap-2">
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
                                    className={`text-[10px] uppercase font-bold ${
                                      completed ? "text-green-600" : "text-muted"
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-line mt-4">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-main font-space font-semibold uppercase text-sm hover:text-main/80 transition-colors"
                      >
                        <Eye size={18} />
                        <span>View Details</span>
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