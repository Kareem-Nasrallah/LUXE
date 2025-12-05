import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '@/types';
import { mockReviews } from '@/data/mockData';

interface ReviewsState {
  items: Review[];
}

const loadReviewsFromStorage = (): Review[] => {
  try {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : mockReviews;
  } catch {
    return mockReviews;
  }
};

const saveReviewsToStorage = (items: Review[]) => {
  localStorage.setItem('reviews', JSON.stringify(items));
};

const initialState: ReviewsState = {
  items: loadReviewsFromStorage(),
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.push(action.payload);
      saveReviewsToStorage(state.items);
    },
  },
});

export const { addReview } = reviewsSlice.actions;
export const selectReviews = (state: { reviews: ReviewsState }) => state.reviews.items;
export const selectProductReviews = (productId: string) => (state: { reviews: ReviewsState }) =>
  state.reviews.items.filter((r) => r.productId === productId);
export default reviewsSlice.reducer;
