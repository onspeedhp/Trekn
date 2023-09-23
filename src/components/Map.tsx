import React from 'react';
import GoogleMapReact from 'google-map-react';
import { DetailCardProps } from './DetailCard';

function Map({ data, coordsNow }: MapProps) {
  return (
    <div style={{ height: '100%' }}>
      {data?._id && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API as string }}
          defaultZoom={15}
          defaultCenter={{
            lat: data?.latitude,
            lng: data?.longitude,
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
            new google.maps.Circle({
              strokeColor: 'green',
              strokeOpacity: 0.6,
              strokeWeight: 2,
              fillColor: 'green',
              fillOpacity: 0.1,
              map,
              center: {
                lat: data?.latitude,
                lng: data?.longitude,
              },
              radius: data?.radius,
            });
            new google.maps.Marker({
              position: {
                lat: coordsNow.lat,
                lng: coordsNow.log,
              },
              map: map,
              icon: {
                url: '/marker.png',
                scaledSize: new google.maps.Size(50, 50),
              },
            });
          }}
        />
      )}
    </div>
  );
}

export default Map;

interface MapProps extends DetailCardProps {
  coordsNow: { log: number; lat: number };
}
