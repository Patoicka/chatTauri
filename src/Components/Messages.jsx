import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000');

export const Messages = ({ messages, username, typingUser }) => {
    const { loader, selectChat } = useSelector((state) => state.chat);
    const [fullScreen, setFullScreen] = useState(false);
    const [botThinking, setBotThinking] = useState(false);
    const messagesEndRef = useRef(null);

    console.log(botThinking);

    useEffect(() => {
        socket.on('thinking', (thinking) => {
            setBotThinking(thinking);
        });

        return () => {
            socket.off('thinking');
        };
    }, []);

    const filteredMessages =
        selectChat
            ? messages.filter(
                (message) =>
                    message.user === 'ChatBot' || message.user === username
            )
            : messages.filter(
                (message) =>
                    message.user !== 'ChatBot'
            );

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loader]);

    return (
        <div className="xs:h-[76%] xl:h-[80%] py-2">
            <div className="flex relative flex-col h-full w-full px-2 py-2 overflow-y-auto">

                {selectChat && <div className="flex justify-center w-full pb-1"> <p className="text-sm font-bold italic"> Hablando con ChatBox </p> </div>}

                {filteredMessages.map((message, index) => {
                    const messageCopy = { ...message, time: message.time.slice(0, 5) };
                    return (
                        <div
                            key={index}
                            className={`flex flex-col w-full ${messageCopy.user === username ? 'items-end' : 'items-start'}`}
                        >
                            {(index === 0 || messageCopy.user !== filteredMessages[index - 1].user) && (
                                <div className="flex items-center mb-1">
                                    <h1 className="opacity-85 text-sm">{messageCopy.user}</h1>
                                    <div
                                        className={`w-6 h-6 rounded-full mx-1 ${messageCopy.user === 'greenpond' ? 'bg-green-500' : 'bg-blue-500'}`}
                                    />
                                </div>
                            )}

                            <div className='flex w-1/2 my-0.5'>
                                {messageCopy.image ? (
                                    <div className="flex flex-col bg-white mx-2 p-2 rounded-lg shadow-md">
                                        <div
                                            onClick={() => setFullScreen(!fullScreen)}
                                            className={`${fullScreen
                                                ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50'
                                                : ''
                                                }`}
                                        >
                                            <img
                                                src={messageCopy.image}
                                                alt="Mensaje con imagen"
                                                className={`${fullScreen ? 'xs:w-[35%] xl:w-[25%]' : ''}`}
                                            />
                                        </div>
                                        <p className="flex flex-col w-full">
                                            {messageCopy.text}
                                            <span className="text-end text-[11px]">
                                                {messageCopy.time}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full bg-white mx-2 p-2 rounded-lg shadow-md">
                                        {messageCopy.text}
                                        <span className="text-end text-[11px]">
                                            {messageCopy.time}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {loader && (
                    <div className="flex w-full justify-end my-0.5">
                        <div className="flex justify-center items-center bg-white xs:w-[46%] xl:w-[48%] rounded-lg shadow-md py-8 mx-2 p-2">
                            <div className="w-8 h-8 border-4 border-t-4 border-purple-500 border-solid rounded-full animate-spin border-t-transparent"></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />

                {botThinking && (
                    <div className="flex h-full items-end justify-start text-gray-500 text-sm pt-3">
                        <div className="w-4 h-4 border-2 border-t-2 border-gray-500 border-solid rounded-full animate-spin border-t-transparent mr-2"></div>
                        <span>Pensando...</span>
                    </div>
                )}

                {typingUser && (
                    <div className="flex h-full items-end justify-start text-gray-500 text-sm">
                        <span>{typingUser} está escribiendo...</span>
                    </div>
                )}
            </div>
        </div>
    );
};