import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { getStatusLocation } from '../utils/common.utils';
import { LocationDetail } from '../models/types';
import { Carousel } from 'react-responsive-carousel';

export const DetailCard = ({ data }: DetailCardProps) => {
  const navigate = useNavigate();

  const { Icon, label, status } = useMemo(() => {
    return getStatusLocation(data?.distance, data?.radius);
  }, [data]);

  return (
    <div
      className='w-full flex justify-center items-center rounded-xl relative my-2 cursor-pointer overflow-hidden'
      style={{
        height: status === 'readyToMint' ? 338 : 338,
        backgroundColor: '#525252',
      }}
      onClick={() => {
        navigate(`/details/${data._id}`);
      }}
    >
      <Carousel
        emulateTouch
        dynamicHeight
        showStatus={false}
        showThumbs={false}
        autoPlay
        showArrows={false}
        showIndicators={false}
        infiniteLoop
      >
        {data.locationPhotos.map((item, index) => (
          <img key={index} src={item.photoLink} alt='' />
        ))}
      </Carousel>
      <div className='flex w-auto h-8 items-center justify-center text-sm text-white rounded-[60px] border-[1px] border-solid border-white absolute px-[12px] backdrop-blur absolute z-50 top-[12px] left-[16px]'>
        <Icon style={{ marginRight: '5px' }} />
        <div>{label}</div>
      </div>
      <div className='flex-col text-white absolute bottom-[16px] left-[16px]'>
        <div className='font-semibold	text-xl'>{data?.name}</div>
        <div className='text-sm font-medium	'>{data?.address}</div>
      </div>
      {status === 'readyToMint' && (
        <div className='w-auto h-[40px] flex flex-row items-center justify-center absolute bottom-[28px] right-[16px] bg-white px-[20px] rounded-[32px] z-50'>
          <img src='./pin-icon.png' alt='' className='w-[20px] h-[20px]' />
          <p className='text-[14px]'>Go to mint</p>
        </div>
      )}
    </div>
  );
};

export interface DetailCardProps {
  data: LocationDetail;
}
