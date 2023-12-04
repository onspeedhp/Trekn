import React from 'react'

interface customiseInputProps {
    label: string | null;
    onChange: CallableFunction;
    value?: string;
    itemKey?: string;
    style?: string;
    placeholder?: string;
    leftIco?: any
}

export default function CustomiseInputWIco({ value = '', label, onChange, style = 'light', placeholder, leftIco }: customiseInputProps) {
    return (
        <div>
            {label &&
                <label className='text-[13px] text-[#000000b3] font-medium leading-4'>{label}</label>
            }
            <div className={`py-4 px-3 rounded-xl overflow-hidden ${style === 'dark' ? 'bg-[#212121de] text-white' : 'border'} flex items-center gap-2`}>
                {leftIco}
                <input type="text" className='w-full focus-visible:outline-none text-base font-medium bg-transparent' value={value} placeholder={placeholder} />
            </div>
        </div>
    )
}
