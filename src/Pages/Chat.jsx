import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Header } from '../Components/Header';
import { Messages } from '../Components/Messages';
import { Input } from '../Components/Input';
import { setChat } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';

const socket = io('http://localhost:4000');

export const Chat = () => {

    const { selectChat } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [typingUser, setTypingUser] = useState('');

    useEffect(() => {
        dispatch(setChat(true));
    }, []);

    useEffect(() => {
        setMessages([]);
    }, [selectChat]);

    const handleUsername = (newUsername) => {
        setUsername(newUsername);
    };

    useEffect(() => {
        if (username) {
            socket.emit('join', username);

            socket.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('userTyping', (user) => {
                setTypingUser(user);
            });

            socket.on('userStoppedTyping', () => {
                setTypingUser('');
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('userTyping');
                socket.off('userStoppedTyping');
            };
        }
    }, [username]);

    const handleSendMessage = (newMessage, time, imageUrl) => {
        const message = {
            user: username,
            text: newMessage || '',
            time: time || '',
            image: imageUrl || null,
            selectChat: selectChat,
        };
        socket.emit('sendMessage', message);
    };

    const handleTyping = (isTyping) => {
        if (isTyping) {
            socket.emit('typing', username);
        } else {
            socket.emit('stoppedTyping');
        };
    };

    return (
        <div className="bg-gray-300 w-[50%] mx-auto h-full p-2">
            <Header newUsername={handleUsername} />
            <Messages messages={messages} username={username} typingUser={typingUser} />
            <Input handleSend={handleSendMessage} handleTyping={handleTyping} />
        </div>
    );
};
