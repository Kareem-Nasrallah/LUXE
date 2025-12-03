import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
