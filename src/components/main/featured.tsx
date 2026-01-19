import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import useProduct from "@/hooks/useProduct";

// Helper function to format price to Nigerian Naira
const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString("en-NG")}`;
};

// Helper function to check if product is new (created within last 7 days)
const isNewProduct = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 7;
};

export default function Featured() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { useAllProducts } = useProduct();
  const { data: allProducts = [], isLoading, error } = useAllProducts();

  // Get 8 most recent products
  const featuredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    
    // Sort by createdAt (most recent first) and take first 8
    const sorted = [...allProducts].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    return sorted.slice(0, 8);
  }, [allProducts]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="main">
        {/* Section Header */}
        <div data-aos="fade-up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-main">
              Featured Collection
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
            Shop The Latest
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            Discover our curated selection of streetwear essentials designed for the modern lifestyle.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-muted">Failed to load products. Please try again later.</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {featuredProducts.map((product) => {
              const productImage = product.images && product.images.length > 0 ? product.images[0] : "";
              const isNew = isNewProduct(product.createdAt);
              
              return (
                <div
                  key={product.id}
                  className="group relative"
                  data-aos="fade-up"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden bg-secondary aspect-[3/4] mb-4">
                    {productImage ? (
                      <>
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            // Hide image and show placeholder if it fails to load
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            const placeholder = img.nextElementSibling as HTMLElement;
                            if (placeholder) {
                              placeholder.style.display = "flex";
                            }
                          }}
                        />
                        {/* Placeholder (hidden by default, shown on error) */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
                          <span className="text-muted md:text-sm text-xs text-wrap text-center font-space uppercase px-2">
                            {product.name}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-muted md:text-sm text-xs text-wrap text-center font-space uppercase px-2">
                          {product.name}
                        </span>
                      </div>
                    )}

                    {/* New Badge */}
                    {isNew && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-space font-semibold uppercase tracking-wider">
                        New
                      </div>
                    )}

                    {/* Quick View Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Link
                        to={`/shop/${product.id}`}
                        className="px-6 py-3 bg-white text-black font-space font-semibold uppercase text-sm tracking-wider hover:bg-white/90 transition-colors duration-300"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted font-space uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="text-sm md:text-lg font-semibold text-main">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-main font-space">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-space font-semibold uppercase tracking-wider text-sm hover:bg-black/90 transition-all duration-300"
          >
            <span>View All Products</span>
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

