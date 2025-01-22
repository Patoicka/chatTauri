import { useState } from "react";

export const Messages = ({ messages, username, typingUser }) => {
    console.log(messages);

    const [fullScreen, setFullScreen] = useState(false);
    return (
        <div className="xs:h-[76%] xl:h-[80%] py-2">
            <div className="flex relative flex-col h-full w-full px-2 py-2 overflow-y-auto">
                {messages.map((message, index) => {
                    const messageCopy = { ...message, time: message.time.slice(0, 5) };

                    return (
                        <div
                            key={index}
                            className={`flex flex-col w-full ${messageCopy.user === username ? 'items-end' : 'items-start'}`}
                        >
                            {(index === 0 || messageCopy.user !== messages[index - 1].user) && (
                                <div className="flex items-center mb-1">
                                    <h1 className="opacity-85 text-sm">{messageCopy.user}</h1>
                                    <div
                                        className={`w-6 h-6 rounded-full mx-1 ${messageCopy.user === 'greenpond' ? 'bg-green-500' : 'bg-blue-500'}`}
                                    />
                                </div>
                            )}
                            <div className="flex w-1/2 my-0.5">
                                {messageCopy.image ? (
                                    <div className="flex flex-col bg-white mx-2 p-2 rounded-lg shadow-md">
                                        <div
                                            onClick={() => setFullScreen(!fullScreen)}
                                            className={`${fullScreen
                                                ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50'
                                                : ''
                                                }`}
                                        >
                                            <img
                                                src={messageCopy.image}
                                                alt="Mensaje con imagen"
                                                className={`${fullScreen ? 'xs:w-[35%] xl:w-[25%]' : ''}`}
                                            />
                                        </div>
                                        <p className="flex flex-col w-full">
                                            {messageCopy.text}
                                            <span className="text-end text-[11px]">
                                                {messageCopy.time}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full bg-white mx-2 p-2 rounded-lg shadow-md">
                                        {messageCopy.text}
                                        <span className="text-end text-[11px]">
                                            {messageCopy.time}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {typingUser && (
                    <div className="absolute bottom-0 text-gray-500 text-sm ">
                        {typingUser} está escribiendo...
                    </div>
                )}

            </div>
        </div >
    );
};
