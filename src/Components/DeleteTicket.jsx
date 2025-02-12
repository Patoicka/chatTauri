import React from 'react'
import { io } from 'socket.io-client';

export const DeleteTicket = () => {

    const socket = io('http://localhost:4000');

    const selectDelete = (type) => {
        console.log(type);

        if (type === 'all') {
            console.log('🗑 Eliminando todos los mensajes...');
            socket.emit("deleteMessage", "all");

            socket.once("allMessagesDeleted", () => {
                console.log("✅ Todos los mensajes han sido eliminados");
                dispatch(setMessages([]));
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
