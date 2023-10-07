/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ListDetail } from '../components/ListDetail';
import { useAuthContext } from '../context/AuthContext';
import { FaPlus, FaMap } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import request from '../axios';
import { IDrop } from '../models/types';
import Slider from '../components/Slider';
import { DetailCard } from '../components/DetailCard';
import { Button } from 'antd';

function Home() {
  const {
    coordsNow,
    loggedIn,
    setLoggedIn,
    setUser,
    setTorus,
    torus,
    windowSize,
  } = useAuthContext();
  const [readyToCollect, setReadyToCollect] = useState<IDrop[]>([]);
  
  const [nearBy, setNearBy] = useState<IDrop[]>([]);
  const [loading, setLoading] = useState(false);

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
      <div className='w-full px-[20px] sm:px-0'>
        <div className='w-full sm:h-[704px] flex items-end bg-cover mt-[40px]'>
          <div className='flex flex-col rounded-tr-[24px] sm:h-[336px] sm:bg-white sm:py-[40px] sm:pl-[142px] sm:pr-[48px] '>
            <div className='text-[34px] font-bold leading-10'>
              Discover Local Hidden Gems
            </div>
            {readyToCollect.length !== 0 ? (
              <>
                <div className='mt-6' style={{ width: windowSize.width - 20 }}>
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
                <div className='flex items-center justify-center mt-7'>
                  <img src='./Route_search.png' alt='' />
                </div>
                <div className='text-center text-[20px] font-semibold text-black opacity-50'>
                  Go further to discover or drop something in the area
                </div>
              </>
            )}
          </div>
        </div>

        <div className='max-w-[870px] ml-auto mr-auto mb-10'>
          <Button
            loading={loading}
            className='w-full h-[48px] relative items-center justify-center rounded-3xl bg-black text-white text-base font-semibold px-[32px] mt-6 flex sm:hidden'
            onClick={async () => {
              if (loggedIn) {
                navigate('/drop-onboarding');
              } else {
                setLoading(true);
                if (!torus.isInitialized) {
                  await torus.init({
                    buildEnv: 'production', // "production", or "developement" are also the option
                    enableLogging: true, // default: false
                    network: {
                      blockExplorerUrl:
                        'https://explorer.solana.com/?cluster=mainnet', // devnet and mainnet
                      chainId: '0x1',
                      displayName: 'Solana Mainnet',
                      logo: 'solana.svg',
                      rpcTarget: process.env.REACT_APP_HELIUS_RPC_URL!, // from "@solana/web3.js" package
                      ticker: 'SOL',
                      tickerName: 'Solana Token',
                    },
                    showTorusButton: false, // default: true
                    useLocalStorage: false, // default: false to use sessionStorage
                    buttonPosition: 'top-left', // default: bottom-left
                    apiKey: process.env.REACT_APP_CLIENT_ID_WEB3_AUTH!, // https://developer.web3auth.io
                    whiteLabel: {
                      name: 'Whitelabel Demo',
                      theme: {
                        isDark: true,
                        colors: { torusBrand1: '#00a8ff' },
                      },
                      logoDark:
                        'https://solana-testing.tor.us/img/solana-logo-light.46db0c8f.svg',
                      logoLight:
                        'https://solana-testing.tor.us/img/solana-logo-light.46db0c8f.svg',
                      topupHide: true,
                    },
                  });
                }
                await torus.login();

                setTorus(torus);

                const torusInfo = await torus.getUserInfo();

                setUser({
                  ...torusInfo,
                  address: (await torus.getAccounts())[0],
                });

                setLoading(false);
                setLoggedIn(true);
              }
            }}
          >
            <p className='absolute flex items-center'>
              <FaPlus size={24} className='font-white mr-2' /> Drop a new
              experience
            </p>
          </Button>
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
