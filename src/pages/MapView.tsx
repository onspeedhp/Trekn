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
  const { coordsNow, loggedIn, setMetadata, user, windowSize, init } =
    useAuthContext();
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
          setMintStatus('Collect');
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
                        {selectedLocation.count} owned
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
                      className='h-12 rounded-3xl bg-black text-white'
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
                                image: selectedLocation.image,
                                sig: data,
                                id: selectedLocation.id,
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
