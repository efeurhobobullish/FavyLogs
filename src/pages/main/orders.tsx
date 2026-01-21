import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import {
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

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus | "all">("all");

  const { useUserOrders, loading } = useOrder();
  const { data: orders = [], isLoading } = useUserOrders(
    selectedStatus === "all" ? undefined : selectedStatus,
    selectedPaymentStatus === "all" ? undefined : selectedPaymentStatus
  );

  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) navigate("/auth");
      });
    }
  }, [user, checkAuth, navigate]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

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

  // ✅ ADDED (does not conflict with anything)
  const orderSteps: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

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

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-muted font-space uppercase mb-2">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus | "all")
                }
                className="px-4 py-2 border border-line bg-background text-main font-space text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted font-space uppercase mb-2">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) =>
                  setSelectedPaymentStatus(
                    e.target.value as PaymentStatus | "all"
                  )
                }
                className="px-4 py-2 border border-line bg-background text-main font-space text-sm"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Orders */}
          {isLoading || loading ? (
            <div className="text-center py-16">
              <p className="text-muted">Loading orders...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const currentIndex = orderSteps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 md:p-8 border border-line"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                      {/* ORIGINAL ORDER INFO (UNCHANGED) */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-main uppercase font-space mb-2">
                              {order.name}
                            </h3>
                            <p className="text-sm text-muted uppercase mb-1">
                              {order.category}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted mt-2">
                              <Calendar size={14} />
                              Ordered on {formatDate(order.createdAt)}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-main mb-2">
                              ₦{order.totalPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs uppercase border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs uppercase border ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            Payment: {order.paymentStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                              <CreditCard size={14} />
                              Payment Method
                            </p>
                            <p className="uppercase">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ✅ ADDED TIMELINE (NO CONFLICT) */}
                      <div className="flex flex-col items-center">
                        {orderSteps.map((step, index) => {
                          const completed = index <= currentIndex;
                          return (
                            <div key={step} className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                  completed
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-background border-line text-muted"
                                }`}
                              >
                                <Truck size={12} />
                              </div>
                              <span className="text-[10px] uppercase text-muted mt-1">
                                {step}
                              </span>
                              {index !== orderSteps.length - 1 && (
                                <div
                                  className={`w-px h-6 ${
                                    completed ? "bg-green-500" : "bg-line"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-line">
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