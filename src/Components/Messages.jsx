import { faCheckCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setMessages } from "../store/store";
import { AddTicket } from "./AddTicket";
import { FindTicket } from "./FindTicket";
import { DeleteTicket } from "./DeleteTicket";
import { SelectOption } from "./SelectOption";
import { API_URL } from "../config";

const socket = io(API_URL);

export const Messages = ({ messages: initialMessages, typingUser }) => {
    const { loader, selectChat, user, messages, optionType, chatOption, firstMessage } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);

    const [fullScreen, setFullScreen] = useState(false);
    const [botThinking, setBotThinking] = useState(false);
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);

    useEffect(() => {
        socket.on('thinking', (thinking) => {
            setBotThinking(thinking);
        });

        return () => {
            socket.off('thinking');
        };
    }, []);

    const filteredMessages = selectChat
        ? initialMessages.filter(
            (message) => message.user === 'ChatBot' || message.user === user
        )
        : initialMessages.filter(
            (message) => message.user !== 'ChatBot'
        );

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loader]);

    const handleRightClick = (index, e) => {
        e.stopPropagation();
        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        } else {
            setActiveMenuIndex(index);
        }
    };

    const goOptions = (e, index) => {
        e.stopPropagation();
        if (editingMessageId === index) {
            setEditingMessageId(null);
        } else {
            setEditingMessageId(index);
        }
    };

    const updateMessage = (index, newText) => {
        const updatedMessages = [...filteredMessages];

        updatedMessages[index].text = newText;
        dispatch(setMessages(updatedMessages));

        const editedMessage = updatedMessages[index];
        socket.emit('editMessage', editedMessage);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeMenuIndex !== null) {
                setActiveMenuIndex(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeMenuIndex]);

    return (
        <div className="xs:h-[76%] xl:h-[80%] py-2">
            <div className="flex relative flex-col h-full w-full px-2 py-2 overflow-y-auto">
                {messages.map((message, index) => {
                    const messageCopy = { ...message, date: message.date.slice(0, 5) };
                    return (
                        <div
                            key={index}
                            className={`flex flex-col w-full ${messageCopy.user === user ? 'items-end' : 'items-start'}`}
                        >
                            {(index === 0 || messageCopy.user !== messages[index - 1].user) && (
                                <div className='flex items-center mb-1'>
                                    <h1 className="opacity-85 text-sm">{messageCopy.user}</h1>
                                    <div
                                        className={`w-6 h-6 rounded-full mx-1 
                                            ${messageCopy.user === 'greenpond'
                                                ? 'bg-green-500' : messageCopy.user === 'bluepond'
                                                    ? 'bg-blue-500' : messageCopy.user === 'ChatBot'
                                                        ? 'bg-violet-600' : null}`}
                                    />
                                </div>
                            )}

                            <div className={`flex  items-center w-1/2 my-0.5 ${messageCopy.user === user ? 'justify-end' : 'justify-start'}`}>
                                {activeMenuIndex === index && messageCopy.user === user && (
                                    <div
                                        className="flex cursor-pointer justify-center bg-white text-gray-600 w-1/12 mx-2 p-2 rounded-lg shadow-md"
                                        onClick={(e) => goOptions(e, index)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </div>
                                )}
                                {messageCopy.image ? (
                                    <div className="flex flex-col bg-white w-11/12 mx-2 p-2 rounded-lg shadow-md">
                                        <div
                                            onClick={() => setFullScreen(!fullScreen)}
                                            className={`${fullScreen
                                                ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 flex justify-center items-center z-50'
                                                : ''
                                                }`}
                                        >
                                            <img
                                                src={messageCopy.image}
                                                alt="Mensaje con imagen"
                                                className={`${fullScreen
                                                    ? 'max-w-[95vw] max-h-[95vh] object-contain'
                                                    : ''
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex flex-col relative w-full">
                                            {editingMessageId === index ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={messageCopy.text}
                                                        onChange={(e) => {
                                                            updateMessage(index, e.target.value);
                                                        }}
                                                        onBlur={() => setEditingMessageId(null)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                updateMessage(index, e.target.value);
                                                                setEditingMessageId(null);
                                                            }
                                                        }}
                                                        className="w-full border border-gray-300 pr-7 rounded p-1 focus:outline-none focus:border-2 focus:gray-blue-500 focus:rounded"
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                        className="absolute mx-4 cursor-pointer text-gray-500 hover:text-purple-700"
                                                        onClick={() => setEditingMessageId(null)}
                                                    />
                                                </>
                                            ) : (
                                                <p className="break-words break-all whitespace-pre-wrap overflow-hidden">{messageCopy.text}</p>
                                            )}
                                            <span className="text-end text-[11px]">
                                                {messageCopy.time}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-11/12 justify-center relative bg-white mx-2 p-2 rounded-lg shadow-md">
                                        {editingMessageId === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={messageCopy.text}
                                                    onChange={(e) => {
                                                        updateMessage(index, e.target.value);
                                                    }}
                                                    onBlur={() => setEditingMessageId(null)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            updateMessage(index, e.target.value);
                                                            setEditingMessageId(null);
                                                        }
                                                    }}
                                                    className="w-full border border-gray-300 pr-7 rounded p-1 focus:outline-none focus:border-2 focus:gray-blue-500 focus:rounded"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="absolute top-[18px] right-3 cursor-pointer text-gray-500 hover:text-purple-700"
                                                    onClick={() => setEditingMessageId(null)}
                                                />
                                            </>
                                        ) : (
                                            <p className="text-justify break-words whitespace-pre-wrap overflow-hidden">
                                                {messageCopy.text}
                                            </p>
                                        )}
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
                    <div className="flex h-full items-end justify-start text-neutral-900 text-sm pt-3">
                        <div className="w-4 h-4 border-2 border-t-2 border-neutral-900 border-solid rounded-full animate-spin border-t-transparent mr-2"></div>
                        <span>Pensando...</span>
                    </div>
                )}

                {typingUser && (
                    <div className="flex h-full items-end justify-start text-gray-500 text-sm">
                        <span>{typingUser} está escribiendo...</span>
                    </div>
                )}

                {firstMessage ?
                    <div className="flex flex-col h-full w-full items-center justify-end text-sm">
                        <p className={`bg-white text-black font-semibold p-2 shadow-md rounded-full ${optionType === '' ? 'block' : 'hidden'}`}>
                            ¿Cómo puedo ayudar?
                        </p>
                        {chatOption ?
                            <>
                                {optionType === 'find' ? <FindTicket /> : null}

                                {optionType === 'add' ? <AddTicket /> : null}

                                {optionType === 'delete' ? <DeleteTicket /> : null}
                            </>
                            : <SelectOption />}
                    </div>
                    : null}

            </div>
        </div >
    );
};