import React, { useEffect, useState } from 'react';
import { setFirstMessages, setMessages } from '../store/store';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL, UPLOAD_PHP_URL } from '../config';

export const AddTicket = () => {
    const socket = io(API_URL);
    const { user, firstMessage } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const [affair, setAffair] = useState('');
    const [description, setDescription] = useState('');
    const [imageSelect, setImageSelect] = useState(null);

    useEffect(() => {
        setAffair('');
        setDescription('');
        setImageSelect('');
    }, [firstMessage]);

    const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await axios.post(UPLOAD_PHP_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                return response.data.imageUrl; // La URL de la imagen retornada por PHP
            } else {
                throw new Error(response.data.error); // El error detallado desde PHP
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert(`Error al subir la imagen: ${error.message}`); // Mostrar un mensaje con el error específico
            return null;
        }
    };

    const sendMessage = async (e) => {
        console.log('Pasa');

        e.preventDefault();

        if (!description.trim() && !affair.trim()) return;

        let imageUrl = '';

        if (imageSelect) {
            imageUrl = await uploadImage(imageSelect);
            if (!imageUrl) return;
        };

        console.log(imageUrl);

        const messageData = {
            usuario: user,
            asunto: affair,
            descripcion: description,
            date: new Date(),
            imagen: imageUrl,
            selectChat: true,
        };

        const botMessage = {
            user: "ChatBot",
            text: "Mensaje añadido",
            date: new Date().toISOString(),
            image: imageUrl,
        };

        socket.emit("sendMessage", messageData, false);
        dispatch(setFirstMessages(false));
        dispatch(setMessages([botMessage]));
    };

    return (
        <div className="flex flex-col w-full h-full justify-center px-32">
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
                    <span className='text-start px-2 top-0 font-semibold'>
                        Imagen <span className='text-sm italic'>(Opcional)</span>
                    </span>
                    <label htmlFor="file-upload" className="flex w-full justify-between items-center p-2 border bg-white border-black rounded-lg cursor-pointer">
                        <span> {imageSelect !== '' ? 'Imagen añadida' : '¿Quieres añadir una imagen?'} </span>
                        <FontAwesomeIcon icon={imageSelect !== '' ? faCheckCircle : faFileUpload} className={imageSelect !== '' ? 'text-green-600' : ''} />
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={(e) => setImageSelect(e.target.files[0])}
                        className="hidden"
                    />
                </div>

                <button
                    type="submit"
                    className='border rounded-lg my-2 p-2 bg-violet-600 text-white font-bold border-white hover:border-violet-600 hover:bg-white hover:text-violet-600'>
                    Enviar
                </button>
            </form>
        </div>
    );
};
