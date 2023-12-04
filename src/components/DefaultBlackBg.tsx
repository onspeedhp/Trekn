import React, { ReactNode } from 'react'
import { useAuthContext } from '../context/AuthContext';

interface defaultBlackBgProps {
    children: ReactNode,
    className?: string
}

export default function DefaultBlackBg({className,children}: defaultBlackBgProps) {
    const {windowSize} = useAuthContext();
  return (
    <div
      className={`bg-black ${className} relative overflow-y-auto`}
      style={{ width: windowSize.width, height: windowSize.height }}
    >
      {children}
    </div>
  )
}
