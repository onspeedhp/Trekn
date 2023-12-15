import { prominent } from 'color.js';
import React, { useEffect, useState } from 'react'

export default function FollowAccountItem({ item, userId, key }: any) {
    const [borderColor, setBorderColor] = useState<any>("");

    const getColorBorder = async (url: string) => {
        const color = await prominent(url, { amount: 1, format: 'hex' })
        setBorderColor(color);
    }

    useEffect(() => {
        getColorBorder(item.profileImage);
    }, [item])
    return (
        <div className="flex items-center justify-between" key={key}>
            <div className="flex items-center gap-[10px]">
                <div className={`rounded-full p-[1px] w-12 h-12 overflow-hidden border box-content`}
                style={{borderColor}}>
                    <img src={item.profileImage} alt="" className='w-full h-full object-center object-cover rounded-full' />
                </div>
                <div className="font-medium text-base leading-5 max-w-[50%] text-ellipsis overflow-hidden whitespace-nowrap">{item.name}</div>
            </div>
            {userId ?
                <>
                </>
                :
                <>
                </>
            }
        </div>
    )
}
