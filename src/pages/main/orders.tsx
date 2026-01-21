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

  // ✅ USED
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

  // ✅ USED BELOW
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

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

          {/* ✅ FILTERS (USES SETTERS) */}
          <div className="flex gap-4 mb-6">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as OrderStatus | "all")
              }
              className="border px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            <select
              value={selectedPaymentStatus}
              onChange={(e) =>
                setSelectedPaymentStatus(e.target.value as PaymentStatus | "all")
              }
              className="border px-3 py-2"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Orders */}
          {orders.map((order) => {
            const currentIndex = orderSteps.indexOf(order.status);

            return (
              <div key={order.id} className="bg-secondary p-6 border mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{order.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Calendar size={14} />
                      {formatDate(order.createdAt)}
                    </div>

                    {/* ✅ USE MapPin */}
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <MapPin size={14} />
                      {order.deliveryAddress.city}
                    </div>

                    {/* ✅ USE CreditCard / Truck */}
                    <div className="flex items-center gap-2 text-sm">
                      {order.paymentMethod === "paystack" ? (
                        <CreditCard size={14} />
                      ) : (
                        <Truck size={14} />
                      )}
                      {order.paymentMethod}
                    </div>

                    {/* ✅ USE getPaymentStatusColor */}
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs border ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  {/* TIMELINE (UNCHANGED) */}
                  <div className="flex items-center gap-2">
                    {orderSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index <= currentIndex ? "bg-green-600" : "bg-line"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm"
                >
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}