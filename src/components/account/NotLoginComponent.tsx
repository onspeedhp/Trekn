import React, { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

export default function NotLoginComponent() {
  const navigate = useNavigate();
  const { init } = useContext(AuthContext);
  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen pb-20 px-5 gap-4'>
      <p className='text-[#000000B2] text-[15x] leading-6'>
        Please login first to explore this
      </p>
      <Button
        className=' rounded-3xl bg-black w-full h-fit py-3 border-none'
        onClick={async () => {
          await init();
          navigate('/', { state: { login: false } });
        }}
      >
        <span className='font-semibold text-base text-white leading-6 text-center'>
          Login
        </span>
      </Button>
    </div>
  );
}
