import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChat } from '../store/store';

export const Home = ({ newUsername }) => {

    const { users, user } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const goChat = (username) => {
        newUsername(username);
        dispatch(setHome(false));
    };

    const goBot = (username) => {
        newUsername(username)
        dispatch(setChat(true));
        dispatch(setHome(false));
    };

    const selectUser = (name) => {
        dispatch(setUser(name));
    };

    return (
        <div>
            <div div className='px-8 py-4 border-b-2 border-gray-400 bg-white'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-4xl font-bold'> Chats </h1>
                    {users
                        .filter(bot => bot.username === 'ChatBot')
                        .map((bot) => {
                            return (
                                <FontAwesomeIcon icon={bot.image} size='2xl' className='cursor-pointer' onClick={() => goBot(bot.username)} />
                            )
                        })
                    }
                </div>
                <div className='flex items-center pt-2'>
                    <p className='opacity-80'> Bienvenido. </p>
                    <div className='flex pl-4'>
                        <h1 className={`mx-2 cursor-pointer ${user === 'greenpond' ? 'border-b-2 border-green-500' : null}`} onClick={() => selectUser('greenpond')}> GreenPond </h1>
                        <h1 className={`mx-2 cursor-pointer ${user === 'bluepond' ? 'border-b-2 border-blue-500' : null}`} onClick={() => selectUser('bluepond')}> BluePond </h1>
                    </div>
                </div >
            </div >
            {
                user !== '' &&
                <div className='pt-4'>
                    {users
                        .filter(newUser => newUser.username !== user && newUser.username !== 'ChatBot')
                        .map((newUser, index) => {
                            return (
                                <div key={index} className='flex relative flex-col w-full h-full px-4 py-2'>
                                    <div className='border-t-2 w-full ' />
                                    <div
                                        onClick={() => goChat(newUser.username)}
                                        className='flex items-center h-full pt-3 cursor-pointer'
                                    >
                                        <FontAwesomeIcon icon={newUser.image} size='xl' className='min-w-7 h-7 p-2 bg-neutral-200 rounded-full' />
                                        <h1 className='pl-2 w-full h-full text-lg'> {newUser.username} </h1>
                                    </div>
                                    {/* <p className='absolute -bottom-1.5 px-12 text-sm'> Sin mensajes </p> */}
                                </div>
                            );
                        })
                    }
                </div>
            }
        </div >
    )
};
