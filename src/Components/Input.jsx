import { faCamera, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFirstMessages, setLoader } from '../store/store';
import { API_URL } from '../config';

export const Input = ({ handleSend, handleTyping }) => {

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [imageSelect, setImageSelect] = useState(null);
    const [isImageFullScreen, setIsImageFullScreen] = useState(false);

    useEffect(() => {
        if (message.length > 0) {
            dispatch(setFirstMessages(false));
        } else dispatch(setFirstMessages(true));
    }, [message]);

    const handleChange = (e) => {
        setMessage(e.target.value);

        if (handleTyping) {
            if (typingTimeout) clearTimeout(typingTimeout);

            handleTyping(true);

            const timeout = setTimeout(() => {
                handleTyping(false);
            }, 800);

            setTypingTimeout(timeout);
        };
    };

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSelect(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim() === '' && !imageSelect) return;

        const now = new Date();
        const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        let imageUrl = imageSelect || '';
        let messageCopy = message;
        let timeCoppy = formattedTime;

        console.log(timeCoppy);

        setMessage('');
        setImageSelect(null);

        if (imageSelect) {
            try {
                const response = await fetch(`${API_URL}/upload-image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageUrl }),
                });

                const data = await response.json();
                if (data.url) {
                    imageUrl = data.url;
                }
                dispatch(setLoader(false));
            } catch (error) {
                console.error('Error al subir la imagen:', error);
                dispatch(setLoader(false));
            };
        };
        handleSend(messageCopy, timeCoppy, imageUrl);

        dispatch(setLoader(false));
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
                className="absolute left-0 mx-2 bg-violet-700 p-2 text-gray-200 text-sm rounded-lg"
            >
                <FontAwesomeIcon icon={faCamera} size="lg" />
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
                className={`bg-white h-full w-full rounded-lg pl-14 ${imageSelect ? 'pr-[108px]' : 'pr-14'}`}
            />

            {imageSelect && (
                <div className='absolute right-14 rounded-lg overflow-hidden'>
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
                className='absolute right-0 mx-2 bg-violet-700 p-2 text-gray-200 text-sm rounded-lg'
            >
                <FontAwesomeIcon icon={faPaperPlane} size='lg' />
            </button>

            {isImageFullScreen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-85 flex justify-center items-center z-50">
                    <div className="flex w-full items-center justify-center xs:p-10 sm:p-20 md:p-24 lg:p-56 xl:p-24">
                        <div className="relative xs:w-[100%] sm:w-[65%] md:w-[51%] lg:w-[40%] xl:w-[25%] bg-white rounded-xl shadow-lg overflow-hidden">
                            <img
                                src={imageSelect}
                                alt="Imagen en pantalla completa"
                                className="rounded-xl w-full h-full object-contain"
                            />
                            <button
                                onClick={closeFullScreenImage}
                                className="absolute right-2 top-1 text-white text-xl hover:text-red-600"
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </form>
    );
};
