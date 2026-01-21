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
  Clock,       // Icon for Pending
  CheckCircle, // Icon for Delivered
  XCircle,     // Icon for Cancelled
  RefreshCw,   // Icon for Processing
  AlertCircle  // Icon for Failed/Issues
} from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";

// Define types locally to avoid TS errors if they aren't global
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "completed" | "failed";

export default function Orders() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | "all">("all");
  
  const { useUserOrders, loading } = useOrder();
  
  const { data: orders = [], isLoading } = useUserOrders(
    selectedStatus === "all" ? undefined : (selectedStatus as OrderStatus),
    selectedPaymentStatus === "all" ? undefined : (selectedPaymentStatus as PaymentStatus)
  );

  // Check auth on mount
  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) {
          navigate("/auth");
        }
      });
    }
  }, [user, checkAuth, navigate]);

  // JUMIA STYLE: Helper to get Icon and specific color styles
  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          label: "Order Placed",
          // Jumia uses Orange/Yellow for pending
          className: "text-orange-600 bg-orange-50 border-orange-200"
        };
      case "processing":
        return {
          icon: RefreshCw,
          label: "Processing",
          // Blue for processing
          className: "text-blue-600 bg-blue-50 border-blue-200"
        };
      case "shipped":
        return {
          icon: Truck,
          label: "Out for Delivery",
          // Purple or Dark Blue for shipping
          className: "text-purple-600 bg-purple-50 border-purple-200"
        };
      case "delivered":
        return {
          icon: CheckCircle,
          label: "Delivered",
          // Green for success
          className: "text-green-600 bg-green-50 border-green-200"
        };
      case "cancelled":
        return {
          icon: XCircle,
          label: "Cancelled",
          // Red for cancelled
          className: "text-red-600 bg-red-50 border-red-200"
        };
      default:
        return {
          icon: Package,
          label: status,
          className: "text-gray-600 bg-gray-50 border-gray-200"
        };
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
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
              My Orders
            </h1>
            <p className="text-muted text-sm md:text-base">
              View and track all your orders
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-muted font-space uppercase mb-2">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | "all")}
                className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted font-space uppercase mb-2">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value as PaymentStatus | "all")}
                className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {isLoading || loading ? (
            <div className="text-center py-16">
              <p className="text-muted">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <Package size={48} className="text-muted" />
              </div>
              <h2 className="text-2xl font-bold text-main uppercase font-space mb-4">
                No Orders Found
              </h2>
              <p className="text-muted mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
              >
                <Package size={18} />
                <span>Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                // Determine styling based on status
                const statusDetails = getStatusDetails(order.status as OrderStatus);
                const StatusIcon = statusDetails.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 md:p-8 border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      
                      {/* LEFT SIDE: Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                              {order.name}
                            </h3>
                            <p className="text-sm text-muted font-space uppercase mb-1">
                              {order.category}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted mt-2">
                              <Calendar size={14} />
                              <span>Ordered on {formatDate(order.createdAt)}</span>
                            </div>
                          </div>
                          
                          {/* RIGHT SIDE: Price, ID, and NOW Status underneath */}
                          <div className="text-right flex flex-col items-end">
                            {/* 1. Price */}
                            <p className="text-xl font-bold text-main font-space">
                              ₦{order.totalPrice.toLocaleString()}
                            </p>
                            
                            {/* 2. Order ID */}
                            <p className="text-xs text-muted uppercase mb-3">
                              #{order.id.slice(-8).toUpperCase()}
                            </p>

                            {/* 3. NEW STATUS INDICATOR (Below Price) */}
                            <div className={`
                              flex items-center gap-2 px-3 py-1.5 rounded-md border 
                              ${statusDetails.className}
                            `}>
                              <StatusIcon size={14} className="stroke-[2.5]" />
                              <span className="text-xs font-space font-bold uppercase tracking-wide">
                                {statusDetails.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges (Payment Only - Left side) */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getPaymentStatusColor(
                              order.paymentStatus as PaymentStatus
                            )}`}
                          >
                            Payment: {order.paymentStatus}
                          </span>
                        </div>

                        {/* Product Images */}
                        {order.images && order.images.length > 0 && (
                          <div className="flex gap-2 mb-4">
                            {order.images.slice(0, 3).map((image, index) => (
                              <div
                                key={index}
                                className="w-16 h-16 bg-background overflow-hidden border border-line relative"
                              >
                                <img
                                  src={image}
                                  alt={`${order.name} - Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.images.length > 3 && (
                              <div className="w-16 h-16 bg-background border border-line flex items-center justify-center">
                                <span className="text-xs text-muted font-space">
                                  +{order.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted font-space uppercase text-xs mb-1 flex items-center gap-2">
                              <MapPin size={14} />
                              Delivery Address
                            </p>
                            <p className="text-main">
                              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted font-space uppercase text-xs mb-1 flex items-center gap-2">
                              {order.paymentMethod === "paystack" ? (
                                <CreditCard size={14} />
                              ) : (
                                <Truck size={14} />
                              )}
                              Payment Method
                            </p>
                            <p className="text-main font-space uppercase">
                              {order.paymentMethod === "paystack" ? "Paystack" : "Pay on Delivery"}
                            </p>
                          </div>
                          {order.sizes && (
                            <div>
                              <p className="text-muted font-space uppercase text-xs mb-1">Size</p>
                              <p className="text-main">{order.sizes}</p>
                            </div>
                          )}
                          {order.colors && (
                            <div>
                              <p className="text-muted font-space uppercase text-xs mb-1">Color</p>
                              <p className="text-main">{order.colors}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-main font-space font-semibold uppercase text-sm hover:text-main/80 transition-colors"
                      >
                        <Eye size={18} />
                        <span>View Details</span>
                      </Link>
                      {order.status === "pending" && order.paymentStatus === "pending" && (
                        <button className="px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors">
                          Cancel Order
                        </button>
                      )}
                    </div>
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
