import { faArrowLeft, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { setChat, setChatOption, setMessages, setOptionType } from '../store/store';

export const Header = ({ newUsername }) => {

    const dispatch = useDispatch();

    // const goBack = () => {
    //     dispatch(setChat(false));
    //     dispatch(setHome(true));
    // };

    const clearMessages = () => {
        console.log('Limpia');
        dispatch(setMessages([]));
        dispatch(setChatOption(false));
        dispatch(setOptionType(''));
    };

    return (
        <div className="bg-white h-[12%] rounded-b-lg">
            <div className="flex w-full justify-between h-full px-4 items-center">
                {/* <FontAwesomeIcon icon={faArrowLeft} size='lg' className='pr-4 cursor-pointer' onClick={goBack} /> */}
                <div className='flex items-center'>
                    <div className={`flex w-10 h-10 rounded-full items-center justify-center ${newUsername === 'greenpond' ? 'bg-green-500' : newUsername === 'bluepond' ? 'bg-blue-500' : 'bg-violet-600'}`}>
                        < FontAwesomeIcon icon={faRobot} color='#ffffff' size='lg' />
                    </div>
                    <h1 className='text-2xl font-semibold pl-2'> ChatBot </h1>
                </div>

                <button onClick={clearMessages} className='p-2 rounded-full text-white font-semibold bg-violet-600'>
                    Limpiar
                </button>

            </div>
        </div >
    );
};
