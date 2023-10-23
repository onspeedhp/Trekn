import { useAuthContext } from '../context/AuthContext';
import { getAllDrops, getDropByID } from '../middleware/data/drop';
import { deepEqual } from './MapGoogle';
import { Button, ConfigProvider, Drawer, Modal, Popover } from 'antd';
import { useNavigate, useParams } from 'react-router';
import {
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
  FaPlus,
  FaChevronDown,
} from 'react-icons/fa6';
import {
  calculateDistance,
  convertDistance,
} from '../functions/calculateDistance';
import React, { useEffect, useRef, useState, TouchEvent } from 'react';
import { FaHome, FaUserFriends } from 'react-icons/fa';
import { GroupIcon } from '../icons';
import { mintCompressedNFT } from '../functions/mintCompressedNFT';
import { PublicKey } from '@solana/web3.js';
import Map, { Marker } from 'react-map-gl';

import './style.css';
import { useSelector } from 'react-redux';

export const MapGL = () => {
  const navigate = useNavigate();
  const { setMetadata, windowSize, init } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const refDrawer = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { dropId } = useParams();
  const [mintStatus, setMintStatus] = useState('');
  const [disable, setDisable] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const reactions = [
    {
      icon: <FaFaceKissWinkHeart className='text-[#66C61B]' />,
    },
    {
      icon: <FaFaceLaughBeam className='text-[#66C61B]' />,
    },
    {
      icon: <FaFaceMeh className='text-[#66C61B]' />,
    },
    {
      icon: <FaFaceFrown className='text-[#66C61B]' />,
    },
    {
      icon: <FaFaceSadCry className='text-[#66C61B]' />,
    },
  ];

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touchY = event.touches[0].clientY;
    if (refDrawer.current) {
      refDrawer.current.dataset.touchStart = touchY.toString();
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touchY = event.touches[0].clientY;
    const touchStart = parseInt(refDrawer.current?.dataset.touchStart || '0');
    const heightScreen = windowSize.height;
    const newHeight = drawerHeight + (touchStart - touchY);

    if (newHeight >= 400 && newHeight < heightScreen * 0.98) {
      setDrawerHeight(636);
    }
  };

  const onClose = () => {
    setIsDrawerVisible(false);
  };

  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    getAllDrops({
      onSuccess: (data: any) => {
        if (!deepEqual(data, locations)) {
          setLocations(data);
        }
      },
    });
  }, [locations]);

  useEffect(() => {
    if (dropId) {
      getDropByID({
        dropId: dropId,
        onSuccess: (data) => {
          setSelectedLocation(data[0]);
          setIsDrawerVisible(true);
          setDrawerHeight(443);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setDistance(
        Math.ceil(
          calculateDistance(
            user.lat,
            user.lng,
            selectedLocation.lat,
            selectedLocation.lng
          )
        )
      );

      if (!user.id) {
        setMintStatus('Login to collect');
        setDisable(false);
      } else {
        if (!selectedLocation.radius || distance <= selectedLocation.radius) {
          setMintStatus('Collect');
          setDisable(false);
        } else {
          setDisable(true);
          setMintStatus('Move closer to collect');
        }
      }
    }
  }, [selectedLocation, user]);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Popover: {
              minWidth: 97,
            },
          },
        }}
      >
        <div id='map' className='relative h-full w-full'>
          <Button
            onClick={() => {
              navigate('/home');
            }}
            style={{
              padding: 0,
              zIndex: 1000,
            }}
            className='fixed bg-black top-0 right-0 rounded-full w-9 h-9 text-white flex justify-center items-center m-5 z-10'
          >
            <FaHome size={16} />
          </Button>

          <Map
            mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
            initialViewState={{
              longitude: !user.lng ? 105.8342 : user.lng,
              latitude: !user.lat ? 21.0278 : user.lat,
              zoom: 14,
            }}
            style={{ width: windowSize.width, height: windowSize.height }}
            mapStyle='mapbox://styles/mapbox/streets-v9'
          >
            {locations.map((location, index) => (
              <>
                <Marker
                  key={index}
                  longitude={location.lng}
                  latitude={location.lat}
                  anchor='bottom'
                  onClick={() => {
                    setSelectedLocation(location);
                    setIsDrawerVisible(true);
                    setDrawerHeight(443);
                  }}
                >
                  <svg
                    width='39'
                    height='43'
                    viewBox='0 0 39 43'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M17.2293 40.454L17.2301 40.4551C18.2734 41.9623 20.5041 41.9624 21.5475 40.4551L21.5483 40.454C23.4911 37.6374 25.16 35.2599 26.5897 33.2231C29.1891 29.5197 30.998 26.9427 32.2259 24.901C33.1877 23.3017 33.8237 21.9835 34.2139 20.6657C34.606 19.3418 34.7383 18.0579 34.7383 16.5416C34.7383 8.06431 27.8661 1.19213 19.3888 1.19213C10.9115 1.19213 4.0393 8.06431 4.0393 16.5416C4.0393 18.0579 4.17159 19.3418 4.56366 20.6657C4.9539 21.9835 5.58994 23.3017 6.55174 24.901C7.77963 26.9427 9.58849 29.5197 12.1879 33.2231C13.6176 35.2599 15.2865 37.6375 17.2293 40.454ZM24.6399 16.5416C24.6399 19.4418 22.2889 21.7928 19.3888 21.7928C16.4887 21.7928 14.1377 19.4418 14.1377 16.5416C14.1377 13.6415 16.4887 11.2905 19.3888 11.2905C22.2889 11.2905 24.6399 13.6415 24.6399 16.5416Z'
                      fill='url(#paint0_linear_567_4001)'
                      stroke='#395324'
                      stroke-width='1.61574'
                    />
                    <defs>
                      <linearGradient
                        id='paint0_linear_567_4001'
                        x1='19.3888'
                        y1='2'
                        x2='19.3888'
                        y2='40.7777'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stop-color='#99FF48' />
                        <stop offset='1' stop-color='#D7FFB7' />
                      </linearGradient>
                    </defs>
                  </svg>
                </Marker>
              </>
            ))}
            <Marker
              longitude={!user.lng ? 105.8342 : user.lng}
              latitude={!user.lat ? 21.0278 : user.lat}
              anchor='bottom'
              onClick={() => {}}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='36'
                height='35'
                viewBox='0 0 36 35'
                fill='none'
              >
                <g filter='url(#filter0_d_69_1943)'>
                  <circle
                    cx='17.9233'
                    cy='12.5063'
                    r='6.86955'
                    fill='#1657FF'
                  />
                  <circle
                    cx='17.9233'
                    cy='12.5063'
                    r='9.44104'
                    stroke='white'
                    stroke-width='5.14298'
                  />
                </g>
                <defs>
                  <filter
                    id='filter0_d_69_1943'
                    x='0.767789'
                    y='0.493652'
                    width='34.311'
                    height='34.3113'
                    filterUnits='userSpaceOnUse'
                    color-interpolation-filters='sRGB'
                  >
                    <feFlood flood-opacity='0' result='BackgroundImageFix' />
                    <feColorMatrix
                      in='SourceAlpha'
                      type='matrix'
                      values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                      result='hardAlpha'
                    />
                    <feOffset dy='5.14298' />
                    <feGaussianBlur stdDeviation='2.57149' />
                    <feComposite in2='hardAlpha' operator='out' />
                    <feColorMatrix
                      type='matrix'
                      values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
                    />
                    <feBlend
                      mode='normal'
                      in2='BackgroundImageFix'
                      result='effect1_dropShadow_69_1943'
                    />
                    <feBlend
                      mode='normal'
                      in='SourceGraphic'
                      in2='effect1_dropShadow_69_1943'
                      result='shape'
                    />
                  </filter>
                </defs>
              </svg>
            </Marker>
          </Map>

          {selectedLocation && (
            <div
              ref={refDrawer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <Drawer
                placement='bottom'
                closable={false}
                onClose={onClose}
                open={isDrawerVisible}
                height={drawerHeight}
                className='rounded-t-3xl'
              >
                <div className='flex-col'>
                  <div
                    className='absolute left-0 top-0 w-full bg-white rounded-t-3xl'
                    style={{ height: 44 }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='30'
                      height='30'
                      viewBox='0 0 30 30'
                      fill='none'
                      className='absolute right-0 m-3'
                      onClick={onClose}
                    >
                      <g filter='url(#filter0_b_39_3010)'>
                        <rect width='30' height='30' rx='15' fill='#F2F2F7' />
                        <path
                          d='M10.0488 19.1811C9.73779 19.4921 9.73145 20.0444 10.0552 20.3681C10.3853 20.6918 10.9375 20.6855 11.2422 20.3808L15 16.623L18.7515 20.3745C19.0688 20.6918 19.6147 20.6918 19.9385 20.3681C20.2622 20.038 20.2622 19.4985 19.9448 19.1811L16.1934 15.4296L19.9448 11.6718C20.2622 11.3544 20.2686 10.8085 19.9385 10.4848C19.6147 10.1611 19.0688 10.1611 18.7515 10.4785L15 14.2299L11.2422 10.4785C10.9375 10.1674 10.3789 10.1547 10.0552 10.4848C9.73145 10.8085 9.73779 11.3671 10.0488 11.6718L13.8003 15.4296L10.0488 19.1811Z'
                          fill='#3C3C43'
                          fillOpacity='0.6'
                        />
                      </g>
                      <defs>
                        <filter
                          id='filter0_b_39_3010'
                          x='-54.3656'
                          y='-54.3656'
                          width='138.731'
                          height='138.731'
                          filterUnits='userSpaceOnUse'
                          colorInterpolationFilters='sRGB'
                        >
                          <feFlood
                            floodOpacity='0'
                            result='BackgroundImageFix'
                          />
                          <feGaussianBlur
                            in='BackgroundImageFix'
                            stdDeviation='27.1828'
                          />
                          <feComposite
                            in2='SourceAlpha'
                            operator='in'
                            result='effect1_backgroundBlur_39_3010'
                          />
                          <feBlend
                            mode='normal'
                            in='SourceGraphic'
                            in2='effect1_backgroundBlur_39_3010'
                            result='shape'
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>

                  <div className='flex items-center mt-5 mb-2'>
                    <img
                      className='rounded-full w-6 h-6'
                      src={`${selectedLocation.user.profileImage}`}
                      alt=''
                    />

                    <div className='text-[13px] text-[#848484] font-medium ml-2'>
                      {selectedLocation.user.name}
                    </div>
                  </div>

                  <div className='font-bold	text-2xl mb-2'>
                    {selectedLocation.name}
                  </div>
                  <div className='text-[13px] text-[#848484] font-medium mb-4'>
                    {selectedLocation.location}
                  </div>

                  <div className='flex items-center justify-center mb-5'>
                    <img
                      src={selectedLocation.image}
                      alt='Uploaded'
                      className='rounded-xl'
                      style={{
                        width: 339,
                        height: 339,
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  </div>

                  <div
                    className='flex relative border-b'
                    style={{ height: 60 }}
                  >
                    <div className='flex h-10 p-3 bg-[#F5F5F5] opacity-70 rounded-full'>
                      <FaUserFriends size={16} />
                      <span className='text-[13px] font-semibold ml-2'>
                        {selectedLocation.collected} collected
                      </span>
                    </div>

                    <Popover
                      content={
                        <>
                          {reactions.map((item, index) => (
                            <div
                              className='flex items-center justify-center'
                              key={index}
                            >
                              {item.icon}
                              <span className='text-[13px] font-medium ml-2'>
                                {selectedLocation.reaction_counts[`${index}`]}
                              </span>
                            </div>
                          ))}
                        </>
                      }
                      trigger='click'
                      open={open}
                      onOpenChange={handleOpenChange}
                      placement='bottom'
                    >
                      <div className='flex ml-2 h-10 p-3 bg-[#F5F5F5] opacity-70 rounded-full items-center'>
                        <FaFaceLaughBeam size={16} className='text-[#66C61B]' />
                        <span className='text-[13px] font-semibold ml-2'>
                          {selectedLocation.reaction_counts['1']}
                        </span>
                        <FaChevronDown className='ml-2' />
                      </div>
                    </Popover>
                  </div>

                  <div className='flex items-center mb-[24px] mt-5'>
                    <GroupIcon />
                    <p className='font-bold text-[20px] ml-[10px]'>
                      {convertDistance(distance)} away
                    </p>
                  </div>

                  <div className='font-medium	text-black opacity-50 mb-20'>
                    {selectedLocation.description}
                  </div>

                  <div
                    style={{
                      height: 88,
                    }}
                    className='absolute bg-white bottom-0 w-full'
                  >
                    <Button
                      className='h-12 rounded-3xl text-white bg-black'
                      style={{ width: windowSize.width - 40 }}
                      loading={loading}
                      onClick={async () => {
                        if (user.address) {
                          setLoading(true);
                          await mintCompressedNFT({
                            drop: selectedLocation,
                            userAddress: new PublicKey(user.address),
                            userId: user.id,
                            onSuccess: (data: any) => {
                              setMetadata({
                                sig: data,
                                ...selectedLocation,
                              });

                              navigate('/collect-success');
                            },
                            onError: (error) => {
                              Modal.error({
                                title: 'Error',
                                content: error,
                                okButtonProps: {
                                  type: 'default',
                                  style: {
                                    background: 'red',
                                    color: 'white',
                                  },
                                },
                              });
                            },
                          });
                          setLoading(false);
                        } else {
                          setLoading(true);

                          await init();
                          setLoading(false);
                        }
                        // }
                      }}
                      disabled={disable}
                    >
                      {mintStatus}
                    </Button>
                  </div>
                </div>
              </Drawer>
            </div>
          )}

          <Button
            onClick={() => {
              navigate('/drop-onboarding');
            }}
            style={{
              marginLeft: Math.round((windowSize.width - 64) / 2),
              zIndex: 1000,
            }}
            className='fixed bg-black bottom-0 rounded-full w-16 h-16 text-white flex items-center justify-center mb-4'
          >
            <FaPlus size={24} />
          </Button>
        </div>
      </ConfigProvider>
    </>
  );
};
