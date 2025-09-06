import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all orders
    getAllOrders: builder.query({
      query: () => ({
        url: "/payment",
        method: "GET",
      }),
    }),

    // ✅ Update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, orderStatus }) => ({
        url: `/payment/${id}/status`,
        method: "PUT",
        body: { orderStatus },
      }),
    }),
    getUserOrders: builder.query({
      query: (userId: string) => `/payment/my-orders?userId=${userId}`,
    }),
  }),
});

export const { useGetAllOrdersQuery, useUpdateOrderStatusMutation,useGetUserOrdersQuery } = orderApi;