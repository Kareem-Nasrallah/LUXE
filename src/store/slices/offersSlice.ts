import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Offer {
  id: string;
  productIds: string[];
  discountPercent: number;
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
}

interface OffersState {
  items: Offer[];
}

const loadOffersFromStorage = (): Offer[] => {
  try {
    const saved = localStorage.getItem('offers');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveOffersToStorage = (items: Offer[]) => {
  localStorage.setItem('offers', JSON.stringify(items));
};

const initialState: OffersState = {
  items: loadOffersFromStorage(),
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    addOffer: (state, action: PayloadAction<Offer>) => {
      state.items.push(action.payload);
      saveOffersToStorage(state.items);
    },
    updateOffer: (state, action: PayloadAction<Offer>) => {
      const index = state.items.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveOffersToStorage(state.items);
      }
    },
    deleteOffer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((o) => o.id !== action.payload);
      saveOffersToStorage(state.items);
    },
  },
});

export const { addOffer, updateOffer, deleteOffer } = offersSlice.actions;
export const selectOffers = (state: { offers: OffersState }) => state.offers.items;
export default offersSlice.reducer;
