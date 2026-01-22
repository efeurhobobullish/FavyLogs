import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ArrowLeft, Eye, CreditCard, Clock } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { useUserOrders, loading } = useOrder();

  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const { data: orders = [], isLoading } = useUserOrders(
    statusFilter === "all" ? undefined : statusFilter
  );

  useEffect(() => {
    if (!user) {
      checkAuth().then((u) => !u && navigate("/auth"));
    }
  }, [user, checkAuth, navigate]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusLabel = (s: OrderStatus) => {
    switch (s) {
      case "awaiting_payment":
        return "Awaiting Payment";
      case "paid":
        return "Payment Received";
      case "account_assigned":
        return "Account Assigned";
      case "credentials_available":
        return "Login Details Ready";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return s;
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="main">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted mb-6 text-sm font-space uppercase"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className="text-2xl font-bold font-space mb-1">My Orders</h1>
          <p className="text-muted text-sm mb-6">
            View your purchased accounts and login details
          </p>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="mb-6 px-4 py-2 border border-line bg-background text-sm"
          >
            <option value="all">All Orders</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="paid">Paid</option>
            <option value="account_assigned">Account Assigned</option>
            <option value="credentials_available">Credentials Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Orders */}
          {isLoading || loading ? (
            <p className="text-muted">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-muted">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-line bg-secondary p-5"
                >
                  <div className="flex justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold">{order.productName}</h3>
                      <p className="text-xs text-muted">{order.category}</p>
                      <p className="text-xs text-muted">
                        Ordered {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">
                        ₦{order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 text-xs border border-line">
                      {statusLabel(order.status)}
                    </span>
                    <span className="px-3 py-1 text-xs border border-line flex items-center gap-1">
                      <CreditCard size={12} />
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-line pt-3">
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-2 text-sm font-space"
                    >
                      <Eye size={16} /> View Details
                    </Link>

                    {order.status === "credentials_available" && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Clock size={12} />
                        Login ready
                      </span>
                    )}
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