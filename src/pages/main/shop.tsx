import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Search, X, SlidersHorizontal, Grid3x3, List } from "lucide-react";
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

const categories = ["All", "T-Shirts", "Jackets", "Hoodies", "Pants", "Sweatshirts", "Accessories"];

type SortOption = "default" | "price-low" | "price-high" | "name-asc" | "name-desc";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { useAllProducts } = useProduct();
  // Get category for API call (or undefined if "All")
  const apiCategory = selectedCategory === "All" ? undefined : selectedCategory;
  const { data: allProducts = [], isLoading, error } = useAllProducts(apiCategory, searchQuery || undefined);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // First filter by price (API doesn't handle price filtering)
    const filtered = allProducts.filter((product) => {
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default: sort by most recent
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        break;
    }

    return filtered;
  }, [allProducts, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: 200000 });
    setSortBy("default");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || priceRange.min > 0 || priceRange.max < 200000;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-4">
              Shop
            </h1>
            <p className="text-muted text-sm md:text-base">
              Discover our complete collection of streetwear essentials
            </p>
          </div>

          {/* Search and Controls Bar */}
          <div className="mb-6 md:mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-main"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Filter Toggle & Category Filter */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-line bg-background hover:bg-secondary transition-colors font-space uppercase text-sm"
                >
                  <SlidersHorizontal size={18} />
                  <span>Filters</span>
                </button>

                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 font-space uppercase text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-main text-background"
                          : "bg-secondary text-main hover:bg-secondary/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort & View Mode */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>

                <div className="flex items-center gap-2 border border-line">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid" ? "bg-main text-background" : "bg-background text-main hover:bg-secondary"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list" ? "bg-main text-background" : "bg-background text-main hover:bg-secondary"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-secondary text-main text-sm font-space">
                    Search: {searchQuery}
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="px-3 py-1 bg-secondary text-main text-sm font-space">
                    Category: {selectedCategory}
                  </span>
                )}
                {(priceRange.min > 0 || priceRange.max < 200000) && (
                  <span className="px-3 py-1 bg-secondary text-main text-sm font-space">
                    Price: ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-main text-background text-sm font-space uppercase hover:bg-main/90 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0 space-y-6 mb-8 md:mb-0`}
            >
              <div className="bg-secondary p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-main uppercase font-space">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-muted hover:text-main"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-semibold text-main uppercase font-space mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Min: ₦{priceRange.min.toLocaleString()}</label>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Max: ₦{priceRange.max.toLocaleString()}</label>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Price Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-main uppercase font-space mb-3">
                    Quick Filters
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 30000 })}
                      className="w-full text-left px-3 py-2 bg-background hover:bg-background/80 text-main text-sm font-space transition-colors"
                    >
                      Under ₦30,000
                    </button>
                    <button
                      onClick={() => setPriceRange({ min: 30000, max: 50000 })}
                      className="w-full text-left px-3 py-2 bg-background hover:bg-background/80 text-main text-sm font-space transition-colors"
                    >
                      ₦30,000 - ₦50,000
                    </button>
                    <button
                      onClick={() => setPriceRange({ min: 50000, max: 200000 })}
                      className="w-full text-left px-3 py-2 bg-background hover:bg-background/80 text-main text-sm font-space transition-colors"
                    >
                      Over ₦50,000
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid/List */}
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-sm text-muted">
                  Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-16">
                  <p className="text-muted text-lg">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-muted text-lg mb-4">Failed to load products. Please try again later.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 mx-auto bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted text-lg mb-4">No products found</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 mx-auto bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                      : "space-y-6"
                  }
                >
                  {filteredAndSortedProducts.map((product) => {
                    const productImage = product.images && product.images.length > 0 ? product.images[0] : "";
                    const isNew = isNewProduct(product.createdAt);
                    
                    return (
                      <div
                        key={product.id}
                        className={`group relative ${
                          viewMode === "list" ? "flex gap-6" : ""
                        }`}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        {/* Product Image */}
                        <div
                          className={`relative overflow-hidden bg-secondary ${
                            viewMode === "list" ? "w-48 h-64 flex-shrink-0" : "aspect-[3/4] mb-4"
                          }`}
                        >
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                // Hide image and show placeholder if it fails to load
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : null}
                          {/* Placeholder if image doesn't exist or failed to load */}
                          {!productImage && (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <span className="text-muted md:text-sm text-xs text-wrap text-center font-space uppercase px-2">
                                {product.name}
                              </span>
                            </div>
                          )}

                          {isNew && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-space font-semibold uppercase tracking-wider">
                              New
                            </div>
                          )}

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
                        <div className={`space-y-1 ${viewMode === "list" ? "flex-1" : ""}`}>
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
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
