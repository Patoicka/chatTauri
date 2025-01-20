import React, { useEffect, useState } from 'react';

export const Header = ({ newUsername }) => {
    const [username, setUsername] = useState('');
    console.log(username);

    const handleUsername = (name) => {
        setUsername(name);
        newUsername(name);
    };

    useEffect(() => {
        if (username) {
            handleUsername(username);
        }
    }, [username]);

    return (
        <div className="bg-white h-[12%] rounded-lg">
            <div className="flex flex-col h-full px-2 justify-center">
                <h1 className="font-semibold"> 2 usuarios conectados </h1>
                <div className="flex">
                    <div onClick={() => handleUsername('bluepond')} className="flex h-full items-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-blue-500 mx-1" />
                        <h1 className="opacity-85">bluepond {username === 'bluepond' && <span className='font-bold'> (you) </span>} </h1>
                    </div>
                    <div onClick={() => handleUsername('greenpond')} className="flex h-full items-center mx-3 cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-green-500 mx-1" />
                        <h1 className="opacity-85">greenpond {username === 'greenpond' && <span className='font-bold'> (you) </span>} </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};
