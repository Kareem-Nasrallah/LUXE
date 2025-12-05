import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/types';
import { mockCategories } from '@/data/mockData';

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const loadCategoriesFromStorage = (): Category[] => {
  try {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCategoriesToStorage = (items: Category[]) => {
  localStorage.setItem('categories', JSON.stringify(items));
};

const initialState: CategoriesState = {
  items: loadCategoriesFromStorage(),
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = loadCategoriesFromStorage();
    if (stored.length > 0) return stored;
    saveCategoriesToStorage(mockCategories);
    return mockCategories;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
      saveCategoriesToStorage(state.items);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveCategoriesToStorage(state.items);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c._id !== action.payload);
      saveCategoriesToStorage(state.items);
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
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
