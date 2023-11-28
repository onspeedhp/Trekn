import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getDropByID } from '../middleware/data/drop';
import { useAuthContext } from '../context/AuthContext';
import { calculateDistance } from '../functions/calculateDistance';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import {
  FaMapPin,
  FaUserFriends,
  FaCamera,
  FaBolt,
  FaThumbsUp,
} from 'react-icons/fa';
import { Button, Carousel, Drawer, Modal } from 'antd';
import { CustomWebcam } from '../components/CustomWebcam';
import {
  FaChevronDown,
  FaCirclePlus,
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
} from 'react-icons/fa6';
import Map, { Marker } from 'react-map-gl';
import { mintCompressedNFT } from '../functions/mintCompressedNFT';
import { PublicKey } from '@solana/web3.js';
import moment from 'moment';
import { getScore } from '../utils/account.util';

export const DropDetailPage = () => {
  const { dropId } = useParams();
  const user = useSelector((state: any) => state.user);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mintStatus, setMintStatus] = useState('');
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userChecked, setUserChecked] = useState<any>([]);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (dropId) {
      getDropByID({
        dropId: dropId,
        onSuccess: (data) => {
          setSelectedLocation(data[0]);

          const distance = Math.ceil(
            calculateDistance(user.lat, user.lng, data[0].lat, data[0].lng)
          );

          setUserChecked(data[0].minted);

          if (!user.id) {
            setMintStatus('Login to Collect');
            setDisable(false);
          } else {
            let minted = false;
            if (data[0].minted.length >= 0) {
              for (let user_mint of data[0].minted) {
                if (user_mint.user.id === user.id) {
                  minted = true;
                }
              }
            }

            if (minted) {
              setDisable(true);
              setMintStatus('Collected');
            } else {
              if (!data[0].radius || distance <= data[0].radius) {
                setDisable(false);
                setMintStatus('Collect');
              } else {
                setDisable(true);
                setMintStatus('Move closer to collect');
              }
            }
          }
        },
      });
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const { setMetadata, windowSize, init } = useAuthContext();

  return (
    <>
      <div className='flex-col m-5'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          className='mb-6'
          onClick={() => {
            navigate(-1);
          }}
        >
          <path
            d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
            fill='black'
            fillOpacity='0.7'
          />
        </svg>
        {selectedLocation && (
          <>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-3'>
                <div className='flex gap-2'>
                  <img
                    className='rounded-full w-10 h-10'
                    src={`${selectedLocation.user.profileImage}`}
                    alt=''
                  />
                  <div>
                    <div className='text-[15px] font-medium leading-4 mb-2'>
                      {selectedLocation.user.name}
                    </div>
                    <div className='flex items-center gap-1 leading-4'>
                      <FaCirclePlus className='w-3 h-3' />
                      <div className='text-[13px] text-[#02030380] font-medium'>
                        {moment(selectedLocation.created_at).format(
                          'Do MMM, h:mm A'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='text-xl leading-9 font-semibold'>
                  {selectedLocation.name}
                </div>
                <div className='flex items-center gap-2'>
                  <div className='font-medium flex items-center gap-1'>
                    <FaThumbsUp className='w-4 h-4 text-[#FFB800]' />
                    <div className='text-[13px] text-[#000000b3] font-medium whitespace-nowrap leading-5'>
                      {selectedLocation && getScore(selectedLocation, true)}
                    </div>
                  </div>
                  <div className='rounded-full bg-[#dfdfdf70] min-w-[8px] h-2'></div>
                  <div className='text-[13px] text-[#02030380] font-medium truncate leading-4'>
                    {selectedLocation.location_name}
                  </div>
                </div>
              </div>
              <div>
                <div style={{
                  height: 335,
                }}
                  className='mb-4'>
                  {selectedLocation.imageArray ?
                    <Carousel swipeToSlide draggable style={{ height: '100%', width: '100%' }}>
                      {selectedLocation.imageArray.map((item: string, idx: number) => (
                        <img
                          key={idx}
                          src={`${item}`}
                          alt=''
                          className='rounded-xl h-full w-full object-cover object-center'
                        />
                      ))}
                    </Carousel>
                    :
                    <img
                      src={`${selectedLocation.image}`}
                      alt=''
                      className='rounded-xl h-full w-full object-cover object-center'
                    />
                  }
                </div>
                <div className='text-[#02030380] font-medium text-[15px] leading-6 px-2'>
                  {selectedLocation.description}
                </div>
                <div className='border-b mt-5'></div>
              </div>
              <div className='flex flex-col gap-4'>
                <div className='leading-10 text-xl font-bold leading-[13px]'>Location</div>
                <div className='leading-4 text-[#02030380] font-medium leading-1'>
                  {selectedLocation.location}
                </div>
                <Map
                  mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
                  initialViewState={{
                    longitude: selectedLocation.lng - 0.001,
                    latitude: selectedLocation.lat,
                    zoom: 14,
                  }}
                  style={{
                    height: 200,
                    borderRadius: 24,
                  }}
                  mapStyle='mapbox://styles/mapbox/streets-v9'
                >
                  <Marker
                    longitude={selectedLocation.lng}
                    latitude={selectedLocation.lat}
                    anchor='bottom'
                    onClick={() => { }}
                  >
                    <FaMapPin size={24} className='text-[#278EFF]' />
                  </Marker>
                </Map>
                <div className='border-b'></div>
              </div>
              <div className='leading-10 text-xl font-bold'>
                Other check-ins
              </div>
              <div className='flex flex-col gap-4'>
                {userChecked && userChecked.length > 0 ? (
                  userChecked.map((minted: any, idx: number) => (
                    <div className='flex items-center gap-3' key={idx}>
                      <img
                        src={minted.user.profileImage}
                        alt='main user'
                        className='rounded-full w-12 h-12'
                      />
                      <div className='text-base font-medium'>
                        {minted.user.name}
                      </div>
                      <div className='rounded-full bg-[#F5F5F5] py-2 px-3 text-[13px] text-[#828282] font-medium'>
                        {minted.user.address.slice(0, 2)}...
                        {minted.user.address.slice(-6, -1)}
                      </div>
                      <FaFaceKissWinkHeart
                        size={24}
                        className='text-black ml-auto'
                      />
                    </div>
                  ))
                ) : (
                  <div className='flex justify-center items-center flex-col gap-4 bg-[#F5F5F5] rounded-lg py-9 px-16'>
                    <img src='/traveler.svg' alt='' />
                    <p>Be the first one checked in here</p>
                  </div>
                )}
              </div>

              <Button
                className='h-12 rounded-3xl text-white bg-black'
                style={{ width: windowSize.width - 40 }}
                loading={loading}
                onClick={async () => {
                  setOpenDrawer(true);
                }}
                disabled={disable}
              >
                {mintStatus}
              </Button>

              <Drawer
                height={265}
                open={openDrawer}
                placement='bottom'
                className='rounded-t-3xl h-[265px] relative'
                onClose={() => {
                  setOpenDrawer(false);
                }}
                closeIcon={false}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30'
                  height='30'
                  viewBox='0 0 30 30'
                  fill='none'
                  className='absolute right-3 top-3'
                  onClick={() => setOpenDrawer(false)}
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
                <div
                  className='flex-col'
                  style={{ marginLeft: -4, marginRight: -4 }}
                >
                  <Button
                    className='flex font-semibold w-full rounded-3xl h-20 bg-[#F6F6F6] items-center justify-center mb-4 border-0 mt-[45px]'
                    // disabled={true}
                    onClick={() => {
                      navigate('/collect-with-photo');
                    }}
                  >
                    <FaCamera size={32} className='mr-3' />
                    Check-in with your photo
                  </Button>
                  <Button
                    loading={loading}
                    className='flex font-semibold w-full rounded-3xl h-20 bg-[#F6F6F6] items-center justify-center border-0'
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
                    }}
                  >
                    <FaBolt size={32} className='mr-3' />
                    Check-in now
                  </Button>
                </div>
              </Drawer>
            </div>
          </>
        )}

        {/* <CustomWebcam /> */}
      </div>
    </>
  );
};
