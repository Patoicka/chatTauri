import React, { useState } from 'react';

export const Input = ({ handleSend }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const now = new Date();
        const formattedTime = now.toLocaleTimeString();

        handleSend(message, formattedTime);
        setMessage('');

    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex relative bg-white h-[8%] w-full items-center rounded-lg'
        >
            <input
                value={message}
                onChange={(e) => handleChange(e)}
                placeholder='Escribe un mensaje y presiona ENTER'
                type='text'
                className='bg-white h-full w-full px-3 rounded-lg'
            />
            <button
                type='submit'
                className='absolute right-0 mx-3 bg-violet-700 p-2 text-gray-200 text-sm rounded-lg'
            >
                Enviar
            </button>
        </form>
    );
};
