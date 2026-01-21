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
import { OrderTimeline } from "@/components/main";

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
            <p className="text-muted text-center py-20">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-muted mb-6" />
              <p className="text-muted">No orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-secondary border border-line p-6 hover:border-main/30 transition-all"
                >
                  <div className="flex justify-between gap-6">
                    {/* LEFT CONTENT */}
                    <div className="flex-1">
                      <h3 className="text-xl font-space font-bold text-main uppercase">
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
                          <p className="text-xs text-muted uppercase flex items-center gap-1">
                            <MapPin size={12} /> Address
                          </p>
                          <p>
                            {order.deliveryAddress.street},{" "}
                            {order.deliveryAddress.city}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted uppercase flex items-center gap-1">
                            {order.paymentMethod === "paystack" ? (
                              <CreditCard size={12} />
                            ) : (
                              <Truck size={12} />
                            )}
                            Payment
                          </p>
                          <p className="uppercase">{order.paymentMethod}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-6">
                        <Link
                          to={`/orders/${order.id}`}
                          className="flex items-center gap-2 text-main uppercase font-space font-semibold text-sm"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* RIGHT TIMELINE */}
                    <OrderTimeline status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}