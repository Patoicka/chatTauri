export const Messages = ({ messages, username, typingUser }) => {

    console.log(typingUser);

    return (
        <div className="h-[80%] py-2">
            <div className="flex relative flex-col h-full w-full px-2 py-2 overflow-y-auto">
                {messages.map((message, index) => {
                    const time = message.time.slice(0, 5);
                    message.time = time;

                    return (
                        <div
                            key={index}
                            className={`flex flex-col w-full ${message.user === username ? 'items-end' : 'items-start'}`}
                        >
                            {(index === 0 || message.user !== messages[index - 1].user) && (
                                <div className="flex items-center mb-1">
                                    <h1 className="opacity-85 text-sm">{message.user}</h1>
                                    <div
                                        className={`w-6 h-6 rounded-full mx-1 ${message.user === 'greenpond' ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                    />
                                </div>
                            )}
                            <div className="flex w-1/2 my-0.5">
                                <p className="flex h-full w-full bg-white justify-between mx-2 p-2 rounded-lg shadow-md">
                                    {message.text}
                                    <span className={`flex h-full items-center text-xs ${message.user === username ? 'text-end ' : 'text-start'}`}>
                                        {message.time}
                                    </span>
                                </p>

                            </div>
                        </div>
                    )
                })}
                {typingUser && (
                    <div className="absolute bottom-0 text-gray-500 text-sm ">
                        {typingUser} está escribiendo...
                    </div>
                )}
            </div>
        </div>
    );
};
