import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ArrowLeft, Eye } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { useUserOrders, loading } = useOrder();
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const { data: orders = [], isLoading } = useUserOrders(
    status === "all" ? undefined : status
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

  const statusBadge = (s: OrderStatus) => {
    if (s === "completed") return "text-green-600";
    if (s === "failed") return "text-red-500";
    return "text-yellow-600";
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="main">

          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

          {/* Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="mb-5 px-4 py-2 border border-line bg-background text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          {/* Orders */}
          {isLoading || loading ? (
            <p className="text-muted">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-line bg-secondary px-4 py-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-xs text-muted">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ₦{order.totalPrice.toLocaleString()}
                      </p>
                      <p className={`text-xs ${statusBadge(order.status)}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-sm underline"
                    >
                      View
                    </Link>
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