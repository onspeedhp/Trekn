import { createSlice } from '@reduxjs/toolkit';
import { IDrop } from '../../models/types';

const initialState: {
  nearBy: IDrop[];
  readyToCollect: IDrop[];
  population: IDrop[];
  lastFetch: number;
} = {
  nearBy: [],
  readyToCollect: [],
  population: [],
  lastFetch: -1,
};

export const locationSlide = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLastFetch: (state) => {
      state.lastFetch = new Date().getTime();
    },
    updateLocation: (state, action) => {
      const { nearBy, readyToCollect } = action.payload;
      console.log(nearBy, readyToCollect);

      state.nearBy = nearBy ? nearBy : state.nearBy;
      state.readyToCollect = readyToCollect
        ? readyToCollect
        : state.readyToCollect;
    },
    addNewNearBy: (state, action) => {
      const { newNearBy } = action.payload;
      state.nearBy.push(newNearBy);
    },
    resetLocation: (state) => {
      state.nearBy = [];
      state.readyToCollect = [];
      state.population = [];
      state.lastFetch = -1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLastFetch, updateLocation, resetLocation } =
  locationSlide.actions;

export default locationSlide.reducer;
