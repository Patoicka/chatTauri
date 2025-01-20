import React from 'react';

export const Messages = ({ messages, username }) => {
    return (
        <div className='h-[80%] py-2'>
            <div className="flex flex-col h-full w-full px-2 py-2 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex flex-col w-full ${message.user === username ? 'items-end' : 'items-start'}`}
                    >
                        {(index === 0 || message.user !== messages[index - 1].user) && (
                            <div className="flex items-center mb-1">
                                <h1 className="opacity-85 text-sm">{message.user}</h1>
                                <div className={`w-6 h-6 rounded-full mx-1 ${message.user === 'greenpond' ? 'bg-green-500' : 'bg-blue-500'}`} />
                            </div>
                        )}
                        <div className="bg-white mx-4 my-0.5 p-2 rounded-lg shadow-md w-1/2">
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
