import React, { useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { useOnClickOutside } from '../../hooks/useClickOutSite';
import { capitalizeFirstLetter } from '../../functions/text';

export default function CustomSelect({ placeholder, defaultValue = '', options, onChange, recommend }: any) {
    const ref: any = useRef();
    useOnClickOutside(ref, () => {
        setIsOpen(false);
    })
    const [value, setValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='relative' ref={ref}>
            <div className="py-4 px-3 w-full bg-[#212121de] rounded-xl flex items-center justify-between" onClick={() => setIsOpen((prev) => !prev)}>
                <p className={`text-base font-medium text-white leading-[19px] ${!value && 'opacity-50'}`}>
                    {value ? value : placeholder}
                </p>
                <FaChevronDown size={16} className='mx-1' />
            </div>
            {recommend &&
                <div className='flex item-center gap-2 mt-2'>
                    {options.slice(0, 3).map((option: any, idx: number) =>
                        <div
                            className='bg-[#99FF4833] px-2 py-1 rounded-full'
                            key={idx}
                            onClick={() => {
                                setIsOpen(false);
                                setValue(capitalizeFirstLetter(option.type));
                                onChange(option.id);
                            }}
                        >
                            <p className='text-[#99FF48] text-[13px] leading-6 font-medium'>
                                {capitalizeFirstLetter(option.type)}
                            </p>
                        </div>
                    )}
                </div>
            }
            {isOpen &&
                <div className="px-3 bg-[#212121de] rounded-xl absolute left-0 right-0 bottom-1/2 z-50" style={{ height: 200, overflowY: 'scroll' }}>
                    {options.map((option: any, idx: number) =>
                        <p
                            key={idx}
                            className='py-2'
                            onClick={() => {
                                setIsOpen(false);
                                setValue(capitalizeFirstLetter(option.type));
                                onChange(option.id);
                            }}
                        >
                            {capitalizeFirstLetter(option.type)}
                        </p>
                    )}
                </div>
            }
        </div>
    )
}
