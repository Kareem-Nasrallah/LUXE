import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

const getWishlisttKey = () => {
  const user = localStorage.getItem("user");
  return user ? `wishlist_${JSON.parse(user).id}` : "wishlist";
};

const loadWishlistFromStorage = (): Product[] => {
  try {
    const saved = localStorage.getItem(getWishlisttKey());
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: Product[]) => {
  localStorage.setItem(getWishlisttKey(), JSON.stringify(items));
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    loadWishlist: (state) => {
      state.items = loadWishlistFromStorage();
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(
        (item) => item._id === action.payload._id,
      );
      if (!exists) {
        state.items.push(action.payload);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

export const { loadWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;
export const selectIsInWishlist =
  (productId: string) => (state: { wishlist: WishlistState }) =>
    state.wishlist.items.some((item) => item._id === productId);

export default wishlistSlice.reducer;
