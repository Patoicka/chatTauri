import React from 'react'
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { setMessages } from '../store/store';
import { API_URL } from '../config';

export const DeleteTicket = () => {

    const socket = io(API_URL);
    const dispatch = useDispatch();

    const selectDelete = (type) => {
        console.log(type);

        if (type === 'all') {

            const botMessage = {
                user: "ChatBot",
                text: "Datos eliminados correctamente.",
                date: new Date().toISOString(),
                image: "",
            };

            socket.emit("deleteMessage", "all");
            socket.once("allMessagesDeleted", () => {
                dispatch(setMessages([botMessage]));
            });

        } else if (type === 'id') {
            const id = prompt("Ingrese el ID del mensaje a eliminar:");
            if (id) {
                console.log(`🗑 Eliminando mensaje con ID: ${id}`);
                socket.emit("deleteMessage", id);

                socket.once("messageDeleted", (deletedId) => {
                    console.log(`✅ Mensaje con ID ${deletedId} eliminado`);
                    dispatch(setMessages(messages.filter(msg => msg.id !== parseInt(deletedId))));
                });
            }
        }
    };

    return (
        <div className="flex flex-col w-full items-center px-32 mt-3">
            <h1 className='bg-white text-black font-semibold p-2 shadow-md rounded-full'> Selecciona una opción </h1>
            <div className='flex mt-2'>
                <button onClick={() => selectDelete('all')} className="bg-black rounded-full w-14 p-2 mx-2 text-white font-semibold"> Todos </button>
                <button onClick={() => selectDelete('id')} className="bg-black rounded-full w-14 p-2 mx-2 text-white font-semibold"> Id </button>
            </div>
        </div>
    )
}
