import { Button, Image, Input } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import GoogleMap from '../components/GoogleMap';
import LOS_ANGELES_CENTER from '../const/la_center';
import { useEffect, useState } from 'react';

const getInfoWindowString = (place: any) => `
    <div>
      <div style="font-size: 16px;">
        ${place.name}
      </div>
      <div style="font-size: 14px;">
        <span style="color: grey;">
        ${place.rating}
        </span>
        <span style="color: orange;">${String.fromCharCode(9733).repeat(
          Math.floor(place.rating)
        )}</span><span style="color: lightgrey;">${String.fromCharCode(
  9733
).repeat(5 - Math.floor(place.rating))}</span>
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.types[0]}
      </div>
      <div style="font-size: 14px; color: grey;">
        ${'$'.repeat(place.price_level)}
      </div>
      <div style="font-size: 14px; color: green;">
        ${place.opening_hours.open_now ? 'Open' : 'Closed'}
      </div>
    </div>`;

const handleApiLoaded = (
  map: any,
  maps: {
    Marker: new (arg0: { position: { lat: any; lng: any }; map: any }) => any;
    InfoWindow: new (arg0: { content: any }) => any;
  },
  places: any[]
) => {
  const markers: any[] = [];
  const infowindows: any[] = [];

  places.forEach((place) => {
    markers.push(
      new maps.Marker({
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        map,
      })
    );

    infowindows.push(
      new maps.InfoWindow({
        content: getInfoWindowString(place),
      })
    );
  });

  markers.forEach((marker, i) => {
    marker.addListener('click', () => {
      infowindows[i].open(map, marker);
    });
  });
};

export const MapView = () => {
  const navigate = useNavigate();
  const { coordsNow } = useAuthContext();

  const data_1 = { lng: 105.7753814, lat: 20.980762 };
  const [places, setPlaces] = useState<any>([]);

  useEffect(() => {
    fetch('places.json')
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((result: any) => {
          result.show = false;
        });

        setPlaces(data.results);
      });
  }, []);

  return (
    <>
      <div className=''>
        {/* <Image
          className='block'
          height={812}
          preview={false}
          src='./fake_map.png'
        />
        <Button
          onClick={() => {
            navigate('/drop-onboarding');
          }}
          style={{ marginLeft: 155 }}
          className='fixed bg-black bottom-0 rounded-full w-16 h-16 text-white flex items-center justify-center mb-4'
        >
          <FaPlus size={24} />
        </Button> */}

        <div
          className='rounded-xl h-screen'
          style={{
            width: '100%',
          }}
        >
          <GoogleMap
            defaultZoom={16}
            defaultCenter={data_1}
            bootstrapURLKeys={{
              key: process.env.REACT_APP_JAVASCRIPT_API_KEY!,
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }: { map: any; maps: any }) => {
              // handleApiLoaded(map, maps, places);
            }}
          />
        </div>
      </div>
    </>
  );
};
