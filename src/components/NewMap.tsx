import React from 'react';
import GoogleMapReact from 'google-map-react';

function NewMap({
  data,
  coordsNow,
}: {
  data: any;
  coordsNow: { log: number; lat: number };
}) {
  return (
    <div style={{ height: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_JAVASCRIPT_API_KEY!,
        }}
        defaultZoom={16}
        defaultCenter={{ lat: coordsNow?.lat, lng: coordsNow?.log }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          new google.maps.Marker({
            position: {
              lat: data.lat,
              lng: data.log,
            },
            map: map,
            icon: {
              url: '/location.png',
              scaledSize: new google.maps.Size(38.7, 38.7),
            },
            clickable: true,
            title: 'Some thing',
          });

          new google.maps.Marker({
            position: {
              lat: coordsNow.lat,
              lng: coordsNow.log,
            },
            map: map,
            icon: {
              url: '/marker_new.png',
              scaledSize: new google.maps.Size(30, 30),
            },
          });
        }}
      />
    </div>
  );
}

export default NewMap;
