import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { getLabelLocation } from '../utils/common.utils';
import parse from 'html-react-parser';
import { useAuthContext } from '../context/AuthContext';

export const DetailCard = ({ data, status }: { data: any; status?: any }) => {
  const navigate = useNavigate();
  const { Icon, label } = getLabelLocation(status, data?.distance);
  const { windowSize } = useAuthContext();

  return (
    <div
      className='w-full flex justify-center items-center rounded-xl relative my-2 cursor-pointer rounded-xl'
      style={{
        width: status === 'ReadyToCollect' ? 300 : windowSize.width - 40,
        height: 338,
        backgroundColor: '#525252',
        marginRight: status === 'ReadyToCollect' ? 12 : 0,
      }}
      onClick={() => {
        navigate(`/map-view/${data.id}`);
      }}
    >
      <div className='relative'>
        <div
          className='rounded-xl'
          style={{
            width: status === 'ReadyToCollect' ? 300 : windowSize.width - 40,
            height: 338,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          <img
            src={`${data.image}`}
            style={{
              width: status === 'ReadyToCollect' ? 300 : windowSize.width - 40,
              height: 338,
              borderRadius: 12,
            }}
          />
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 34.71%, rgba(0, 0, 0, 0.60) 77.95%)',
              borderRadius: 12,
            }}
          ></div>
        </div>
      </div>

      <div
        className='flex w-auto h-8 items-center justify-center text-sm text-black rounded-[60px] border-[1px] border-solid border-black absolute px-[12px] z-10 top-[12px] left-[16px]'
        style={{
          backgroundColor: status === 'ReadyToCollect' ? '#99FF48' : 'white',
        }}
      >
        {parse(Icon)}
        <div className='ml-1'>{label}</div>
      </div>
      <div className='flex-col text-white absolute bottom-[16px] left-[16px]'>
        <div className='font-medium	text-[13px] flex items-center'>
          <img
            className='rounded-full w-4 h-4 mr-1'
            src={`${data.author_image}`}
            alt=''
          />
          {data.author}
        </div>
        <div className='font-semibold	text-xl mb-1 mt-2'>{data?.name}</div>
        <div className='text-sm font-medium	opacity-70'>
          {data?.location_name}
        </div>
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
