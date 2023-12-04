import React from 'react'
import { FaSearch } from 'react-icons/fa';

interface customiseInputProps {
    value: string;
    label: string | null;
    itemKey?: string;
    onChange: CallableFunction;
}

export default function CustomiseInputWIco({ value = '', label, onChange }: customiseInputProps) {

    return (
        <div>
            {label && 
            <label className='text-[13px] text-[#000000b3] font-medium leading-4'>{label}</label>
            }
            <div className="border rounded-xl overflow-hidden mt-1">
                <input type="text" className='py-4 px-3 w-full focus-visible:outline-none text-base font-medium' value={value} />
            </div>
        </div>
    )
}
