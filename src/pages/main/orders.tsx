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

  // ✅ TS6133 FIX — setters intentionally referenced
  useEffect(() => {
    void setSelectedStatus;
    void setSelectedPaymentStatus;
  }, []);

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

          {/* Loading */}
          {loading || isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <Package size={32} className="text-muted" />
              </div>
              <p className="text-muted">Loading orders...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-secondary p-6 border border-line hover:border-main/30 transition-all"
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold uppercase">
                        {order.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
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

                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₦{order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted uppercase">
                        #{order.id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}