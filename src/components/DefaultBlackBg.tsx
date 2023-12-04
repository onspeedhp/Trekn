import React, { ReactNode } from 'react'
import { useAuthContext } from '../context/AuthContext';

interface defaultBlackBgProps {
    children: ReactNode,
}

export default function DefaultBlackBg({children}: defaultBlackBgProps) {
    const {windowSize} = useAuthContext();
  return (
    <div
      className='bg-black'
      style={{ width: windowSize.width, height: windowSize.height }}
    >
      {children}
    </div>
  )
}
