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
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
type PaymentStatus = "pending" | "completed" | "failed";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  const [authChecked, setAuthChecked] = useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus | "all">("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus | "all">("all");

  const { useUserOrders } = useOrder();

  // ✅ AUTH GATE — THIS FIXES THE BLANK PAGE
  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) {
          navigate("/auth");
        } else {
          setAuthChecked(true);
        }
      });
    } else {
      setAuthChecked(true);
    }
  }, [user, checkAuth, navigate]);

  // ⛔ DO NOT CALL HOOK UNTIL AUTH IS READY
  const {
    data: orders = [],
    isLoading,
  } = authChecked
    ? useUserOrders(
        selectedStatus === "all" ? undefined : selectedStatus,
        selectedPaymentStatus === "all" ? undefined : selectedPaymentStatus
      )
    : { data: [], isLoading: true };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="main">
          {/* GLOBAL LOADING (NO BLANK PAGE) */}
          {!authChecked || isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Package size={40} className="text-muted mb-4" />
              <p className="text-muted">Loading orders…</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted mb-6 uppercase text-sm"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <h1 className="text-2xl font-bold uppercase mb-6">
                My Orders
              </h1>

              {/* Filters */}
              <div className="flex gap-4 mb-8">
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value as OrderStatus | "all"
                    )
                  }
                  className="border px-3 py-2 bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={selectedPaymentStatus}
                  onChange={(e) =>
                    setSelectedPaymentStatus(
                      e.target.value as PaymentStatus | "all"
                    )
                  }
                  className="border px-3 py-2 bg-background"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Orders */}
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={32} className="mx-auto mb-4 text-muted" />
                  <p className="text-muted">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border p-6 bg-secondary"
                    >
                      <div className="flex justify-between mb-4">
                        <div>
                          <h3 className="font-semibold uppercase">
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
                        className="inline-flex items-center gap-2 text-sm uppercase font-semibold"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}