import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loader: false,
    selectChat: null,
    home: true,
    user: '',
    users: [
        {
            username: 'bluepond',
            image: faUser,
        },
        {
            username: 'greenpond',
            image: faUser,
        },
        {
            username: 'ChatBot',
            image: faRobot,
        },
    ]
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
        setUser(state, action) {
            state.user = action.payload;
        },
        setHome(state, action) {
            state.home = action.payload;
        },
    },
});

export const { setLoader, setChat, setUser, setHome } = chatSlice.actions;
export default chatSlice.reducer;