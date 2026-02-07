import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";
import { client } from "../../../client";

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    priceRange: [number, number];
    onSale: boolean;
    sortBy: "newest" | "price-low" | "price-high" | "popular";
  };
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: [0, 10000],
    onSale: false,
    sortBy: "newest",
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const data = await client.fetch(`*[_type == "product"]{
    ...,
    category->{
      _id,
      title,
      slug
    }}`);
    return data;
  },
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug: string) => {
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]`,
      { slug },
    );
    if (!product) throw new Error("Product not found");
    return product;
  },
);

const applyFilters = (state: ProductsState) => {
  let filtered = [...state.items];

  if (state.filters.category) {
    filtered = filtered.filter(
      (p) => p.category.slug.current === state.filters.category,
    );
  }

  if (state.filters.onSale) {
    filtered = filtered.filter((p) => p.onSale);
  }

  filtered = filtered.filter(
    (p) =>
      p.price >= state.filters.priceRange[0] &&
      p.price <= state.filters.priceRange[1],
  );

  switch (state.filters.sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  state.filteredItems = filtered;
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
      applyFilters(state);
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
      applyFilters(state);
    },
    setOnSale: (state, action: PayloadAction<boolean>) => {
      state.filters.onSale = action.payload;
      applyFilters(state);
    },
    setSortBy: (
      state,
      action: PayloadAction<"newest" | "price-low" | "price-high" | "popular">,
    ) => {
      state.filters.sortBy = action.payload;
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      applyFilters(state);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      applyFilters(state);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
        applyFilters(state);
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
      applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        applyFilters(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product not found";
      });
  },
});

export const {
  setCategory,
  setPriceRange,
  setOnSale,
  setSortBy,
  clearFilters,
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
