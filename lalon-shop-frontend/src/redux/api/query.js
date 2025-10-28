import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { revalidateTag } from "next/cache";

// Function to get the correct base URL based on environment
const getBaseUrl = () => {
  // If running on server-side (SSR), use localhost
  if (typeof window === 'undefined') {
    return 'http://localhost:2004/api/v1';
  }
  
  // If running on client-side, use the current hostname
  const hostname = window.location.hostname;
  if (hostname === 'www.lalonshopbd.com' || hostname === 'lalonshopbd.com') {
    return 'https://www.lalonshopbd.com/api/v1';
  }
  
  // For local development or direct IP access
  return 'http://88.222.245.41:2004/api/v1';
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: (builder) => ({
    getCategoryList: builder.query({
      query: () => {
        return {
          url: "/category/get-category-list",
        };
      },
    }),
    searchProduct: builder.query({
      query: (params) => {
        return {
          url: `/product/search?${params}`,
        };
      },
    }),
    productDetails: builder.query({
      query: (id) => {
        return {
          url: `/product/detail/${id}`,
        };
      },
    }),
    relatedProduct: builder.query({
      query: (id) => {
        return {
          url: `/product/related?product=${id}`,
        };
      },
    }),
    createOrder: builder.mutation({
      query: (body) => {
        return {
          url: `/order/multi`,
          method: "POST",
          body: body,
        };
      },
    }),
    landingPageData: builder.query({
      query: (id) => {
        return {
          url: `/landing-page/${id}`,
        };
      },
    }),
  }),
});

export const {
  useGetCategoryListQuery,
  useSearchProductQuery,
  useProductDetailsQuery,
  useRelatedProductQuery,
  useCreateOrderMutation,
  useLandingPageDataQuery,
} = api;
