/* eslint-disable no-restricted-globals */
import { Button, ConfigProvider, Divider, Drawer, Modal, Popover } from 'antd';
import {
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
  FaPlus,
  FaChevronDown,
} from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import GoogleMap from '../components/GoogleMap';
import React, { useEffect, useRef, useState, TouchEvent } from 'react';
import { FaUserFriends, FaHome } from 'react-icons/fa';
import { GroupIcon } from '../icons';
import {
  calculateDistance,
  convertDistance,
} from '../functions/calculateDistance';
import { getAllDrops } from '../middleware/data/drop';
import { mintCompressedNFT } from '../functions/mintCompressedNFT';
import { PublicKey } from '@solana/web3.js';
import './style.css';

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export const MapView = () => {
  const navigate = useNavigate();
  const {
    coordsNow,
    loggedIn,
    setMetadata,
    torus,
    setTorus,
    setLoggedIn,
    setUser,
    user,
  } = useAuthContext();
  const coords = {
    lat: coordsNow.lat,
    lng: coordsNow.log,
  };
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

  const hide = () => {
    setOpen(false);
  };

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
    const heightScreen = screen.height;
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
      getAllDrops({
        onSuccess: (data: any) => {
          const drop = data.find((drop: any) => drop.id === Number(dropId));
          setSelectedLocation(drop);
          setIsDrawerVisible(true);
          setDrawerHeight(443);
        },
      });
    }
  }, []);

  const onGoogleApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    new maps.Marker({
      position: { lat: coords.lat, lng: coords.lng },
      map,
      title: 'Location now',
      icon: {
        url: '/marker_new.png',
        scaledSize: new maps.Size(38, 38),
      },
    });

    locations.forEach((location: any) => {
      const marker = new maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: {
          url: '/location.png',
          scaledSize: new maps.Size(38, 38),
        },
      });

      marker.addListener('click', () => {
        setSelectedLocation(location);
        setIsDrawerVisible(true);
        setDrawerHeight(443);
      });
    });
  };

  useEffect(() => {
    if (selectedLocation) {
      setDistance(
        Math.ceil(
          calculateDistance(
            coords.lat,
            coords.lng,
            selectedLocation.lat,
            selectedLocation.lng
          )
        )
      );

      if (!loggedIn) {
        setMintStatus('Login to collect');
        setDisable(false);
      } else {
        if (!selectedLocation.radius || distance <= selectedLocation.radius) {
          setMintStatus('Collect this');
          setDisable(false);
        } else {
          setDisable(true);
          setMintStatus('Move closer to collect');
        }
      }
    }
  }, [selectedLocation, coordsNow, loggedIn]);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Popover: {
              width: 97,
              minWidth: 97,
            },
          },
        }}
      >
        <div
          className='rounded-xl h-screen'
          style={{
            width: '100%',
          }}
        >
          <Button
            onClick={() => {
              navigate('/home');
            }}
            style={{
              padding: 0,
            }}
            className='fixed bg-black top-0 right-0 rounded-full w-9 h-9 text-white flex justify-center items-center m-5 z-10'
          >
            <FaHome size={16} />
          </Button>

          {locations && locations.length > 0 && (
            <GoogleMap
              defaultZoom={16}
              defaultCenter={coords}
              bootstrapURLKeys={{
                key: process.env.REACT_APP_JAVASCRIPT_API_KEY!,
              }}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={onGoogleApiLoaded}
              options={{
                disableDefaultUI: true,
              }}
            />
          )}

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
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 64 64'
                      fill='none'
                    >
                      <g clipPath='url(#clip0_39_3693)'>
                        <mask
                          id='mask0_39_3693'
                          // style='mask-type:alpha'
                          maskUnits='userSpaceOnUse'
                          x='0'
                          y='0'
                          width='64'
                          height='64'
                        >
                          <path
                            d='M64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32Z'
                            fill='white'
                          />
                        </mask>
                        <g mask='url(#mask0_39_3693)'>
                          <path d='M24 0H16V8H24V0Z' fill='#FFAD08' />
                          <path d='M40 0H32V8H40V0Z' fill='#EDD75A' />
                          <path d='M56 0H48V8H56V0Z' fill='#EDD75A' />
                          <path d='M16 0H8V8H16V0Z' fill='#EDD75A' />
                          <path d='M32 0H24V8H32V0Z' fill='#FFAD08' />
                          <path d='M48 0H40V8H48V0Z' fill='#EDD75A' />
                          <path d='M64 0H56V8H64V0Z' fill='#FFAD08' />
                          <path d='M8 8H0V16H8V8Z' fill='#EDD75A' />
                          <path d='M8 16H0V24H8V16Z' fill='#73B06F' />
                          <path d='M8 24H0V32H8V24Z' fill='#FFAD08' />
                          <path d='M8 32H0V40H8V32Z' fill='#0C8F8F' />
                          <path d='M8 40H0V48H8V40Z' fill='#EDD75A' />
                          <path d='M8 48H0V56H8V48Z' fill='#73B06F' />
                          <path d='M8 56H0V64H8V56Z' fill='#FFAD08' />
                          <path d='M24 8H16V16H24V8Z' fill='#FFAD08' />
                          <path d='M24 16H16V24H24V16Z' fill='#EDD75A' />
                          <path d='M24 24H16V32H24V24Z' fill='#FFAD08' />
                          <path d='M24 32H16V40H24V32Z' fill='#73B06F' />
                          <path d='M24 40H16V48H24V40Z' fill='#EDD75A' />
                          <path d='M24 48H16V56H24V48Z' fill='#FFAD08' />
                          <path d='M24 56H16V64H24V56Z' fill='#405059' />
                          <path d='M40 8H32V16H40V8Z' fill='#405059' />
                          <path d='M40 16H32V24H40V16Z' fill='#0C8F8F' />
                          <path d='M40 24H32V32H40V24Z' fill='#EDD75A' />
                          <path d='M40 32H32V40H40V32Z' fill='#FFAD08' />
                          <path d='M40 40H32V48H40V40Z' fill='#FFAD08' />
                          <path d='M40 48H32V56H40V48Z' fill='#EDD75A' />
                          <path d='M40 56H32V64H40V56Z' fill='#FFAD08' />
                          <path d='M56 8H48V16H56V8Z' fill='#73B06F' />
                          <path d='M56 16H48V24H56V16Z' fill='#FFAD08' />
                          <path d='M56 24H48V32H56V24Z' fill='#73B06F' />
                          <path d='M56 32H48V40H56V32Z' fill='#EDD75A' />
                          <path d='M56 40H48V48H56V40Z' fill='#405059' />
                          <path d='M56 48H48V56H56V48Z' fill='#FFAD08' />
                          <path d='M56 56H48V64H56V56Z' fill='#FFAD08' />
                          <path d='M16 8H8V16H16V8Z' fill='#FFAD08' />
                          <path d='M16 16H8V24H16V16Z' fill='#0C8F8F' />
                          <path d='M16 24H8V32H16V24Z' fill='#EDD75A' />
                          <path d='M16 32H8V40H16V32Z' fill='#FFAD08' />
                          <path d='M16 40H8V48H16V40Z' fill='#FFAD08' />
                          <path d='M16 48H8V56H16V48Z' fill='#73B06F' />
                          <path d='M16 56H8V64H16V56Z' fill='#405059' />
                          <path d='M32 8H24V16H32V8Z' fill='#FFAD08' />
                          <path d='M32 16H24V24H32V16Z' fill='#EDD75A' />
                          <path d='M32 24H24V32H32V24Z' fill='#FFAD08' />
                          <path d='M32 32H24V40H32V32Z' fill='#EDD75A' />
                          <path d='M32 40H24V48H32V40Z' fill='#EDD75A' />
                          <path d='M32 48H24V56H32V48Z' fill='#EDD75A' />
                          <path d='M32 56H24V64H32V56Z' fill='#0C8F8F' />
                          <path d='M48 8H40V16H48V8Z' fill='#FFAD08' />
                          <path d='M48 16H40V24H48V16Z' fill='#405059' />
                          <path d='M48 24H40V32H48V24Z' fill='#FFAD08' />
                          <path d='M48 32H40V40H48V32Z' fill='#EDD75A' />
                          <path d='M48 40H40V48H48V40Z' fill='#0C8F8F' />
                          <path d='M48 48H40V56H48V48Z' fill='#FFAD08' />
                          <path d='M48 56H40V64H48V56Z' fill='#0C8F8F' />
                          <path d='M64 8H56V16H64V8Z' fill='#405059' />
                          <path d='M64 16H56V24H64V16Z' fill='#EDD75A' />
                          <path d='M64 24H56V32H64V24Z' fill='#73B06F' />
                          <path d='M64 32H56V40H64V32Z' fill='#FFAD08' />
                          <path d='M64 40H56V48H64V40Z' fill='#405059' />
                          <path d='M64 48H56V56H64V48Z' fill='#0C8F8F' />
                          <path d='M64 56H56V64H64V56Z' fill='#EDD75A' />
                        </g>
                      </g>
                      <defs>
                        <clipPath id='clip0_39_3693'>
                          <rect width='64' height='64' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>

                    <div className='text-[13px] text-[#848484] font-medium ml-2'>
                      Undefined
                    </div>
                  </div>

                  <div className='font-bold	text-2xl mb-2'>
                    {selectedLocation.name}
                  </div>
                  <div className='text-[13px] text-[#848484] font-medium mb-4'>
                    {selectedLocation.location_name} ∙
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
                        1290 owned this
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
                          {selectedLocation.reaction_counts['2']}
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
                      className='h-12 rounded-3xl bg-black text-white'
                      style={{ width: 335 }}
                      loading={loading}
                      onClick={async () => {
                        if (user.address) {
                          setLoading(true);
                          await mintCompressedNFT({
                            drop: selectedLocation,
                            userAddress: new PublicKey(user.address),
                            onSuccess: (data: any) => {
                              setMetadata({
                                image: selectedLocation.image,
                                sig: data,
                                id: selectedLocation.id,
                              });

                              navigate('/collect-success');
                            },
                            onError: () => {
                              Modal.error({
                                title: 'Error',
                                content: 'Cannot mint this NFT',
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
                                rpcTarget:
                                  process.env.REACT_APP_HELIUS_RPC_URL!, // from "@solana/web3.js" package
                                ticker: 'SOL',
                                tickerName: 'Solana Token',
                              },
                              showTorusButton: false, // default: true
                              useLocalStorage: false, // default: false to use sessionStorage
                              buttonPosition: 'top-left', // default: bottom-left
                              apiKey:
                                process.env.REACT_APP_CLIENT_ID_WEB3_AUTH!, // https://developer.web3auth.io
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

                          setLoggedIn(true);
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
            style={{ marginLeft: 155 }}
            className='fixed bg-black bottom-0 rounded-full w-16 h-16 text-white flex items-center justify-center mb-4'
          >
            <FaPlus size={24} />
          </Button>
        </div>
      </ConfigProvider>
    </>
  );
};
