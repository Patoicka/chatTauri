import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Header } from '../Components/Header';
import { Messages } from '../Components/Messages';
import { Input } from '../Components/Input';
import { useDispatch, useSelector } from 'react-redux';
import { Home } from './Home';

const socket = io('http://localhost:4000');

export const Chat = () => {

    const { selectChat, home, user } = useSelector((state) => state.chat);

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

            socket.on('receiveMessage', (message) => {
                console.log('Mensaje recibido:', message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('messageEdited', (editedMessage) => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.time === editedMessage.time && msg.user === editedMessage.user
                            ? editedMessage
                            : msg
                    )
                );
            });

            socket.on('userTyping', (user) => {
                setTypingUser(user);
            });

            socket.on('userStoppedTyping', () => {
                setTypingUser('');
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('messageEdited');
                socket.off('userTyping');
                socket.off('userStoppedTyping');
            };
        }
    }, [user]);

    const handleSendMessage = (newMessage, time, imageUrl) => {
        const message = {
            user: user,
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
        <div className="bg-gray-300 xs:w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto h-full overflow-hidden">

            {!home ?
                <>
                    <Header newUsername={username} />
                    <Messages messages={messages} typingUser={typingUser} />
                    <Input handleSend={handleSendMessage} handleTyping={handleTyping} />
                </>
                :
                <Home newUsername={selectNewChat} />
            }

        </div>
    );
};
