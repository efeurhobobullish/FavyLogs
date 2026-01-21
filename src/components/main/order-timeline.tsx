import { Clock, Package, Truck, Check } from "lucide-react";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const steps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
];

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center ml-6">
        <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
          ✕
        </div>
        <p className="text-xs text-red-500 mt-2 font-space uppercase">
          Cancelled
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center ml-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="flex flex-col items-center">
            {/* Circle */}
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border transition-all
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-main border-main text-background"
                    : "bg-background border-line text-muted"
                }
              `}
              title={step.label}
            >
              <step.icon size={18} />
            </div>

            {/* Line */}
            {index !== steps.length - 1 && (
              <div
                className={`w-px h-10 ${
                  isCompleted ? "bg-green-500" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}