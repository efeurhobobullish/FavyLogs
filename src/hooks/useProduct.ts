import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";

interface ProductResponse {
  success: boolean;
  message: string;
  product?: IProduct;
  products?: IProduct[];
  count?: number;
}

export default function useProduct() {
  // Get all products
  const getAllProducts = async (category?: string, search?: string): Promise<IProduct[]> => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const queryString = params.toString();
    const url = queryString ? `/v1/products?${queryString}` : "/v1/products";

    const response = await api.get<ProductResponse>(url);
    
    if (response.data.success && response.data.products) {
      return response.data.products;
    }
    return [];
  };

  // Get single product by ID
  const getProductById = async (id: string): Promise<IProduct | null> => {
    try {
      const response = await api.get<ProductResponse>(`/v1/products/${id}`);
      
      if (response.data.success && response.data.product) {
        return response.data.product;
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // React Query hooks
  const useAllProducts = (category?: string, search?: string) => {
    return useQuery({
      queryKey: ["products", category, search],
      queryFn: () => getAllProducts(category, search),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useProduct = (id: string) => {
    return useQuery({
      queryKey: ["product", id],
      queryFn: () => getProductById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    getAllProducts,
    getProductById,
    useAllProducts,
    useProduct,
  };
}

