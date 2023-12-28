import { configureStore } from '@reduxjs/toolkit';
import userSlide from './slides/userSlides';
import locationSlide from './slides/locationSlides';
import accountSlide from './slides/accountSlides';
import configSlice from './slides/configSlice';

export const store = configureStore({
  reducer: {
    user: userSlide,
    location: locationSlide,
    account: accountSlide,
    config: configSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// action types
export const CLEAR_DATA = 'CLEAR_DATA';

// action creator
export const clearData = () => ({
  type: CLEAR_DATA,
});
