import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
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

export const { setAccountData, clearAccountData } = accountSlice.actions;

export default accountSlice.reducer;
