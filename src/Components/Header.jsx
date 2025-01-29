
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChat, setHome } from '../store/store';

export const Header = ({ newUsername }) => {
    console.log(newUsername);
    const { user } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const goBack = () => {
        dispatch(setChat(false));
        dispatch(setHome(true));
    };

    return (
        <div className="bg-white h-[12%] rounded-b-lg">
            <div className="flex h-full px-4 items-center">
                <FontAwesomeIcon icon={faArrowLeft} size='lg' className='pr-4 cursor-pointer' onClick={goBack} />
                <div className={`flex w-10 h-10 rounded-full items-center justify-center ${newUsername === 'greenpond' ? 'bg-green-500' : newUsername === 'bluepond' ? 'bg-blue-500' : 'bg-violet-600'}`}>
                    < FontAwesomeIcon icon={newUsername !== 'chatBox' ? faUser : faBot} color='#ffffff' size='lg' />
                </div>
                <h1 className='text-2xl font-semibold pl-2'> {newUsername} </h1>
            </div>
        </div >
    );
};
