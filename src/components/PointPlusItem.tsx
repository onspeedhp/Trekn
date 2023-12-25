import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

interface pointPlusItemProps {
    icon?: boolean,
    point: string,
}

export default function PointPlusItem({ point, icon }: pointPlusItemProps) {
    return (
        <div className={`bg-[#99FF4833] text-[#99FF48] rounded-full text-[13px] font-medium flex items-center w-fit gap-[6px] ${icon ? 'py-0.5 pl-1 pr-3' : 'px-2 leading-6'}`}>
            {icon && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <g clip-path="url(#clip0_2493_130)">
                    <path d="M31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43956 31.5 0.5 24.5604 0.5 16C0.5 7.43956 7.43956 0.5 16 0.5C24.5604 0.5 31.5 7.43956 31.5 16ZM14.2071 24.2071L25.7071 12.7071C26.0976 12.3166 26.0976 11.6834 25.7071 11.2929L24.2929 9.87875C23.9024 9.48819 23.2692 9.48819 22.8787 9.87875L13.5 19.2574L9.12131 14.8787C8.73081 14.4882 8.09763 14.4882 7.70706 14.8787L6.29287 16.2929C5.90237 16.6834 5.90237 17.3166 6.29287 17.7071L12.7929 24.2071C13.1834 24.5976 13.8166 24.5976 14.2071 24.2071V24.2071Z" fill="#66C61B" />
                </g>
                <defs>
                    <clipPath id="clip0_2493_130">
                        <rect width="32" height="32" fill="white" />
                    </clipPath>
                </defs>
            </svg>}
            <p>+{point} points</p>
        </div>
    )
}
