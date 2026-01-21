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
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const statusIndex = (status: OrderStatus) =>
    ["pending", "processing", "shipped", "delivered"].indexOf(status);

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
      <div className="min-h-screen bg-background py-10">
        <div className="main">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 font-space uppercase text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-3xl font-bold text-main uppercase font-space mb-8">
            My Orders
          </h1>

          {isLoading || loading ? (
            <p className="text-center text-muted py-20">Loading orders...</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const current = statusIndex(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-secondary border border-line p-6"
                  >
                    {/* MAIN ROW */}
                    <div className="flex items-start justify-between gap-8">
                      {/* LEFT CONTENT */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold uppercase font-space">
                          {order.name}
                        </h3>

                        <p className="text-sm text-muted uppercase mb-2">
                          {order.category}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted mb-4">
                          <Calendar size={14} />
                          Ordered {formatDate(order.createdAt)}
                        </div>

                        <p className="text-2xl font-bold mb-4">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="uppercase text-xs text-muted flex items-center gap-1">
                              <MapPin size={12} /> Address
                            </p>
                            <p>
                              {order.deliveryAddress.street},{" "}
                              {order.deliveryAddress.city}
                            </p>
                          </div>

                          <div>
                            <p className="uppercase text-xs text-muted flex items-center gap-1">
                              {order.paymentMethod === "paystack" ? (
                                <CreditCard size={12} />
                              ) : (
                                <Truck size={12} />
                              )}
                              Payment
                            </p>
                            <p className="uppercase">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 mt-6 text-main font-space uppercase font-semibold text-sm"
                        >
                          <Eye size={16} /> View Details
                        </Link>
                      </div>

                      {/* RIGHT DELIVERY TIMELINE */}
                      <div className="flex flex-col items-center">
                        {[
                          { label: "Pending", icon: Clock },
                          { label: "Processing", icon: Package },
                          { label: "Shipped", icon: Truck },
                          { label: "Delivered", icon: Check },
                        ].map((step, index) => {
                          const done = index < current;
                          const active = index === current;

                          return (
                            <div
                              key={step.label}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`w-10 h-10 rounded-full border flex items-center justify-center
                                ${
                                  done
                                    ? "bg-green-500 border-green-500 text-white"
                                    : active
                                    ? "bg-main border-main text-background"
                                    : "bg-background border-line text-muted"
                                }`}
                              >
                                <step.icon size={18} />
                              </div>

                              {index !== 3 && (
                                <div
                                  className={`w-px h-10 ${
                                    done ? "bg-green-500" : "bg-line"
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