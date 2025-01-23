import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loader: false,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setLoader(state, action) {
            state.loader = action.payload;
        },
    },
});

export const { setLoader } = chatSlice.actions;

export default chatSlice.reducer;