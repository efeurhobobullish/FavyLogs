import { Search, ShoppingBag, CreditCard, Package, User, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Browse Collections",
    description: "Explore our extensive catalog of streetwear essentials. Filter by category, size, price, and style to find exactly what you're looking for.",
    color: "from-blue-500 to-blue-600",
    link: "/shop",
    linkText: "Start Shopping",
  },
  {
    icon: ShoppingBag,
    title: "Easy Ordering",
    description: "Add items to your cart with a single click. Review your selections, choose sizes and quantities, then proceed to checkout seamlessly.",
    color: "from-purple-500 to-purple-600",
    link: "/shop",
    linkText: "View Products",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Complete your purchase with confidence. We accept all major credit cards, digital wallets, and offer multiple secure payment options.",
    color: "from-green-500 to-green-600",
    link: "/shop",
    linkText: "Shop Now",
  },
  {
    icon: Package,
    title: "Track Orders",
    description: "Stay updated on your order status from confirmation to delivery. Receive real-time notifications and tracking information.",
    color: "from-orange-500 to-orange-600",
    link: "/orders",
    linkText: "Track Order",
  },
  {
    icon: User,
    title: "Manage Account",
    description: "Create your profile, save shipping addresses, view order history, and manage your preferences all in one place.",
    color: "from-pink-500 to-pink-600",
    link: "/account",
    linkText: "My Account",
  },
  {
    icon: ShoppingBag,
    title: "Shopping Cart",
    description: "Add items to your cart and checkout seamlessly. Manage your selections before making a purchase.",
    color: "from-red-500 to-red-600",
    link: "/cart",
    linkText: "View Cart",
  },
];

const quickActions = [
  {
    icon: Star,
    title: "New Arrivals",
    description: "Check out the latest drops",
    link: "/shop?filter=new",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free shipping on orders over $100",
    link: "/",
  },
];

export default function PlatformFeatures() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="main">
        {/* Section Header */}
        <div data-aos="fade-up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-main">
              Platform Features
            </span>
          </div>
          <h2 data-aos="fade-up" className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
            Everything You Need
          </h2>
          <p data-aos="fade-up" className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            Discover all the ways you can shop, order, and manage your streetwear collection with ease.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative bg-background p-6 md:p-8 border border-line hover:border-main/30 transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-semibold text-main uppercase font-space mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* CTA Link */}
                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-2 text-main font-space font-semibold uppercase text-sm tracking-wider group-hover:gap-3 transition-all duration-300"
                >
                  <span>{feature.linkText}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-main to-main/50 group-hover:w-full transition-all duration-300" />
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative bg-background p-6 md:p-8 border-2 border-line hover:border-main transition-all duration-300 flex items-center gap-6"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-main text-background rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Icon size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                    {action.title}
                  </h4>
                  <p className="text-sm md:text-base text-muted">
                    {action.description}
                  </p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-main group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0"
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div data-aos="fade-up" className="text-center mt-12">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-main text-background font-space font-semibold uppercase tracking-wider text-sm hover:bg-main/90 transition-all duration-300"
          >
            <span>Explore All Features</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

