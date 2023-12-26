import { Button } from 'antd'
import React from 'react'

export default function EnableLocationComponent() {
    const tutorial: Array<string> = [
        'Go to your device\'s Settings.',
        'Find your browser app in the list and tap on it.',
        'Select \'Location\' and choose \'While Using the App\'.'
    ]
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen pb-20 px-5">
            <img src='/geotag.png' alt='' className='object-cover object-center w-[82px] h-[124px] mb-6' />
            <div className="flex flex-col gap-3 px-3">
                <p className='text-[15px] leading-6 font-medium'>To help you discover the best around you, we need your location access.</p>
                <div className="h-[1px] bg-[#D9D9D994]" />
                <p className='text-[15px] leading-6 font-medium text-[#00000080]'>
                    How to Enable Location Access:
                </p>
                {tutorial.map((text: string) =>
                    <div className="flex items-center gap-3 py-2">
                        <div className="w-2 h-2 rounded-full bg-[#99FF48]" />
                        <p className='text-[15px] leading-[18px] font-medium'>
                            {text}
                        </p>
                    </div>
                )}

            </div>
            <Button className=' rounded-3xl bg-black w-full h-fit py-3 border-none mt-4'>
                <span className='font-semibold text-base text-white leading-6 text-center'>
                    Enable
                </span>
            </Button>
        </div>
    )
}
