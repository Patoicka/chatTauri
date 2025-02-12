import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setFirstMessages, setMessages, setOptionResult } from '../store/store';

export const FindTicket = () => {
    const socket = io('http://localhost:4000');
    const { optionResult } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const selectSearch = (type) => {
        switch (type) {
            case 'all':
                socket.emit("findMessages");
                socket.once("foundMessages", (receivedMessages) => {

                    console.log(receivedMessages);

                    let botMessage;
                    if (receivedMessages.length !== 0) {
                        botMessage = {
                            user: "ChatBot",
                            text: "Estos son los resultados que encontré:",
                            date: new Date().toISOString(),
                            image: "",
                        };
                    } else {
                        botMessage = {
                            user: "ChatBot",
                            text: "No encontré ningun dato.",
                            date: new Date().toISOString(),
                            image: "",
                        };
                    }
                    dispatch(setFirstMessages(false));
                    dispatch(setOptionResult(receivedMessages));
                    dispatch(setMessages([botMessage]));
                });
                break;

            case 'id':
                break;

            default:
                break;
        }
    };

    return (
        <div className={`flex flex-col h-full w-full px-2 ${optionResult.length === 0 ? 'justify-end' : ''}`}>
            {optionResult.length !== 0 ? (
                <>
                    {optionResult.length > 0 && optionResult[0].usuario === "ChatBot" && (
                        <div className="mb-4 p-4 bg-gray-100 text-black rounded-lg shadow-md">
                            <strong>{optionResult[0].usuario}:</strong> {optionResult[0].descripcion}
                        </div>
                    )}
                    <div className="max-w-[50%] overflow-x-auto">
                        <table className="border border-black rounded-lg shadow-md border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left rounded-tl-lg">Usuario</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Asunto</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Mensaje</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Día</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left rounded-tr-lg">Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {optionResult.map((msg, index) => {
                                    console.log(msg);
                                    return (
                                        <tr key={index} className="border border-gray-300 bg-white ">
                                            <td className="border border-gray-300 px-4 py-2">{msg.usuario}</td>
                                            <td className="border border-gray-300 px-4 py-2">{msg.asunto}</td>
                                            <td className="border border-gray-300 px-4 py-2">{msg.descripcion}</td>
                                            <td className="border border-gray-300 px-4 py-2">{msg.date.slice(0, 10)}</td>
                                            <td className="border border-gray-300 px-4 py-2">{msg.date.slice(11, 16)} pm</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </>
            ) : (
                <>
                    <div className='flex flex-col w-full items-center px-40'>
                        <h1 className='bg-white text-black font-semibold p-2 shadow-md rounded-full'> Selecciona una opción </h1>
                        <div className='flex mt-2'>
                            <button onClick={() => selectSearch('all')} className="bg-black rounded-full w-14 p-2 mx-2 text-white font-semibold"> Todos </button>
                            <button onClick={() => selectSearch('id')} className="bg-black rounded-full w-14 p-2 mx-2 text-white font-semibold"> Por ID </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
