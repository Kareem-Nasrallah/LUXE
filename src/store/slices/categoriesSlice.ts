import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";
import { client } from "@/../client";
import { sanityWriteClient } from "@/../sanityWriteClient";

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const categories = await client.fetch(`
      *[_type == "category"]{
        _id,
        title,
        description,
        slug,
        image,
        "productCount": count(
          *[_type == "product" && category._ref == ^._id]
        )
      }
    `);
    return categories;
  },
);

const buildCategoryData = (data: Category, isUpdate = false) => {
  return {
    title: data.title,
    description: data.description,

    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: data.image,
      },
    },

    slug: {
      _type: "slug",
      current: isUpdate
        ? `${data.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
        : data.title.toLowerCase().replace(/\s+/g, "-"),
    },
  };
};

export const updateSanitycategory = async (categoryId: string, data: any) => {
  const categoryData = buildCategoryData(data, true);
  try {
    await sanityWriteClient.patch(categoryId).set(categoryData).commit();
  } catch (error) {
    console.error(error);
  }
};

export const createSanitycategory = async (data: any) => {
  const categoryData = buildCategoryData(data);
  try {
    await sanityWriteClient.create({ _type: "category", ...categoryData });
  } catch (error) {
    console.error(error);
  }
};

export const deleteSanityCategory = async (categoryId: string) => {
  try {
    await sanityWriteClient.delete(categoryId);
  } catch (error) {
    console.error(error);
  }
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export const { addCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
