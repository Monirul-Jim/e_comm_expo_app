import { baseApi } from "./baseApi";
// Define the Product interface outside your component
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  subCategory: {
    _id: string;
    name: string;
    category: {
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleStart?: string;
  flashSaleEnd?: string;
  stockOut: boolean;
  isPopular: boolean;
}


const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
    }),

    getAllProducts: builder.query<
      {
        data: any[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/products?page=${page}&limit=${limit}`,
    }),
    // ✅ Get single product
    getSingleProduct: builder.query<any, string>({
      query: (id) => `/products/${id}`,
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
    }),
    updateStockOut: builder.mutation({
      query: ({ productId, stockOut }) => ({
        url: `/products/${productId}/stock-out`,
        method: "PATCH",
        body: { stockOut },
      }),
    }),

    updatePopularStatus: builder.mutation<
      any,
      { id: string; isPopular: boolean }
    >({
      query: ({ id, isPopular }) => ({
        url: `/products/${id}/popular`,
        method: "PATCH",
        body: { isPopular },
      }),
    }),

    getFlashSaleProducts: builder.query({
      query: () => `/products/flash-sale`,
    }),
    getPopularProducts: builder.query({
      query: () => "/products/popular",
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockOutMutation,
  useGetSingleProductQuery,
  useGetFlashSaleProductsQuery,
  useUpdatePopularStatusMutation,
  useGetPopularProductsQuery
} = productApi;