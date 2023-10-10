import React from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';

// Define the prop types using TypeScript interfaces
interface GoogleMapProps {
  children?: React.ReactNode | React.ReactNode[];
  [key: string]: any; // This allows for any other props to be passed to GoogleMapReact
}

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

const GoogleMap: React.FC<GoogleMapProps> = ({ children, ...props }) => (
  <Wrapper>
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_JAVASCRIPT_API_KEY!,
      }}
      {...props}
    >
      {children}
    </GoogleMapReact>
  </Wrapper>
);

export default GoogleMap;
