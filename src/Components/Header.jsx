import { faCheck, faRobot, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChat } from '../store/store';

export const Header = ({ newUsername }) => {

    const { selectChat } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');

    const handleUsername = (name) => {
        setUsername(name);
        newUsername(name);
    };

    const checkBot = () => {
        dispatch(setChat(!selectChat));
    };

    useEffect(() => {
        if (username) {
            handleUsername(username);
        }
    }, [username]);

    return (
        <div className="bg-white h-[12%] rounded-lg">
            <div className="flex flex-col h-full px-2 justify-center">
                {!selectChat ?
                    <div div className='flex justify-between px-2 py-1'>
                        <h1 className="font-semibold"> 2 usuarios conectados </h1>
                        <h1 className='flex'>
                            <p className='pr-2'> Bot </p>
                            <input type="radio" name="Bot" onClick={checkBot} checked={selectChat ? true : false} />
                        </h1>
                    </div>
                    :
                    <div className='flex justify-between px-2 py-1'>
                        <h1 className="flex items-center font-semibold"> ChatBox  <FontAwesomeIcon className='pl-1.5 mb-0.5' icon={faRobot} /> </h1>
                        <div className='flex'>
                            <h1 className='flex'>
                                <p className='pr-2'> Bot </p>
                                <input type="radio" name="Bot" onClick={checkBot} checked={selectChat ? true : false} />
                            </h1>

                        </div>
                    </div>
                }
                <div className="flex">
                    {!selectChat ?
                        <>
                            <div onClick={() => handleUsername('bluepond')} className="flex h-full items-center cursor-pointer">
                                <div className="w-6 h-6 rounded-full bg-blue-500 mx-1" />
                                <h1 className="opacity-85">bluepond {username === 'bluepond' && <span className='font-bold'> (you) </span>} </h1>
                            </div>
                            <div onClick={() => handleUsername('greenpond')} className="flex h-full items-center mx-3 cursor-pointer">
                                <div className="w-6 h-6 rounded-full bg-green-500 mx-1" />
                                <h1 className="opacity-85">greenpond {username === 'greenpond' && <span className='font-bold'> (you) </span>} </h1>
                            </div>
                        </>
                        :
                        <>
                            {selectChat && username === 'bluepond' ?
                                <div onClick={() => handleUsername('bluepond')} className="flex h-full items-center cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 mx-1" />
                                    <h1 className="opacity-85">bluepond {username === 'bluepond' && <span className='font-bold'> (you) </span>} </h1>
                                </div>
                                :
                                <div onClick={() => handleUsername('greenpond')} className="flex h-full items-center cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-green-500 mx-1" />
                                    <h1 className="opacity-85">greenpond {username === 'greenpond' && <span className='font-bold'> (you) </span>} </h1>
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </div >
    );
};
