import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Header } from '../Components/Header';
import { Messages } from '../Components/Messages';
import { Input } from '../Components/Input';

const socket = io('http://localhost:4000');

export const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');

    const handleUsername = (newUsername) => {
        setUsername(newUsername);
    };

    useEffect(() => {
        if (username) {
            socket.emit('join', username);

            socket.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('userList', (users) => {
                console.log('Usuarios:', users);
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('userList');
            };
        }
    }, [username]);

    const handleSendMessage = (newMessage) => {
        const message = { user: username, text: newMessage };
        socket.emit('sendMessage', message);
    };

    return (
        <div className="bg-gray-300 w-[50%] mx-auto h-full p-2">
            <Header newUsername={handleUsername} />

            <Messages messages={messages} username={username} />

            <Input handleSend={handleSendMessage} />
        </div>
    );
};
