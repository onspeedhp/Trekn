import React from 'react'
import { FaVolumeMute } from 'react-icons/fa'
import { FaVolumeHigh } from 'react-icons/fa6';

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
            <p className="absolute top-3 right-3">
                {muted ? <FaVolumeMute size={24} color='white' /> : <FaVolumeHigh size={24} color='#FFFFFFB2' />}
            </p>
        </>
    )
}
