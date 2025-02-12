import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Header } from '../Components/Header';
import { Messages } from '../Components/Messages';
import { Input } from '../Components/Input';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../store/store';

const socket = io('http://localhost:4000');

export const Chat = () => {

    const { selectChat, user, firstMessage } = useSelector((state) => state.chat);

    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [typingUser, setTypingUser] = useState('');

    useEffect(() => {
        setMessages([]);
    }, [selectChat]);

    const selectNewChat = (username) => {
        setUsername(username);
    };

    useEffect(() => {
        if (user) {
            socket.emit('join', user);

            const handleReceiveMessage = (message) => {
                console.log('Mensaje recibido:', message);
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.time === message.time && msg.user === message.user)) {
                        return prevMessages;
                    }
                    return [...prevMessages, message];
                });
            };

            const handleEditMessage = (editedMessage) => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.time === editedMessage.time && msg.user === editedMessage.user
                            ? editedMessage
                            : msg
                    )
                );
            };

            const handleTypingUser = (user) => {
                setTypingUser(user);
            };

            const handleStoppedTyping = () => {
                setTypingUser('');
            };

            socket.on('receiveMessage', handleReceiveMessage);
            socket.on('messageEdited', handleEditMessage);
            socket.on('userTyping', handleTypingUser);
            socket.on('userStoppedTyping', handleStoppedTyping);

            return () => {
                socket.off('receiveMessage', handleReceiveMessage);
                socket.off('messageEdited', handleEditMessage);
                socket.off('userTyping', handleTypingUser);
                socket.off('userStoppedTyping', handleStoppedTyping);
            };
        }
    }, [firstMessage]);

    const handleSendMessage = (newMessage, time, imageUrl) => {
        const message = {
            usuario: user,
            asunto: 'conversacion',
            descripcion: newMessage || '',
            date: time || '',
            imagen: imageUrl || '',
            selectChat: selectChat,
        };
        console.log(message);
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
        <div className="bg-gray-300 xs:w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto h-full overflow-hidden">

            <Header newUsername={username} />
            <Messages messages={messages} typingUser={typingUser} />
            <Input handleSend={handleSendMessage} handleTyping={handleTyping} />

        </div >
    );
};
