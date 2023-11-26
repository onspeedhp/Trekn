import Map, { Layer, Marker, Source } from 'react-map-gl';
import { useAuthContext } from '../context/AuthContext';
import { deepEqual } from './MapGoogle'; // Hãy chắc chắn rằng bạn đã có hàm calculateDistance để tính toán khoảng cách.
import { useState, useCallback, useEffect } from 'react';
import type { MarkerDragEvent, LngLat, CircleLayer } from 'react-map-gl';
import { calculateDistance } from '../functions/calculateDistance';
import type { FeatureCollection } from 'geojson';
import { useNavigate } from 'react-router';
import { Button, Modal } from 'antd';
import axios from 'axios';
import { FaMapPin, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export const DraggableLocation = () => {
  const { setMetadata, windowSize, metadata } = useAuthContext();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const [edit, setEdit] = useState(false);

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Something is wrong',
      okButtonProps: {
        type: 'default',
        style: {
          background: 'red',
          color: 'white',
        },
      },
    });

    setTimeout(() => {
      setMetadata({});
      modal.destroy();
      navigate('/drop-onboarding/upload-image');
    }, 2000);
  };

  useEffect(() => {
    if (!metadata.image || !metadata.imageArray || !user.id) {
      handleError();
    }
    handleReverseGeocode(user.lat, user.lng);
  }, []);
  const [marker, setMarker] = useState({
    latitude: user.lat,
    longitude: user.lng,
  });
  const [events, logEvents] = useState<Record<string, LngLat>>({});

  const onMarkerDragStart = useCallback((event: MarkerDragEvent) => {
    logEvents((_events: any) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback(async (event: MarkerDragEvent) => {
    logEvents((_events: any) => ({ ..._events, onDrag: event.lngLat }));

    const distance = calculateDistance(
      user.lat,
      user.lng,
      event.lngLat.lat,
      event.lngLat.lng
    );

    if (distance <= 100) {
      setMarker({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });

      await handleReverseGeocode(event.lngLat.lat, event.lngLat.lng);
    }
  }, []);

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    logEvents((_events: any) => ({ ..._events, onDragEnd: event.lngLat }));
  }, []);

  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [user.lng, user.lat],
        },
        properties: null,
      },
    ],
  };

  const [address, setAddress] = useState<string>('');
  const handleReverseGeocode = async (lat: any, lng: any) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${process.env.REACT_APP_GEOAPIFY}`
      );
      setAddress(response.data.features[0].properties.formatted);
    } catch (error) {
      console.error('Error fetching address: ', error);
    }
  };

  const layerStyle: CircleLayer = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 100,
      'circle-color': '#C8E4FF',
      'circle-opacity': 0.6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#4886FF',
      'circle-stroke-opacity': 1,
    },
  };

  return (
    <>
      <div
        className='bg-black absolute'
        style={{ height: 812, width: windowSize.width }}
      >
        <div className='m-5 text-white font-semibold'>
          {edit ? (
            <div className='mb-12 flex items-center relative'>
              <div className='text-white text-2xl font-semibold mb-2'>
                Edit location
              </div>
              <FaTimesCircle
                onClick={() => {
                  setEdit(false);
                }}
                size={24}
                className='absolute right-0 text-[#FFFFFFB2] opacity-70'
              />
            </div>
          ) : (
            <>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='17'
                height='16'
                viewBox='0 0 17 16'
                fill='none'
                className='mb-6'
                onClick={() => {
                  navigate('/drop-onboarding/upload-image');
                }}
              >
                <path
                  d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                  fill='white'
                  fillOpacity='0.7'
                />
              </svg>
              <div className='mb-12'>
                <div className='text-white text-2xl font-semibold mb-2'>
                  Where can people find it?
                </div>
                <div className='text-white text-base font-normal opacity-70'>
                  Pin it on the map so others can find it.
                </div>
              </div>
            </>
          )}

          <div className='flex text-[13px] mb-4 relative'>
            {edit ? (
              <>
                <div className='text-white flex items-center'>
                  <FaMapPin size={16} className='mr-1' />
                  <div className='text-white opacity-70'>{address}</div>
                </div>
              </>
            ) : (
              <>
                <div className='flex-col' style={{ width: 239 }}>
                  <div className='text-white flex items-center'>
                    <FaMapPin size={16} className='mr-1' />
                    Your current location
                  </div>
                  <div className='text-white opacity-70 ml-5'>{address}</div>
                </div>
                <div
                  className='absolute inset-y-0 right-0 text-[#99FF48] flex w-20'
                  style={{ width: 80 }}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Edit location
                </div>
              </>
            )}
          </div>
          <div className='flex justify-center'>
            <Map
              mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
              initialViewState={{
                longitude: !user.lng ? 105.8342 : user.lng,
                latitude: !user.lat ? 21.0278 : user.lat,
                zoom: 16,
              }}
              style={{
                width: windowSize.width - 40,
                height: 259,
                borderRadius: 24,
              }}
              mapStyle='mapbox://styles/mapbox/streets-v9'
            >
              {edit && (
                <Source id='my-data' type='geojson' data={geojson}>
                  <Layer {...layerStyle} />
                </Source>
              )}

              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                anchor='center'
                draggable
                onDragStart={onMarkerDragStart}
                onDrag={onMarkerDrag}
                onDragEnd={onMarkerDragEnd}
              >
                <FaMapPin size={24} className='text-[#278EFF]' />
              </Marker>
            </Map>
          </div>

          <Button
            className='bg-[#2E2E2E] text-white w-full h-12 rounded-3xl font-semibold text-base border-0'
            style={{ marginTop: 63 }}
            onClick={() => {
              if (edit) {
                setEdit(false);
              } else {
                setMetadata({
                  ...metadata,
                  location: address,
                  location_name: address,
                  lat: marker.latitude,
                  lng: marker.longitude,
                });
                navigate('/drop-onboarding/enter-info');
              }
            }}
          >
            {edit ? 'Confirm' : 'Continue'}
          </Button>
        </div>
      </div>
    </>
  );
};
