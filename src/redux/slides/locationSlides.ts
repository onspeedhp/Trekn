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
    updateReadyToCollect: (state, action) => {
      const { readyToCollect } = action.payload;
      state.readyToCollect = readyToCollect
        ? readyToCollect
        : state.readyToCollect;
    },
    updateNearBy: (state, action) => {
      const { nearBy } = action.payload;
      state.nearBy = nearBy ? nearBy : state.nearBy;
    },
    addNewReadyToCollect: (state, action) => {
      const { newReadyToCollect } = action.payload;
      state.readyToCollect.push(newReadyToCollect);
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
export const {
  setLastFetch,
  updateReadyToCollect,
  updateNearBy,
  resetLocation,
  addNewReadyToCollect,
} = locationSlide.actions;

export default locationSlide.reducer;
