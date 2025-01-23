
import { configureStore } from '@reduxjs/toolkit';
import { chatSlice } from './store';

const store = configureStore({
    reducer: {
        chat: chatSlice.reducer,
    },
});

export default store;