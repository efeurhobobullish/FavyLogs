import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Search, X, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import useProduct from "@/hooks/useProduct";

/* ===============================
   HELPERS
================================ */
const formatPrice = (price: number): string =>
  `₦${price.toLocaleString("en-NG")}`;

const isNewProduct = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const daysDiff =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 7;
};

/* ===============================
   CATEGORIES — FAVYLOGS
================================ */
const categories = [
  "All",
  "Facebook Logs",
  "Instagram Logs",
  "TikTok Accounts",
  "Snapchat Accounts",
  "Twitter (X) Accounts",
  "Gmail / Email Logs",
  "VPN Accounts",
  "Streaming Accounts",
  "AI / ChatGPT Accounts",
  "Other Digital Logs",
];

type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "name-desc";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 300000 });
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { useAllProducts } = useProduct();
  const apiCategory =
    selectedCategory === "All" ? undefined : selectedCategory;

  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useAllProducts(apiCategory, searchQuery || undefined);

  /* ===============================
     FILTER & SORT
  ================================ */
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter(
      (product) =>
        product.price >= priceRange.min &&
        product.price <= priceRange.max
    );

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "name-asc":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }
  }, [allProducts, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: 300000 });
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    priceRange.min > 0 ||
    priceRange.max < 300000;

  return (
    <MainLayout>
      <div className="min-h-screen py-10">
        <div className="main space-y-10">

          {/* ===============================
             HEADER
          ================================ */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-space uppercase">
              Favylogs Marketplace
            </h1>
            <p className="text-muted text-sm mt-2">
              Verified social media logs, digital accounts, VPNs, and premium tools.
            </p>
          </div>

          {/* ===============================
             SEARCH
          ================================ */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs, accounts, VPNs, tools..."
              className="w-full pl-12 pr-4 py-3 border border-line bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* ===============================
             FILTER BAR
          ================================ */}
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm uppercase border ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-background"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as SortOption)
                }
                className="border px-3 py-2"
              >
                <option value="default">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
              </select>

              <div className="flex border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-black text-white" : ""
                  }`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-black text-white" : ""
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ===============================
             ACTIVE FILTERS
          ================================ */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted">Active filters:</span>
              {searchQuery && <span className="px-2 py-1 border">Search</span>}
              {selectedCategory !== "All" && (
                <span className="px-2 py-1 border">{selectedCategory}</span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-black text-white"
              >
                Clear All
              </button>
            </div>
          )}

          {/* ===============================
             PRODUCTS
          ================================ */}
          {isLoading ? (
            <div className="text-center py-20">Loading items…</div>
          ) : error ? (
            <div className="text-center py-20">
              Failed to load marketplace items.
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              No logs or digital items found.
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {filteredAndSortedProducts.map((product) => {
                const image =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "";

                return (
                  <div
                    key={product.id}
                    className={`group relative border p-4 ${
                      viewMode === "list" ? "flex gap-6" : ""
                    }`}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative bg-secondary aspect-[3/4] overflow-hidden">
                      {image && (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}

                      {isNewProduct(product.createdAt) && (
                        <span className="absolute top-3 left-3 bg-white text-black text-xs px-2 py-1 uppercase">
                          New
                        </span>
                      )}

                      <Link
                        to={`/shop/${product.id}`}
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition ${
                          hoveredProduct === product.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <span className="bg-white text-black px-5 py-2 text-sm uppercase">
                          View Details
                        </span>
                      </Link>
                    </div>

                    <div className="mt-4 space-y-1">
                      <p className="text-xs uppercase text-muted">
                        {product.category}
                      </p>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="font-bold">
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
    </MainLayout>
  );
}