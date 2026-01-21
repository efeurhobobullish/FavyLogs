import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Package, ArrowLeft, Eye, Calendar, MapPin, CreditCard, Truck, Clock, CheckCircle, XCircle, Package as PackageIcon, RefreshCw, Truck as TruckIcon, CheckCheck } from "lucide-react";
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

  const getOrderStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "Order Received",
          description: "Your order has been placed",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      case "processing":
        return {
          icon: RefreshCw,
          text: "Processing Order",
          description: "Preparing your items",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      case "shipped":
        return {
          icon: TruckIcon,
          text: "Shipped",
          description: "On the way to you",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        };
      case "delivered":
        return {
          icon: CheckCheck,
          text: "Delivered",
          description: "Successfully delivered",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "cancelled":
        return {
          icon: XCircle,
          text: "Cancelled",
          description: "Order was cancelled",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      default:
        return {
          icon: PackageIcon,
          text: "Processing",
          description: "Order in progress",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          text: "Paid",
          description: "Payment successful",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending Payment",
          description: "Awaiting payment",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      case "failed":
        return {
          icon: XCircle,
          text: "Payment Failed",
          description: "Payment unsuccessful",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      default:
        return {
          icon: Clock,
          text: "Processing",
          description: "Payment in progress",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
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
                <option value="pending">Order Received</option>
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
                <option value="pending">Pending Payment</option>
                <option value="completed">Paid</option>
                <option value="failed">Payment Failed</option>
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
                const orderStatus = getOrderStatusConfig(order.status);
                const paymentStatus = getPaymentStatusConfig(order.paymentStatus);
                const OrderStatusIcon = orderStatus.icon;
                const PaymentStatusIcon = paymentStatus.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-secondary p-6 md:p-8 border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      {/* Order Info */}
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
                          <div className="text-right">
                            <p className="text-xl font-bold text-main font-space mb-2">
                              ₦{order.totalPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Status Indicators - Updated like Jumia/Amazon */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          {/* Order Status */}
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${orderStatus.borderColor} ${orderStatus.bgColor}`}>
                            <div className={`p-2 rounded-full ${orderStatus.bgColor}`}>
                              <OrderStatusIcon size={18} className={orderStatus.color} />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold font-space ${orderStatus.color}`}>
                                {orderStatus.text}
                              </p>
                              <p className="text-xs text-muted">
                                {orderStatus.description}
                              </p>
                            </div>
                          </div>

                          {/* Payment Status */}
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${paymentStatus.borderColor} ${paymentStatus.bgColor}`}>
                            <div className={`p-2 rounded-full ${paymentStatus.bgColor}`}>
                              <PaymentStatusIcon size={18} className={paymentStatus.color} />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold font-space ${paymentStatus.color}`}>
                                {paymentStatus.text}
                              </p>
                              <p className="text-xs text-muted">
                                {paymentStatus.description}
                              </p>
                            </div>
                          </div>
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
                      {order.status === "shipped" && (
                        <button className="px-4 py-2 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors">
                          Track Order
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <button className="px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors">
                          Rate Product
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