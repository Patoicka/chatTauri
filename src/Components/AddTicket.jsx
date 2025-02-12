import React, { useState } from 'react'
import { setMessages } from '../store/store';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

export const AddTicket = () => {

    const socket = io('http://localhost:4000');

    const { user } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const [affair, setAffair] = useState('');
    const [description, setDescription] = useState('');

    const sendMessage = () => {
        if (!description.trim() && !affair.trim()) return;

        const messageData = {
            usuario: user,
            asunto: affair,
            descripcion: description,
            date: new Date(),
            imagen: '',
            selectChat: true,
        };

        socket.emit("sendMessage", messageData);

        // dispatch(setMessages([...messages, messageData]));
        // setNewTicket("");
    };


    return (
        <div className="flex flex-col w-full items-center px-32 mt-3">
            <form onSubmit={sendMessage} className="flex flex-col w-full text-center">
                <span className="font-bold text-lg uppercase"> Ayuda </span>

                <div className='flex flex-col w-full mt-2'>
                    <span className='text-start px-2 top-0 font-semibold'> Asunto </span>
                    <input
                        type="text"
                        className='rounded-lg w-full p-2 border border-black'
                        onChange={(e) => setAffair(e.target.value)}
                    />
                </div>

                <div className='flex flex-col w-full mt-2'>
                    <span className='text-start px-2 top-0 font-semibold'> Descripción </span>
                    <textarea
                        type="text"
                        className="rounded-lg w-full h-40 resize-none p-2 border border-black"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className='flex flex-col w-full my-2'>
                    <span className='text-start px-2 top-0 font-semibold'> Imagen <span className='text-sm italic'> (Opcional) </span> </span>
                    <input
                        type="text"
                        className=""
                    />
                </div>

                <button type='submit' className='border rounded-lg my-2 p-2 bg-violet-600 text-white font-bold border-white hover:border-violet-600 hover:bg-white hover:text-violet-600'>
                    Enviar
                </button>

            </form>
        </div>
    )
}
