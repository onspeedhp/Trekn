import React from 'react'
import { FaMapPin, FaPlusCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router';

export default function Reward() {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  return (
    <div
      className="px-4 bg-cover bg-center bg-[#606060] pb-24"
      style={{ backgroundImage: 'url(./bg-award.png)' }}
    >
      <div className="flex flex-row py-7 gap-x-3">
        <div className="rounded-xl w-[100px] h-[100px] p-0.5 flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to bottom, #3CFF38, #FFC329)' }}>
          <img src={user.profileImage} className='rounded-xl w-[96px] h-[96px] bg-cyan-300' alt='' />
        </div>
        <div className="flex-1 flex flex-row justify-between py-2">
          <div className="flex flex-col justify-between">
            <p style={{ fontFamily: 'Handjet' }} className='text-2xl text-white leading-4'>You have</p>
            <div className="flex flex-row items-center gap-x-2">
              <img src="/token.png" alt="" className='w-6 h-6' />
              <p style={{ fontFamily: 'Handjet' }} className='text-white text-[32px] leading-5 font-medium'>3456</p>
            </div>
            <p style={{ fontFamily: 'Handjet' }} className='text-white underline text-base leading-4'>Learn more</p>
          </div>

          <div className='mt-auto'>
            <p style={{ fontFamily: 'Handjet' }} className='text-white text-base leading-4 text-center animate-bounce'>Open it</p>
            <img src='./treasury.svg' alt='' className='w-[56px] h-[38px] mt-1' />
          </div>
        </div>
      </div>
      <div className="mt-6 p-6 bg-[#2C2C2C] rounded-xl flex flex-row gap-4">
        <div
          className="w-1/2 bg-[#9DFF50] rounded-xl py-4 flex flex-row items-center justify-center gap-1 relative mt-4"
          onClick={() => navigate('/check-in/nearBy')}
        >
          <FaPlusCircle size={16} />
          <p style={{ fontFamily: 'Handjet' }} className='text-base text-[#000000B2] font-semibold leading-4'>Add a spot</p>
          <div className="rounded-[4px] bg-[#E2FFCA] border border-[#62C316] px-2 py-1 absolute -top-4 ">
            <p style={{ fontFamily: 'Handjet' }} className='text-[13px] text-[#000000B2] font-medium leading-4 text-center'>+200</p>
          </div>
        </div>
        <div
          className="w-1/2 bg-[#9DFF50] rounded-xl py-4 flex flex-row items-center justify-center gap-1 relative mt-4"
          onClick={() => navigate('/check-in/nearBy')}
        >
          <FaMapPin size={16} />
          <p style={{ fontFamily: 'Handjet' }} className='text-base text-[#000000B2] font-semibold leading-4'>Checkin</p>
          <div className="rounded-[4px] bg-[#E2FFCA] border border-[#62C316] px-2 py-1 absolute -top-4 ">
            <p style={{ fontFamily: 'Handjet' }} className='text-[13px] text-[#000000B2] font-medium leading-4 text-center'>+100</p>
          </div>
        </div>
      </div>
      <div className="my-6 h-2 rounded-full bg-[#F5F5F51A]" />
      <div className="mt-6 py-3 px-4 bg-[#2C2C2C] rounded-xl">
        <p 
        style={{ fontFamily: 'Handjet' }} 
        className='text-[24px] text-white font-medium leading-[32px] mb-6'
        >
          This week Leaderboard
        </p>
        <div className="flex-col flex gap-4">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row item-center gap-[11px]">
              <img src="./1st.svg" alt="" />
              <div className="flex flex-row items-center gap-2">
                <img src={user.profileImage} alt='' className='border border-white w-12 h-12 object-cover object-center' />
                <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] font-semibold leading-5'>{user.name}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img src="/token.png" alt="" className='w-5 h-5' />
              <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] leading-4'>3200</p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row item-center gap-[11px]">
              <img src="./2nd.svg" alt="" />
              <div className="flex flex-row items-center gap-2">
                <img src={user.profileImage} alt='' className='border border-white w-12 h-12 object-cover object-center' />
                <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] font-semibold leading-5'>{user.name}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img src="/token.png" alt="" className='w-5 h-5' />
              <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] leading-4'>3200</p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row item-center gap-[11px]">
              <img src="./3rd.svg" alt="" />
              <div className="flex flex-row items-center gap-2">
                <img src={user.profileImage} alt='' className='border border-white w-12 h-12 object-cover object-center' />
                <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] font-semibold leading-5'>{user.name}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img src="/token.png" alt="" className='w-5 h-5' />
              <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] leading-4'>3200</p>
            </div>
          </div>
          {[4, 5].map((item, idx) => (
            <div className="flex flex-row justify-between items-center" key={idx}>
              <div className="flex flex-row items-center gap-[11px]">
                <div className="flex-row flex items-center justify-center w-6 h-6 rounded-full bg-[#606060]">
                  <p style={{ fontFamily: 'Handjet' }} className='text-white text-[13px] font-medium leading-[13px]'>{item}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <img src={user.profileImage} alt='' className='border border-white w-12 h-12 object-cover object-center' />
                  <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] font-semibold leading-5'>{user.name}</p>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <img src="/token.png" alt="" className='w-5 h-5' />
                <p style={{ fontFamily: 'Handjet' }} className='text-white text-[20px] leading-4 font-medium'>3200</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
