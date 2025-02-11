import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loader: false,
    selectChat: true,
    user: 'bluepond',
    messages: [],
    chatOption: false,
    optionType: '',
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
        setMessages(state, action) {
            state.messages = action.payload;
        },
        setChatOption(state, action) {
            state.chatOption = action.payload;
        },
        setOptionType(state, action) {
            state.optionType = action.payload;
        },
    },
});

export const { setLoader, setChat, setMessages, setChatOption, setOptionType } = chatSlice.actions;
export default chatSlice.reducer;