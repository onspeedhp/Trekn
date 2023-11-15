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
import { FaMapPin, FaUserFriends, FaCamera, FaBolt } from 'react-icons/fa';
import { Button, Drawer, Modal } from 'antd';
import { CustomWebcam } from '../components/CustomWebcam';
import {
  FaChevronDown,
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
} from 'react-icons/fa6';
import Map, { Marker } from 'react-map-gl';
import { mintCompressedNFT } from '../functions/mintCompressedNFT';
import { PublicKey } from '@solana/web3.js';

export const DropDetailPage = () => {
  const { dropId } = useParams();
  const user = useSelector((state: any) => state.user);
  const [selectedLocation, setSelectedLocation] = useState<any>({});
  const [mintStatus, setMintStatus] = useState('');
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
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

          // if (!user.id) {
          //   setMintStatus('Login to collect');
          //   setDisable(false);
          // } else {
          //   setMintStatus('Collect');
          //   if (!data[0].radius || distance <= data[0].radius) {
          //     setDisable(false);
          //   } else {
          //     setDisable(true);
          //     setMintStatus('Move closer to collect');
          //   }
          // }
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
            navigate('/');
          }}
        >
          <path
            d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
            fill='black'
            fillOpacity='0.7'
          />
        </svg>
        <div className='flex items-center mt-5 mb-2'>
          <img
            className='rounded-full w-6 h-6'
            src={`${selectedLocation?.user?.profileImage}`}
            alt=''
          />

          <div className='text-[13px] text-[#848484] font-medium ml-2'>
            {selectedLocation?.user?.name}
          </div>
        </div>

        <div className='font-bold	text-2xl mb-2'>{selectedLocation.name}</div>
        <div className='text-[13px] text-[#848484] font-medium mb-4'>
          {selectedLocation.location}
        </div>

        <div className='flex items-center justify-center mb-4'>
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

        <div className='font-medium	text-black opacity-50 mb-6 px-2 text-[15px] pb-5 border-b'>
          {selectedLocation.description}
        </div>

        <div>
          <div className='mb-4 text-[#020303] text-xl font-bold'>Location</div>
          <div className='text-[13px] text-black opacity-50 font-medium mb-4'>
            {selectedLocation.location}
          </div>
          <div className='border-b pb-5 mb-6'>
            <Map
              mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
              // initialViewState={{
              //   longitude: selectedLocation.lng - 0.001,
              //   latitude: selectedLocation.lat,
              //   zoom: 14,
              // }}
              style={{
                width: windowSize.width - 40,
                height: 100,
                borderRadius: 24,
              }}
              mapStyle='mapbox://styles/mapbox/streets-v9'
            >
              {/* <Marker
              longitude={selectedLocation.lng}
              latitude={selectedLocation.lat}
              anchor='bottom'
              onClick={() => {}}
            >
              <FaMapPin size={24} className='text-[#278EFF]' />
            </Marker> */}
            </Map>
          </div>

          {selectedLocation?.minted?.length > 0 && (
            <>
              <div className='text-[#020303] text-xl font-bold'>
                Other check-ins
              </div>
              <div className='my-6'> </div>
            </>
          )}
        </div>

        <Button
          className='h-12 rounded-3xl text-white bg-black'
          style={{ width: windowSize.width - 40 }}
          loading={loading}
          onClick={async () => {
            setOpenDrawer(true);
            // if (user.address) {
            //   setLoading(true);
            //   await mintCompressedNFT({
            //     drop: selectedLocation,
            //     userAddress: new PublicKey(user.address),
            //     userId: user.id,
            //     onSuccess: (data: any) => {
            //       setMetadata({
            //         sig: data,
            //         ...selectedLocation,
            //       });
            //       navigate('/collect-success');
            //     },
            //     onError: (error) => {
            //       Modal.error({
            //         title: 'Error',
            //         content: error,
            //         okButtonProps: {
            //           type: 'default',
            //           style: {
            //             background: 'red',
            //             color: 'white',
            //           },
            //         },
            //       });
            //     },
            //   });
            //   setLoading(false);
            // } else {
            //   setLoading(true);
            //   await init();
            //   setLoading(false);
            // }
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
          <div className='flex-col' style={{ marginLeft: -4, marginRight: -4 }}>
            <Button className='flex font-semibold w-full rounded-3xl h-20 bg-[#F6F6F6] items-center justify-center mb-4 border-0 mt-[45px]'>
              <FaCamera size={32} className='mr-3' />
              Check-in with your photo
            </Button>
            <Button className='flex font-semibold w-full rounded-3xl h-20 bg-[#F6F6F6] items-center justify-center border-0'>
              <FaBolt size={32} className='mr-3' />
              Check-in now
            </Button>
          </div>
        </Drawer>

        <CustomWebcam />
      </div>
    </>
  );
};
