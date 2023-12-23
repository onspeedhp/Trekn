import { useAuthContext } from '../context/AuthContext';
import { getAllDrops } from '../middleware/data/drop';
import { deepEqual } from './MapGoogle';
import { Button, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router';
import { FaPlus } from 'react-icons/fa6';
import React, { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import Map, { Marker } from 'react-map-gl';

import './style.css';
import { useSelector } from 'react-redux';
import { DropDetail } from '../components/DropDetail';

export const MapGL = () => {
  const navigate = useNavigate();
  const { windowSize } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

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
              navigate('/');
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
                  }}
                >
                  <svg
                    width='39'
                    height='43'
                    viewBox='0 0 39 43'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    key={index}
                  >
                    <path
                      d='M17.2293 40.454L17.2301 40.4551C18.2734 41.9623 20.5041 41.9624 21.5475 40.4551L21.5483 40.454C23.4911 37.6374 25.16 35.2599 26.5897 33.2231C29.1891 29.5197 30.998 26.9427 32.2259 24.901C33.1877 23.3017 33.8237 21.9835 34.2139 20.6657C34.606 19.3418 34.7383 18.0579 34.7383 16.5416C34.7383 8.06431 27.8661 1.19213 19.3888 1.19213C10.9115 1.19213 4.0393 8.06431 4.0393 16.5416C4.0393 18.0579 4.17159 19.3418 4.56366 20.6657C4.9539 21.9835 5.58994 23.3017 6.55174 24.901C7.77963 26.9427 9.58849 29.5197 12.1879 33.2231C13.6176 35.2599 15.2865 37.6375 17.2293 40.454ZM24.6399 16.5416C24.6399 19.4418 22.2889 21.7928 19.3888 21.7928C16.4887 21.7928 14.1377 19.4418 14.1377 16.5416C14.1377 13.6415 16.4887 11.2905 19.3888 11.2905C22.2889 11.2905 24.6399 13.6415 24.6399 16.5416Z'
                      fill='url(#paint0_linear_567_4001)'
                      stroke='#395324'
                      strokeWidth='1.61574'
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
                        <stop stopColor='#99FF48' />
                        <stop offset='1' stopColor='#D7FFB7' />
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
                    strokeWidth='5.14298'
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
                    colorInterpolationFilters='sRGB'
                  >
                    <feFlood floodOpacity='0' result='BackgroundImageFix' />
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
            <DropDetail
              selectedLocation={selectedLocation}
              isDrawerVisible={isDrawerVisible}
              setIsDrawerVisible={setIsDrawerVisible}
            />
          )}

          <Button
            onClick={() => {
              navigate('/check-in/nearby');
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
