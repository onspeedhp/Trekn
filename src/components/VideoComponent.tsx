import React from 'react'
import { FaVolumeMute } from 'react-icons/fa'

interface videoComponentProps {
    muted: boolean;
    videoRef: any;
    src: string;
    onClick?: any;
    className?: string;
}

export default function VideoComponent({ muted, videoRef, src, onClick, className }: videoComponentProps) {
    return (
        <>
            <video
                ref={videoRef}
                onClick={onClick}
                src={src}
                controls={false}
                playsInline
                muted={muted}
                autoPlay
                className={className}
            />
            {muted &&
                <p className="absolute top-3 left-3 rounded-xl font-medium bg-gray-200 px-2 py-1 flex items-center gap-1">
                    <FaVolumeMute /> Unmute
                </p>
            }
        </>
    )
}
