import React from 'react'
import { io } from 'socket.io-client';

export const FindTicket = () => {

    const socket = io('http://localhost:4000');

    const selectSearch = (type) => {
        switch (type) {
            case 'all':
                socket.emit("findMessages");

                socket.once("foundMessages", (receivedMessages) => {
                    console.log("Mensajes recibidos:", receivedMessages);

                    // const botMessages = receivedMessages.map(msg => ({
                    //     ...msg,
                    //     user: 'ChatBot'
                    // })); 

                    // dispatch(setMessages([
                    //     ...messages,
                    //     { user: 'ChatBot', text: "Estos son los resultados:", time: new Date().toLocaleTimeString().slice(0, 5) },
                    //     ...botMessages
                    // ]));
                });
                break;

            case 'id':
                break;

            default:
                break;
        }
    };

    return (
        <div className="flex flex-col items-center w-full px-32 mt-3">
            <h1 className='bg-white text-black font-semibold p-2 shadow-md rounded-full'> Selecciona una opción </h1>
            <div className='flex mt-2'>
                <button onClick={() => selectSearch('all')} className="bg-black rounded-full w-14 p-2 mx-2 text-white font-semibold"> Todos </button>
                <button onClick={() => selectSearch('all')} className="bg-black rounded-full w-14 p-2 mx-2 text-white font-semibold"> Por ID </button>
            </div>
        </div>
    )
}
