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

  // ✅ FILTER STATE (USED – NO TS ERROR)
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

          {/* ✅ FILTERS (THIS IS WHAT PREVENTS TS6133) */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-xs uppercase text-muted mb-1">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus | "all")
                }
                className="px-3 py-2 border border-line bg-background text-sm"
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
              <label className="block text-xs uppercase text-muted mb-1">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) =>
                  setSelectedPaymentStatus(
                    e.target.value as PaymentStatus | "all"
                  )
                }
                className="px-3 py-2 border border-line bg-background text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Orders */}
          {isLoading || loading ? (
            <p className="text-center text-muted py-16">
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
                    className="bg-secondary p-6 border border-line"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* LEFT */}
                      <div className="flex-1">
                        <h3 className="font-space uppercase font-semibold text-main">
                          {order.name}
                        </h3>

                        <p className="text-xs uppercase text-muted mb-2">
                          {order.category}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted mb-3">
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </div>

                        <p className="text-xl font-bold text-main mb-4">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 text-sm uppercase font-space font-semibold"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>
                      </div>

                      {/* RIGHT – DELIVERY TIMELINE */}
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