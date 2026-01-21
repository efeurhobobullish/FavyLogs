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
            className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-8">
            My Orders
          </h1>

          {/* Orders List */}
          {isLoading || loading ? (
            <div className="text-center py-16">
              <p className="text-muted">Loading orders...</p>
            </div>
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
                    className="bg-secondary p-6 border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* LEFT CONTENT (UNCHANGED) */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-main uppercase font-space">
                          {order.name}
                        </h3>

                        <p className="text-sm text-muted uppercase mb-2">
                          {order.category}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted mb-3">
                          <Calendar size={14} />
                          Ordered on {formatDate(order.createdAt)}
                        </div>

                        <p className="text-xl font-bold text-main mb-4">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs uppercase text-muted flex items-center gap-1">
                              <MapPin size={12} /> Address
                            </p>
                            <p className="text-main">
                              {order.deliveryAddress.street},{" "}
                              {order.deliveryAddress.city}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-muted flex items-center gap-1">
                              {order.paymentMethod === "paystack" ? (
                                <CreditCard size={12} />
                              ) : (
                                <Truck size={12} />
                              )}
                              Payment
                            </p>
                            <p className="uppercase text-main">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 mt-4 text-main uppercase font-space font-semibold text-sm"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>
                      </div>

                      {/* RIGHT DELIVERY TIMELINE (FIXED & SMALLER) */}
                      <div className="flex flex-col items-center">
                        {statusSteps.map((status, index) => {
                          const completed = index <= currentIndex;
                          const active =
                            index === currentIndex &&
                            order.status !== "delivered";

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
                                      : active
                                      ? "bg-main border-main text-background"
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