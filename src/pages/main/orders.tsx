import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Package, ArrowLeft, Eye, Calendar, MapPin, CreditCard, Truck } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | "all">("all");

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
        <div className="main py-10">
          <p className="text-muted">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="main">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted mb-6 text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-2xl font-bold text-main mb-2">My Orders</h1>
          <p className="text-muted mb-6">View and track all your orders</p>

          {isLoading || loading ? (
            <p className="text-muted">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted">No orders found</p>
              <Link to="/shop" className="underline text-sm">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-secondary border border-line p-5"
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-semibold">{order.name}</p>
                      <p className="text-xs text-muted">{order.category}</p>
                    </div>
                    <p className="font-bold">
                      ₦{order.totalPrice.toLocaleString()}
                    </p>
                  </div>

                  <p className="text-xs text-muted flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(order.createdAt)}
                  </p>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 mt-3 text-sm underline"
                  >
                    <Eye size={16} /> View Details
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