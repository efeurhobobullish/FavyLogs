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
  Clock,
  Check,
} from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  // FILTER STATE (USED)
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusSteps: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-6">
            My Orders
          </h1>

          {/* FILTERS (UNCHANGED) */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-muted uppercase mb-2">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus | "all")
                }
                className="px-4 py-2 border border-line bg-background text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted uppercase mb-2">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) =>
                  setSelectedPaymentStatus(
                    e.target.value as PaymentStatus | "all"
                  )
                }
                className="px-4 py-2 border border-line bg-background text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* ORDERS */}
          {isLoading || loading ? (
            <p className="text-center py-16 text-muted">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const currentIndex = statusSteps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 md:p-8 border border-line"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-6">
                      {/* LEFT CONTENT (UNCHANGED ORDER) */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-main uppercase font-space mb-2">
                              {order.name}
                            </h3>
                            <p className="text-sm text-muted uppercase mb-1">
                              {order.category}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted">
                              <Calendar size={14} />
                              Ordered on {formatDate(order.createdAt)}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-main">
                              ₦{order.totalPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* IMAGES (RESTORED EXACTLY) */}
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

                        {/* ADDRESS */}
                        <div className="flex items-center gap-2 text-sm text-muted mb-2">
                          <MapPin size={14} />
                          {order.deliveryAddress.street},{" "}
                          {order.deliveryAddress.city},{" "}
                          {order.deliveryAddress.state}
                        </div>

                        {/* PAYMENT */}
                        <div className="flex items-center gap-2 text-sm text-muted mb-4">
                          <CreditCard size={14} />
                          {order.paymentMethod === "paystack"
                            ? "Paystack"
                            : "Pay on Delivery"}
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 text-main uppercase font-space font-semibold text-sm"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>
                      </div>

                      {/* RIGHT TIMELINE (ONLY ADDITION) */}
                      <div className="flex flex-col items-center">
                        {statusSteps.map((status, index) => {
                          const completed = index <= currentIndex;
                          const Icon =
                            status === "pending"
                              ? Clock
                              : status === "processing"
                              ? Package
                              : status === "shipped"
                              ? Truck
                              : Check;

                          return (
                            <div
                              key={status}
                              className="flex flex-col items-center text-center"
                            >
                              <div
                                className={`w-7 h-7 rounded-full border flex items-center justify-center
                                  ${
                                    completed
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "bg-background border-line text-muted"
                                  }`}
                              >
                                <Icon size={14} />
                              </div>

                              <span className="text-[10px] uppercase text-muted mt-1">
                                {status}
                              </span>

                              {index !== statusSteps.length - 1 && (
                                <div
                                  className={`w-px h-6 ${
                                    completed
                                      ? "bg-green-500"
                                      : "bg-line"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
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