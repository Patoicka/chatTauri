import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loader: false,
    selectChat: true,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setLoader(state, action) {
            state.loader = action.payload;
        },
        setChat(state, action) {
            state.selectChat = action.payload;
        },
    },
});

export const { setLoader, setChat } = chatSlice.actions;
export default chatSlice.reducer;