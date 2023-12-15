import { createSlice } from "@reduxjs/toolkit";

export const accountSlide = createSlice({
    name: "account",
    initialState: {},
    reducers: {
        setAccountData: (state: any, action: any) => {
            return state = {...action.payload};
        },
        clearAccountData: (state: any) => {
            return state = {};
        }
    },
});

export const { setAccountData, clearAccountData } = accountSlide.actions;

export default accountSlide.reducer;
