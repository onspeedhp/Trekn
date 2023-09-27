import React from 'react';
import styled from 'styled-components';

// Define the prop types using TypeScript interfaces
interface MarkerProps {
  text: string;
  onClick?: () => void;
}

const Wrapper = styled.div<{ onClick?: () => void }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

const Marker: React.FC<MarkerProps> = ({ text, onClick }) => (
  <Wrapper data-alt={text} onClick={onClick} />
);

export default Marker;
