import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';

export const Input = ({ handleSend, handleTyping }) => {
    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [imageSelect, setImageSelect] = useState(null);
    const [isImageFullScreen, setIsImageFullScreen] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);

        if (handleTyping) {
            if (typingTimeout) clearTimeout(typingTimeout);

            handleTyping(true);

            const timeout = setTimeout(() => {
                handleTyping(false);
            }, 800);

            setTypingTimeout(timeout);
        }
    };

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageSelect(URL.createObjectURL(file));
    };

    const handleFileChange = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const now = new Date();
        const formattedTime = now.toLocaleTimeString();

        handleSend(message, formattedTime, imageSelect);

        setMessage('');
        setImageSelect(null);
    };

    const handleImageClick = () => {
        setIsImageFullScreen(true);
    };

    const closeFullScreenImage = () => {
        setIsImageFullScreen(false);
    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex relative bg-white xs:h-[12%] xl:h-[8%] w-full items-center rounded-lg'
        >
            <button
                type='button'
                onClick={handleFileChange}
                className="absolute left-0 mx-2 bg-violet-700 p-1 text-gray-200 text-sm rounded-lg"
            >
                <FontAwesomeIcon icon={faCamera} size="xl" />
            </button>

            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleAddImage}
            />
            <input
                value={message}
                onChange={(e) => handleChange(e)}
                placeholder='Escribe un mensaje...'
                type='text'
                className={`bg-white h-full w-full rounded-lg pl-11 ${imageSelect ? 'pr-[120px]' : 'pr-16'}`}
            />

            {imageSelect && (
                <div className='absolute right-16 rounded-lg overflow-hidden'>
                    <div className='relative'>
                        <FontAwesomeIcon
                            onClick={() => setImageSelect(null)}
                            icon={faTimes}
                            className='absolute right-0 cursor-pointer px-0.5 py-0.5'
                            color='#ffffff'
                            size='sm'
                        />
                        <img
                            src={imageSelect}
                            alt='imagen'
                            className='xs:w-8 xl:w-12 xs:h-8 xl:h-12 object-cover cursor-pointer'
                            onClick={handleImageClick}
                        />
                    </div>
                </div>
            )}

            <button
                type='submit'
                className='absolute right-0 mx-2 bg-violet-700 p-1.5 text-gray-200 text-sm rounded-lg'
            >
                Enviar
            </button>

            {isImageFullScreen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="flex justify-center w-full relative">
                        <img src={imageSelect} alt="Imagen en pantalla completa" className="xs:w-[50%] xl:w-[30%]" />
                        <button
                            onClick={closeFullScreenImage}
                            className="absolute xs:right-52 xl:right-[680px] top-1 text-white text-xl"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};
