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
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted mb-6 uppercase text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* ✅ USE loading & isLoading HERE */}
          {loading || isLoading ? (
            <div className="text-center py-16">
              {/* ✅ USE Package ICON HERE */}
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <Package size={32} className="text-muted" />
              </div>
              <p className="text-muted">Loading orders...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const currentIndex = orderSteps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 border border-line"
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{order.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </div>

                        <div className="flex items-center gap-2 text-sm mt-2">
                          <MapPin size={14} />
                          {order.deliveryAddress.city}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {order.paymentMethod === "paystack" ? (
                            <CreditCard size={14} />
                          ) : (
                            <Truck size={14} />
                          )}
                          {order.paymentMethod}
                        </div>
                      </div>

                      {/* Timeline (unchanged) */}
                      <div className="flex items-center gap-2">
                        {orderSteps.map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              index <= currentIndex
                                ? "bg-green-600"
                                : "bg-line"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-2 text-sm"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
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
