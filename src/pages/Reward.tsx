import { Drawer } from 'antd';
import React, { useState } from 'react'
import { FaMapPin, FaPlusCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import CustomiseInput from '../components/CustomiseInput';

export default function Reward() {
  const user = useSelector((state: any) => state.user);
  const { windowSize } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('award')
  const [wallet, setWallet] = useState('')
  const navigate = useNavigate();
  const smokeType = 'nft'
  const body = {
    nft: {
      header: 'You\'ve Got a Trekn NFT',
      desc: 'Congratulations! You\'ve just received a unique Trekn NFT. Check it out in your collection now and see what makes it special.'
    },
    whitelist: {
      header: 'Welcome to the Whitelist',
      desc: 'Congrats! You\'ve secured a coveted whitelist slot. Your journey with us is just beginning'
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setWallet('');
    setTimeout(() => {
      setCurrentView('award');
    }, 200)
  }

  const handleConfirm = () => {
    setCurrentView('success');
    setWallet('');
  }
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

          <div className='mt-auto' onClick={() => setIsOpen(true)}>
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
      <Drawer
        placement='bottom'
        closable={false}
        open={isOpen}
        onClose={handleClose}
        height={windowSize.height * 0.9}
        className='rounded-t-3xl'
        style={{ background: '#2C2C2C' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-row justify-end">
            <div onClick={handleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <g filter="url(#filter0_b_3234_15933)">
                  <rect width="30" height="30" rx="15" fill="#545454" />
                  <path d="M10.0474 19.1811C9.73633 19.4921 9.72998 20.0444 10.0537 20.3681C10.3838 20.6918 10.936 20.6855 11.2407 20.3808L14.9985 16.623L18.75 20.3745C19.0674 20.6918 19.6133 20.6918 19.937 20.3681C20.2607 20.038 20.2607 19.4985 19.9434 19.1811L16.1919 15.4296L19.9434 11.6718C20.2607 11.3544 20.2671 10.8085 19.937 10.4848C19.6133 10.1611 19.0674 10.1611 18.75 10.4785L14.9985 14.2299L11.2407 10.4785C10.936 10.1674 10.3774 10.1547 10.0537 10.4848C9.72998 10.8085 9.73633 11.3671 10.0474 11.6718L13.7988 15.4296L10.0474 19.1811Z" fill="white" />
                </g>
                <defs>
                  <filter id="filter0_b_3234_15933" x="-54.3656" y="-54.3656" width="138.731" height="138.731" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="27.1828" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3234_15933" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3234_15933" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
          {currentView === 'success' ?
            <>
              <div>
                <p className='font-bold text-2xl leading-[40px] italic text-white'>Collect successful</p>
                <p className='text-[#FFFFFFB2] leading-[140%] italic'>Congrats! You've secured a coveted whitelist slot. Your journey with us is just beginning</p>
              </div>
              <div
                className="w-full h-10 bg-black rounded-3xl mt-auto flex flex-row items-center justify-center"
                onClick={handleClose}
              >
                <p className='text-white leading-6 font-semibold italic'>Done</p>
              </div>
            </>
            :
            <>
              <div className="mb-5">
                <p className='font-bold text-2xl leading-[40px] italic text-white'>{body[smokeType].header}</p>
                <p className='text-[#FFFFFFB2] leading-[140%] italic'>{body[smokeType].desc}</p>
              </div>
              {currentView === 'award' &&
                <>
                  <img src='' alt='' className='bg-white h-[339px] rounded-xl' />
                  <div
                    className="w-full h-10 bg-black rounded-3xl mt-auto flex flex-row items-center justify-center"
                    onClick={() => setCurrentView('claim')}
                  >
                    <p className='text-white leading-6 font-semibold italic'>Collect this</p>
                  </div>
                </>
              }
              {currentView === 'claim' &&
                <>
                  <div className="mt-5">
                    <div className="py-2 px-3 bg-[#3A3A3A] flex flex-row items-center gap-x-2 w-fit rounded-xl">
                      <img src='./solana.png' alt='' className='w-6 h-6' />
                      <p className='text-[13px] leading-[120%] text-white italic'>Network: Solana</p>
                    </div>
                    <div className="mt-6">
                      <p className='text-[13px] text-[#BDBDBA] leading-[120%] italic'>Enter the recipent wallet address</p>
                    </div>
                    <input
                      onChange={(e) => { setWallet(e.currentTarget.value) }}
                      type="text"
                      value={wallet}
                      placeholder='Wallet address'
                      className='py-4 px-3 w-full focus-visible:outline-none text-white placeholder:text-[#FFFFFF80] text-base font-medium leading-[120%] bg-[#212121DE] mt-6 rounded-xl'
                    />
                  </div>
                  <div
                    className="w-full h-10 bg-black rounded-3xl mt-auto flex flex-row items-center justify-center"
                    onClick={handleConfirm}
                  >
                    <p className='text-white leading-6 font-semibold italic'>Confirm</p>
                  </div>
                </>
              }
            </>
          }
        </div>
      </Drawer>
    </div>
  )
}
