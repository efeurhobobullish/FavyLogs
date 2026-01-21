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
import { useEffect } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  const { useUserOrders, loading } = useOrder();
  const { data: orders = [], isLoading } = useUserOrders();

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
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-3xl font-bold text-main uppercase font-space mb-8">
            My Orders
          </h1>

          {/* Orders */}
          {isLoading || loading ? (
            <p className="text-center text-muted py-20">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-muted mb-6" />
              <p className="text-muted">No orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const current = statusIndex(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-secondary border border-line p-6 hover:border-main/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-8">
                      {/* LEFT CONTENT */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold uppercase font-space text-main">
                          {order.name}
                        </h3>

                        <p className="text-sm text-muted uppercase mb-2">
                          {order.category}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted mb-4">
                          <Calendar size={14} />
                          Ordered on {formatDate(order.createdAt)}
                        </div>

                        <p className="text-2xl font-bold text-main mb-4">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="uppercase text-xs text-muted flex items-center gap-1">
                              <MapPin size={12} />
                              Delivery Address
                            </p>
                            <p className="text-main">
                              {order.deliveryAddress.street},{" "}
                              {order.deliveryAddress.city},{" "}
                              {order.deliveryAddress.state}
                            </p>
                          </div>

                          <div>
                            <p className="uppercase text-xs text-muted flex items-center gap-1">
                              {order.paymentMethod === "paystack" ? (
                                <CreditCard size={12} />
                              ) : (
                                <Truck size={12} />
                              )}
                              Payment Method
                            </p>
                            <p className="text-main uppercase">
                              {order.paymentMethod === "paystack"
                                ? "Paystack"
                                : "Pay on Delivery"}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 mt-6 text-main font-space uppercase font-semibold text-sm hover:text-main/80"
                        >
                          <Eye size={16} />
                          View Details
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
                          const completed = index < current;
                          const active = index === current;

                          return (
                            <div
                              key={step.label}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all
                                  ${
                                    completed
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