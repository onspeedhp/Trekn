/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { ListDetail } from '../components/ListDetail';
import { useWindowSize } from '../hooks/useWindownSize';
import { useAuthContext } from '../context/AuthContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FaPlus, FaMap } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
require('@solana/wallet-adapter-react-ui/styles.css');

function ConnectWallet() {
  const { width } = useWindowSize();
  const { getListLocation, listLocation, coordsNow } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    getListLocation();
  }, [coordsNow]);

  return (
    <>
      <div className='w-full px-[20px] sm:px-0 '>
        <div
          className='w-full sm:h-[704px] flex items-end bg-cover mt-[40px]'
          style={{
            backgroundImage:
              width >= 640
                ? "url('https://vapa.vn/wp-content/uploads/2022/12/anh-canh-dep-001-1.jpg')"
                : '',
          }}
        >
          <div className='max-w-[673px]  flex flex-col rounded-tr-[24px] sm:h-[336px] sm:bg-white sm:py-[40px] sm:pl-[142px] sm:pr-[48px] '>
            <div className='text-[34px] font-bold leading-10'>
              Discover Local Hidden Gems
            </div>
            <div className='w-full h-[48px] relative items-center justify-center rounded-3xl bg-[#00A868] text-white text-base font-semibold px-[32px] mt-[25px] hidden sm:flex'>
              <p className='absolute'>Connect wallet to start explore</p>
              <WalletMultiButton
                style={{
                  width: '490px',
                  position: 'absolute',
                  top: '-25px',
                  left: '-240px',
                  opacity: 0,
                }}
              />
            </div>
          </div>
        </div>

        <div className='max-w-[870px] ml-auto mr-auto mb-10'>
          <div
            className='w-full h-[48px] relative items-center justify-center rounded-3xl bg-black text-white text-base font-semibold px-[32px] mt-6 flex sm:hidden'
            onClick={() => {
              navigate('/map-view');
            }}
          >
            <p className='absolute flex items-center'>
              <FaPlus size={24} className='font-white mr-2' /> Drop a new
              experience
            </p>
          </div>
          <div
            className='w-full h-[48px] relative items-center justify-center rounded-3xl bg-white text-black text-base font-semibold px-[32px] mt-4 flex sm:hidden'
            style={{ border: '1px solid gray' }}
            onClick={() => {}}
          >
            <p className='absolute flex items-center'>
              <FaMap size={24} className='mr-2' /> View map
            </p>
          </div>
          <div className=' text-base font-semibold mt-[25px]'>Near by</div>
          <ListDetail data={listLocation} />
          <div className=' text-base font-semibold mt-[25px]'>Popular</div>
          <ListDetail data={listLocation} />
        </div>
      </div>
    </>
  );
}

export default ConnectWallet;
