import { createSlice } from "@reduxjs/toolkit";

export const configSlice = createSlice({
    name: "config",
    initialState: {
        dropType: null,
    },
    reducers: {
        setDropType: (state,action) => {
            state.dropType = action.payload
        }
    },
});

export const { setDropType } = configSlice.actions;

export default configSlice.reducer;
