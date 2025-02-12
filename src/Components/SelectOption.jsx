import React from 'react'
import { setChatOption, setOptionType } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';

export const SelectOption = () => {

    const dispatch = useDispatch();

    const selectOption = (option) => {
        switch (option) {
            case 'find':
                dispatch(setChatOption(true));
                dispatch(setOptionType('find'));
                break;

            case 'add':
                dispatch(setChatOption(true));
                dispatch(setOptionType('add'));
                console.log('Crear');
                break;

            case 'delete':
                dispatch(setChatOption(true));
                dispatch(setOptionType('delete'));
                console.log('Eliminar');
                break;

            default:
                break;
        };
    };

    return (
        <div className='flex w-full justify-around px-20 mt-3'>
            <button onClick={() => selectOption('find')} className="bg-black rounded-full p-2 text-white font-semibold"> Buscar Ticket </button>
            <button onClick={() => selectOption('add')} className="bg-black rounded-full p-2 text-white font-semibold"> Crear Ticket </button>
            <button onClick={() => selectOption('delete')} className="bg-black rounded-full p-2 text-white font-semibold"> Eliminar Ticket </button>
        </div>
    )
}
