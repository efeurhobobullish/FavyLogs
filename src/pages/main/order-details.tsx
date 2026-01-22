import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ArrowLeft, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { useOrder: useOrderQuery, loading } = useOrder();

  const { data: order, isLoading } = useOrderQuery(id || "");

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
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusIcon = (s: OrderStatus) => {
    if (s === "completed") return <CheckCircle size={18} className="text-green-600" />;
    if (s === "failed") return <XCircle size={18} className="text-red-500" />;
    return <Clock size={18} className="text-yellow-600" />;
  };

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="main py-10">
          <p className="text-muted">Loading order…</p>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="main py-10 text-center">
          <p className="text-muted mb-4">Order not found</p>
          <Link to="/orders" className="underline text-sm">
            Back to orders
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="main max-w-xl">

          {/* Back */}
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-muted mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Header */}
          <div className="border border-line bg-secondary p-5 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusIcon(order.status)}
                <span className="text-sm capitalize">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="border border-line bg-secondary p-5 mb-4">
            <p className="text-xs text-muted mb-1">Product</p>
            <p className="font-medium">{order.productName}</p>
            <p className="text-xs text-muted">{order.category}</p>
          </div>

          {/* Price */}
          <div className="border border-line bg-secondary p-5 mb-4 flex justify-between">
            <span className="text-sm text-muted">Amount Paid</span>
            <span className="font-semibold">
              ₦{order.totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Dates */}
          <div className="border border-line bg-secondary p-5 mb-4">
            <p className="text-xs text-muted mb-1">Date</p>
            <p className="text-sm">{formatDate(order.createdAt)}</p>
          </div>

          {/* Credentials (ONLY WHEN COMPLETED) */}
          {order.status === "completed" && order.credentials && (
            <div className="border border-line bg-secondary p-5">
              <p className="text-xs text-muted mb-2">Account Details</p>

              <div className="text-sm space-y-2">
                <div>
                  <span className="text-muted">Email:</span>{" "}
                  <span className="font-mono">{order.credentials.email}</span>
                </div>
                <div>
                  <span className="text-muted">Password:</span>{" "}
                  <span className="font-mono">{order.credentials.password}</span>
                </div>
              </div>

              <p className="text-xs text-muted mt-3">
                Keep this information safe.
              </p>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}