import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ArrowLeft, Package, Calendar, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { useOrder: useOrderQuery, loading } = useOrder();

  const { data: order, isLoading, error } = useOrderQuery(id || "");

  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) {
          navigate("/auth");
        }
      });
    }
  }, [user, checkAuth, navigate]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={20} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading order details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main text-center py-16">
            <h1 className="text-2xl font-bold text-main mb-4">Order Not Found</h1>
            <Link
              to="/orders"
              className="inline-block px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main max-w-4xl">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Orders</span>
          </button>

          {/* Order Header */}
          <div className="bg-secondary p-6 md:p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
                  Order Details
                </h1>
                <p className="text-sm text-muted font-space uppercase">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-main font-space mb-2">
                  ₦{order.totalPrice.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                Payment: {order.paymentStatus}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border bg-background text-main">
                {order.paymentMethod !== "paystack" ? "Paystack" : "Cash on Delivery"}
              </span>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar size={18} className="text-muted mt-0.5" />
                <div>
                  <p className="text-muted font-space uppercase text-xs mb-1">Order Date</p>
                  <p className="text-main">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="flex items-start gap-2">
                  <Calendar size={18} className="text-muted mt-0.5" />
                  <div>
                    <p className="text-muted font-space uppercase text-xs mb-1">Last Updated</p>
                    <p className="text-main">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-secondary p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-main uppercase font-space mb-4 flex items-center gap-2">
              <Package size={20} />
              Product Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted font-space uppercase mb-1">Product Name</p>
                <p className="text-lg font-semibold text-main">{order.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted font-space uppercase mb-1">Category</p>
                <p className="text-main">{order.category}</p>
              </div>
              {(order.sizes || order.colors) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.sizes && (
                    <div>
                      <p className="text-sm text-muted font-space uppercase mb-1">Size</p>
                      <p className="text-main">{order.sizes}</p>
                    </div>
                  )}
                  {order.colors && (
                    <div>
                      <p className="text-sm text-muted font-space uppercase mb-1">Color</p>
                      <p className="text-main">{order.colors}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm text-muted font-space uppercase mb-1">Price</p>
                <p className="text-lg font-bold text-main font-space">₦{order.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Product Images */}
            {order.images && order.images.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted font-space uppercase mb-3">Product Images</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {order.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-background overflow-hidden border border-line"
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${image}')` }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-muted text-xs font-space uppercase text-center">
                            {order.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Information */}
          <div className="bg-secondary p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-main uppercase font-space mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Delivery Address
            </h2>
            <div className="space-y-2">
              <p className="text-main">
                {order.deliveryAddress.street}
              </p>
              <p className="text-main">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
            </div>
          </div>

          {/* Delivery Note */}
          {order.deliveryNote && (
            <div className="bg-secondary p-6 md:p-8 mb-6">
              <h2 className="text-xl font-semibold text-main uppercase font-space mb-4">
                Delivery Note
              </h2>
              <p className="text-main">{order.deliveryNote}</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-secondary p-6 md:p-8">
            <h2 className="text-xl font-semibold text-main uppercase font-space mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-main font-semibold">₦{order.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-main font-semibold">
                  ₦{(order.totalPrice - order.price).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-line pt-3 flex justify-between">
                <span className="text-lg font-semibold text-main uppercase font-space">Total</span>
                <span className="text-2xl font-bold text-main font-space">
                  ₦{order.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

