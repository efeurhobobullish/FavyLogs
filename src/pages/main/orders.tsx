import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
// We only import icons we KNOW you have to prevent crashes
import {
Package,
ArrowLeft,
Eye,
Calendar,
MapPin,
CreditCard,
Truck
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
const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | "all">("all");

const { useUserOrders, loading } = useOrder();
// Safety check: ensure orders defaults to empty array
const { data: orders = [], isLoading } = useUserOrders(
selectedStatus === "all" ? undefined : (selectedStatus as OrderStatus),
selectedPaymentStatus === "all" ? undefined : (selectedPaymentStatus as PaymentStatus)
);

// Define the timeline steps
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

const getPaymentStatusColor = (status: string) => {
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
try {
const date = new Date(dateString);
return date.toLocaleDateString("en-US", {
year: "numeric",
month: "short",
day: "numeric",
});
} catch (e) {
return dateString;
}
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
            // Determine current step index  
            const currentIndex = orderSteps.indexOf(order.status as OrderStatus);  
            const isCancelled = order.status === "cancelled";  

            return (  
              <div  
                key={order.id}  
                className="bg-secondary p-6 md:p-8 border border-line hover:border-main/30 transition-all"  
              >  
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">  
                    
                  {/* --- LEFT SIDE: Order Info --- */}  
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
                        
                      {/* Price and ID Block */}  
                      <div className="text-right">  
                        <p className="text-xl font-bold text-main font-space mb-2">  
                          ₦{order.totalPrice.toLocaleString()}  
                        </p>  
                        <p className="text-sm text-muted uppercase">  
                          #{order.id.slice(-8).toUpperCase()}  
                        </p>  
                      </div>  
                    </div>  

                    {/* Status Badges - Payment Only */}  
                    <div className="flex flex-wrap gap-2 mb-4">  
                      <span  
                        className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getPaymentStatusColor(  
                          order.paymentStatus  
                        )}`}  
                      >  
                        Payment: {order.paymentStatus}  
                      </span>  
                      {/* Only show Cancelled badge if actually cancelled */}  
                      {isCancelled && (  
                        <span className="px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border bg-red-500/10 text-red-600 border-red-500/20">  
                          Cancelled  
                        </span>  
                      )}  
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
                    </div>  
                  </div>  

                  {/* --- RIGHT SIDE: Vertical Timeline --- */}  
                  {/* Using simple Truck/Package icon to ensure no crashes */}  
                  {!isCancelled && (  
                    <div className="flex flex-col items-center justify-center pt-4 md:pt-0 md:pl-8 md:border-l border-line min-w-[80px]">  
                      {orderSteps.map((step, index) => {  
                        const completed = index <= currentIndex;  
                          
                        return (  
                          <div  
                            key={step}  
                            className="flex flex-col items-center text-center relative"  
                          >  
                            {/* Circle Icon */}  
                            <div  
                              className={`w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-colors duration-300  
                                ${  
                                  completed  
                                    ? "bg-green-600 border-green-600 text-white"  
                                    : "bg-background border-line text-muted"  
                                }`}  
                            >  
                              {/* Using Package icon for all steps to prevent crash */}  
                              <Package size={12} strokeWidth={2.5} />  
                            </div>  
                              
                            {/* Text Label */}  
                            <span className={`text-[10px] uppercase font-bold mt-1 mb-1 tracking-wider ${completed ? 'text-green-600' : 'text-muted'}`}>  
                              {step}  
                            </span>  

                            {/* Connecting Line */}  
                            {index !== orderSteps.length - 1 && (  
                              <div  
                                className={`w-0.5 h-6 my-0.5 ${  
                                  index < currentIndex   
                                    ? "bg-green-600"   
                                    : "bg-line"  
                                }`}  
                              />  
                            )}  
                          </div>  
                        );  
                      })}  
                    </div>  
                  )}  

                </div>  

                {/* Actions */}  
                <div className="flex items-center justify-between pt-4 border-t border-line mt-4">  
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