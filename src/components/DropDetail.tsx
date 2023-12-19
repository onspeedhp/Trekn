import { Button, Drawer, Modal, Popover } from 'antd';
import { useState, TouchEvent, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaMapPin, FaUserFriends } from 'react-icons/fa';
import {
  calculateDistance,
  convertDistance,
} from '../functions/calculateDistance';
import Map, { Marker } from 'react-map-gl';

import {
  FaChevronDown,
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
} from 'react-icons/fa6';
import { mintCompressedNFT } from '../functions/mintCompressedNFT';
import { PublicKey } from '@solana/web3.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

export const DropDetail = ({
  selectedLocation,
  isDrawerVisible,
  setIsDrawerVisible,
}: {
  selectedLocation: any;
  isDrawerVisible: boolean;
  setIsDrawerVisible: (open: boolean) => void;
}) => {
  const user = useSelector((state: any) => state.user);
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState(0);
  const [mintStatus, setMintStatus] = useState('');
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const { setMetadata, windowSize, init } = useAuthContext();

  return (
    <Drawer
      placement='bottom'
      closable={false}
      onClose={() => setIsDrawerVisible(false)}
      open={isDrawerVisible}
      height={windowSize.height * 0.9}
      className='rounded-t-3xl'
    >
      <div className='flex-col' style={{ marginLeft: -4, marginRight: -4 }}>
        <div
          className='fixed absolute left-0 top-0 w-full bg-white rounded-t-3xl'
          style={{ height: 44, zIndex: 9999 }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='30'
            height='30'
            viewBox='0 0 30 30'
            fill='none'
            className='absolute right-0 m-3'
            onClick={() => setIsDrawerVisible(false)}
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
                <feFlood floodOpacity='0' result='BackgroundImageFix' />
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
            onClick={()=>{selectedLocation?.user.id !== user.id && navigate(`/account/${selectedLocation.user.id}`)}}
            alt=''
          />

          <div className='text-[13px] text-[#848484] font-medium ml-2'>
            {selectedLocation.user.name}
          </div>
        </div>

        <div className='font-bold	text-2xl mb-2'>{selectedLocation.name}</div>
        <div className='text-[13px] text-[#848484] font-medium mb-4'>
          {selectedLocation.location}
        </div>

        <div className='flex items-center justify-center mb-5'>
          {selectedLocation.imageArray &&
          selectedLocation.imageArray.length > 1 ? (
            <Swiper
              pagination={true}
              modules={[Pagination]}
              className='mySwiper'
            >
              {selectedLocation.imageArray.map((image: any, index: any) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt='Uploaded'
                    className='rounded-xl'
                    style={{
                      width: 339,
                      height: 339,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      zIndex: 10,
                    }}
                    key={index}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={selectedLocation.image}
              alt='Uploaded'
              className='rounded-xl'
              style={{
                width: 339,
                height: 339,
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 10,
              }}
            />
          )}
        </div>

        <div className='flex relative border-b' style={{ height: 60 }}>
          <div className='flex h-10 p-3 bg-[#F5F5F5] rounded-full'>
            <FaUserFriends size={16} />
            <span className='text-[13px] font-semibold ml-2'>
              {selectedLocation.collected} collected
            </span>
          </div>

          <Popover
            content={
              <>
                {reactions.map((item, index) => (
                  <div className='flex items-center justify-center' key={index}>
                    {item.icon}
                    <span className='text-[13px] font-medium ml-2'>
                      {selectedLocation?.reaction_counts?.length > 0 && selectedLocation.reaction_counts[`${index}`]}
                    </span>
                  </div>
                ))}
              </>
            }
            trigger='click'
            open={open}
            onOpenChange={setOpen}
            placement='bottom'
          >
            <div className='flex ml-2 h-10 p-3 bg-[#F5F5F5] rounded-full items-center'>
              <FaFaceLaughBeam size={16} className='text-[#66C61B]' />
              <span className='text-[13px] font-semibold ml-2'>
                {selectedLocation.reaction_counts && selectedLocation.reaction_counts['1']}
              </span>
              <FaChevronDown className='ml-2' />
            </div>
          </Popover>
        </div>

        <div className='flex items-center mb-[24px] mt-5'>
          <img src='./distance_away.svg' alt='' />
          <p className='font-bold text-[20px] ml-[10px]'>
            {convertDistance(distance)} away
          </p>
        </div>

        <div>
          <Map
            mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
            initialViewState={{
              longitude: selectedLocation.lng - 0.001,
              latitude: selectedLocation.lat,
              zoom: 14,
            }}
            style={{
              width: windowSize.width - 40,
              height: 100,
              borderRadius: 24,
              marginBottom: 20,
            }}
            mapStyle='mapbox://styles/mapbox/streets-v9'
          >
            <Marker
              longitude={selectedLocation.lng}
              latitude={selectedLocation.lat}
              anchor='bottom'
              onClick={() => {}}
            >
              <FaMapPin size={24} className='text-[#278EFF]' />
            </Marker>
          </Map>
        </div>

        <div className='font-medium	text-black opacity-50 mb-20'>
          {selectedLocation.description}
        </div>

        <div
          style={{
            height: 88,
            zIndex: 9999,
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
  );
};
