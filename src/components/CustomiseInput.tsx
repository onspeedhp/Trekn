import React, { useEffect, useRef } from 'react'

interface customiseInputProps {
    type?: string;
    value: string;
    label: string;
    itemKey: string;
    onChange: CallableFunction;
}

export default function CustomiseInput({ type = 'input', value = '', label, onChange, itemKey }: customiseInputProps) {
    const textAreaRef: any = useRef(null);

    const resizeTextArea = () => {
        if (textAreaRef.current && textAreaRef.current.style.height >= '128px') {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    };

    useEffect(() => {
        if (type === 'textarea') {
            resizeTextArea();
        }
    }, [value]);

    const handleOnChange = (value: string) => {
        onChange(itemKey,value);
    }
    return (
        <div>
            <label className='text-[13px] text-[#000000b3] font-medium leading-4'>{label}</label>
            <div className="border rounded-xl overflow-hidden mt-1">
                {type === 'input' &&
                    <input onChange={(e) => { handleOnChange(e.currentTarget.value) }} type="text" className='py-4 px-3 w-full focus-visible:outline-none text-base font-medium' value={value} />
                }
                {type === 'textarea' &&
                    <textarea onChange={(e) => { handleOnChange(e.currentTarget.value) }} ref={textAreaRef} value={value}
                        className="py-4 px-3 w-full focus-visible:outline-none text-base font-medium leading-6 resize-none h-32"
                    />
                }
            </div>
        </div>
    )
}
