/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, createContext, useState } from 'react';
import { ListDetail } from '../components/ListDetail';
import { useWindowSize } from '../hooks/useWindownSize';
import { useAuthContext } from '../context/AuthContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FaPlus, FaMap } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { Modal } from 'antd';
import request from '../axios';
import { IDrop } from '../models/types';
import Slider from '../components/Slider';
import { DetailCard } from '../components/DetailCard';

function Home() {
  const { coordsNow, loggedIn } = useAuthContext();
  const [readyToCollect, setReadyToCollect] = useState<IDrop[]>([]);
  const [nearBy, setNearBy] = useState<IDrop[]>([]);

  const navigate = useNavigate();

  const getReadyToCollect = async (lat: number, log: number) => {
    const res = await request.post('drop/getReadyToCollect', {
      lat: lat,
      lng: log,
    });

    setReadyToCollect(res.data.data);
  };

  const getNearBy = async (lat: number, log: number) => {
    const res = await request.post('drop/getNearBy', {
      lat: lat,
      lng: log,
    });

    setNearBy(res.data.data);
  };

  useEffect(() => {
    const { log, lat } = coordsNow;
    if (log !== -1 && lat !== -1) {
      getReadyToCollect(lat, log);
      getNearBy(lat, log);
    }
  }, [coordsNow]);

  return (
    <>
      <div className='w-[375px] px-[20px] sm:px-0'>
        <div className='w-[375px] sm:h-[704px] flex items-end bg-cover mt-[40px]'>
          <div className='flex flex-col rounded-tr-[24px] sm:h-[336px] sm:bg-white sm:py-[40px] sm:pl-[142px] sm:pr-[48px] '>
            <div className='text-[34px] font-bold leading-10 w-[335px]'>
              Discover Local Hidden Gems
            </div>
            {readyToCollect.length !== 0 ? (
              <>
                <div className='w-[355px] mt-6'>
                  <Slider>
                    {readyToCollect.map((item: any, index: any) => (
                      <DetailCard
                        key={index}
                        data={item}
                        status={'ReadyToCollect'}
                      />
                    ))}
                  </Slider>
                </div>
              </>
            ) : (
              <>
                <div className='w-[335px]'>
                  <div className='flex items-center justify-center mt-7'>
                    <img src='./Route_search.png' alt='' />
                  </div>
                  <div className='text-center text-[20px] font-semibold text-black opacity-50'>
                    Go further to discover or drop something in the area
                  </div>
                </div>
              </>
            )}
            <div className='flex'></div>
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
              if (loggedIn) {
                navigate('/drop-onboarding');
              } else {
                Modal.error({
                  title: 'Error',
                  content: 'You need to sign in first',
                  okButtonProps: {
                    style: {
                      background: 'red',
                    },
                  },
                });
              }
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
            onClick={() => {
              navigate('/map-view');
            }}
          >
            <p className='absolute flex items-center'>
              <FaMap size={24} className='mr-2' /> View map
            </p>
          </div>

          <div style={{ marginTop: 43 }}>
            {nearBy.length !== 0 && (
              <ListDetail status={'Nearby'} data={nearBy} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
