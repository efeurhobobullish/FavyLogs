import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ShoppingCart, Minus, Plus, Share2, ArrowLeft, Check } from "lucide-react";
import useCart from "@/hooks/useCart";
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

// Convert string ID to number (for cart compatibility)
// Uses a simple hash function for MongoDB ObjectIds
const stringToNumberId = (id: string): number => {
  // Try direct conversion first
  const numId = Number(id);
  if (!isNaN(numId) && numId > 0) {
    return numId;
  }
  // Hash the string ID to a number
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Convert IProduct to Product format for cart
const convertToCartProduct = (product: IProduct) => {
  return {
    id: stringToNumberId(product.id),
    name: product.name,
    category: product.category,
    price: formatPrice(product.price),
    priceValue: product.price,
    image: product.images && product.images.length > 0 ? product.images[0] : "",
    isNew: isNewProduct(product.createdAt),
    originalId: product.id, // Store original string ID for navigation
  };
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { useProduct: useProductQuery, useAllProducts } = useProduct();
  const { data: product, isLoading, error } = useProductQuery(id || "");
  const { data: allProducts = [] } = useAllProducts();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "shipping">("description");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product) {
      // Set default selections
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  // Get related products
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-16 text-center">
          <p className="text-muted">Loading product...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-16 text-center">
          <h1 className="text-2xl font-bold text-main mb-4">Product Not Found</h1>
          <p className="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </MainLayout>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [];
  const isNew = isNewProduct(product.createdAt);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    // Convert IProduct to Product format for cart
    const cartProduct = convertToCartProduct(product);
    addToCart(cartProduct, quantity, selectedSize || undefined, selectedColor || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + change)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - ${formatPrice(product.price)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-secondary mb-4 overflow-hidden">
                {productImages.length > 0 ? (
                  <>
                    <img
                      src={productImages[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      onError={(e) => {
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
                      <span className="text-muted text-sm font-space uppercase px-4 text-center">
                        {product.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-muted text-sm font-space uppercase px-4 text-center">
                      {product.name}
                    </span>
                  </div>
                )}
                {isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-space font-semibold uppercase tracking-wider">
                    New
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-secondary overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-main" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const placeholder = img.nextElementSibling as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
                        <span className="text-muted text-xs font-space uppercase">Image {index + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Name */}
              <div className="mb-4">
                <p className="text-sm text-muted font-space uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-main uppercase font-space mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-main font-space">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted mb-6 leading-relaxed">{product.description}</p>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                    Size: {selectedSize || "Select Size"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 font-space uppercase text-sm transition-all ${
                          selectedSize === size
                            ? "border-main bg-main text-background"
                            : "border-line text-main hover:border-main"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                    Color: {selectedColor || "Select Color"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 font-space uppercase text-sm transition-all ${
                          selectedColor === color
                            ? "border-main bg-main text-background"
                            : "border-line text-main hover:border-main"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-secondary transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-2 font-space font-semibold text-main min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-secondary transition-colors"
                      disabled={quantity >= 10}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-space font-semibold uppercase text-sm transition-all duration-300 ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-main text-background hover:bg-main/90"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-line text-main font-space font-semibold uppercase text-sm hover:border-main transition-all"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>

              {/* Product Info Tabs */}
              <div className="border-t border-line pt-6">
                <div className="flex gap-4 mb-4 border-b border-line">
                  {[
                    { id: "description", label: "Description" },
                    { id: "details", label: "Details" },
                    { id: "shipping", label: "Shipping" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-4 py-2 font-space uppercase text-sm transition-colors ${
                        activeTab === tab.id
                          ? "text-main border-b-2 border-main font-semibold"
                          : "text-muted hover:text-main"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="text-muted text-sm leading-relaxed">
                  {activeTab === "description" && (
                    <div>
                      <p className="mb-4">{product.description || "No description available."}</p>
                      <p>
                        Made with premium materials and attention to detail. This piece is part of our
                        curated collection designed for those who appreciate quality streetwear.
                      </p>
                    </div>
                  )}
                  {activeTab === "details" && (
                    <div className="space-y-2">
                      <p><strong>Material:</strong> Premium Cotton Blend</p>
                      <p><strong>Care:</strong> Machine wash cold, tumble dry low</p>
                      <p><strong>Origin:</strong> Made with care</p>
                      <p><strong>SKU:</strong> DRI-{product.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                  )}
                  {activeTab === "shipping" && (
                    <div className="space-y-2">
                      <p><strong>Free Shipping:</strong> On orders over ₦50,000</p>
                      <p><strong>Standard Delivery:</strong> 3-5 business days</p>
                      <p><strong>Express Delivery:</strong> 1-2 business days (additional fee)</p>
                      <p><strong>Returns:</strong> 30-day return policy</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-line pt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedImage = relatedProduct.images && relatedProduct.images.length > 0 
                    ? relatedProduct.images[0] 
                    : "";
                  const relatedIsNew = isNewProduct(relatedProduct.createdAt);
                  
                  return (
                    <Link
                      key={relatedProduct.id}
                      to={`/shop/${relatedProduct.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                        {relatedImage ? (
                          <img
                            src={relatedImage}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = "none";
                              const placeholder = img.nextElementSibling as HTMLElement;
                              if (placeholder) {
                                placeholder.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        {/* Placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
                          <span className="text-muted text-xs font-space uppercase text-center px-2">
                            {relatedProduct.name}
                          </span>
                        </div>
                        {relatedIsNew && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-white text-black text-xs font-space font-semibold uppercase">
                            New
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted font-space uppercase">{relatedProduct.category}</p>
                        <h3 className="text-sm font-semibold text-main">{relatedProduct.name}</h3>
                        <p className="text-base font-bold text-main font-space">{formatPrice(relatedProduct.price)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
