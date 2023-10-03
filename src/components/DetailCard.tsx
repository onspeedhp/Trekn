import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { getLabelLocation } from '../utils/common.utils';
import { LocationDetail } from '../models/types';
import parse from 'html-react-parser';

export const DetailCard = ({ data, status }: { data: any; status?: any }) => {
  const navigate = useNavigate();

  // const { Icon, label } = useMemo(() => {
  //   return getStatusLocation(data?.distance, data?.radius);
  // }, [data]);
  const { Icon, label } = getLabelLocation(status, data?.distance);

  return (
    <div
      className='w-full flex justify-center items-center rounded-xl relative my-2 cursor-pointer rounded-xl'
      style={{
        width: status === 'ReadyToCollect' ? 300 : 335,
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
            width: status === 'ReadyToCollect' ? 300 : 335,
            height: 338,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          <img
            src={`${data.image}`}
            style={{
              width: status === 'ReadyToCollect' ? 300 : 335,
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            className='mr-1'
          >
            <g clipPath='url(#clip0_51_2559)'>
              <mask
                id='mask0_51_2559'
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='16'
                height='16'
              >
                <path
                  d='M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8Z'
                  fill='white'
                />
              </mask>
              <g mask='url(#mask0_51_2559)'>
                <path d='M6 0H4V2H6V0Z' fill='#FFAD08' />
                <path d='M10 0H8V2H10V0Z' fill='#EDD75A' />
                <path d='M14 0H12V2H14V0Z' fill='#EDD75A' />
                <path d='M4 0H2V2H4V0Z' fill='#EDD75A' />
                <path d='M8 0H6V2H8V0Z' fill='#FFAD08' />
                <path d='M12 0H10V2H12V0Z' fill='#EDD75A' />
                <path d='M16 0H14V2H16V0Z' fill='#FFAD08' />
                <path d='M2 2H0V4H2V2Z' fill='#EDD75A' />
                <path d='M2 4H0V6H2V4Z' fill='#73B06F' />
                <path d='M2 6H0V8H2V6Z' fill='#FFAD08' />
                <path d='M2 8H0V10H2V8Z' fill='#0C8F8F' />
                <path d='M2 10H0V12H2V10Z' fill='#EDD75A' />
                <path d='M2 12H0V14H2V12Z' fill='#73B06F' />
                <path d='M2 14H0V16H2V14Z' fill='#FFAD08' />
                <path d='M6 2H4V4H6V2Z' fill='#FFAD08' />
                <path d='M6 4H4V6H6V4Z' fill='#EDD75A' />
                <path d='M6 6H4V8H6V6Z' fill='#FFAD08' />
                <path d='M6 8H4V10H6V8Z' fill='#73B06F' />
                <path d='M6 10H4V12H6V10Z' fill='#EDD75A' />
                <path d='M6 12H4V14H6V12Z' fill='#FFAD08' />
                <path d='M6 14H4V16H6V14Z' fill='#405059' />
                <path d='M10 2H8V4H10V2Z' fill='#405059' />
                <path d='M10 4H8V6H10V4Z' fill='#0C8F8F' />
                <path d='M10 6H8V8H10V6Z' fill='#EDD75A' />
                <path d='M10 8H8V10H10V8Z' fill='#FFAD08' />
                <path d='M10 10H8V12H10V10Z' fill='#FFAD08' />
                <path d='M10 12H8V14H10V12Z' fill='#EDD75A' />
                <path d='M10 14H8V16H10V14Z' fill='#FFAD08' />
                <path d='M14 2H12V4H14V2Z' fill='#73B06F' />
                <path d='M14 4H12V6H14V4Z' fill='#FFAD08' />
                <path d='M14 6H12V8H14V6Z' fill='#73B06F' />
                <path d='M14 8H12V10H14V8Z' fill='#EDD75A' />
                <path d='M14 10H12V12H14V10Z' fill='#405059' />
                <path d='M14 12H12V14H14V12Z' fill='#FFAD08' />
                <path d='M14 14H12V16H14V14Z' fill='#FFAD08' />
                <path d='M4 2H2V4H4V2Z' fill='#FFAD08' />
                <path d='M4 4H2V6H4V4Z' fill='#0C8F8F' />
                <path d='M4 6H2V8H4V6Z' fill='#EDD75A' />
                <path d='M4 8H2V10H4V8Z' fill='#FFAD08' />
                <path d='M4 10H2V12H4V10Z' fill='#FFAD08' />
                <path d='M4 12H2V14H4V12Z' fill='#73B06F' />
                <path d='M4 14H2V16H4V14Z' fill='#405059' />
                <path d='M8 2H6V4H8V2Z' fill='#FFAD08' />
                <path d='M8 4H6V6H8V4Z' fill='#EDD75A' />
                <path d='M8 6H6V8H8V6Z' fill='#FFAD08' />
                <path d='M8 8H6V10H8V8Z' fill='#EDD75A' />
                <path d='M8 10H6V12H8V10Z' fill='#EDD75A' />
                <path d='M8 12H6V14H8V12Z' fill='#EDD75A' />
                <path d='M8 14H6V16H8V14Z' fill='#0C8F8F' />
                <path d='M12 2H10V4H12V2Z' fill='#FFAD08' />
                <path d='M12 4H10V6H12V4Z' fill='#405059' />
                <path d='M12 6H10V8H12V6Z' fill='#FFAD08' />
                <path d='M12 8H10V10H12V8Z' fill='#EDD75A' />
                <path d='M12 10H10V12H12V10Z' fill='#0C8F8F' />
                <path d='M12 12H10V14H12V12Z' fill='#FFAD08' />
                <path d='M12 14H10V16H12V14Z' fill='#0C8F8F' />
                <path d='M16 2H14V4H16V2Z' fill='#405059' />
                <path d='M16 4H14V6H16V4Z' fill='#EDD75A' />
                <path d='M16 6H14V8H16V6Z' fill='#73B06F' />
                <path d='M16 8H14V10H16V8Z' fill='#FFAD08' />
                <path d='M16 10H14V12H16V10Z' fill='#405059' />
                <path d='M16 12H14V14H16V12Z' fill='#0C8F8F' />
                <path d='M16 14H14V16H16V14Z' fill='#EDD75A' />
              </g>
            </g>
            <defs>
              <clipPath id='clip0_51_2559'>
                <rect width='16' height='16' fill='white' />
              </clipPath>
            </defs>
          </svg>
          Undefined
        </div>
        <div className='font-semibold	text-xl'>{data?.name}</div>
        <div className='text-sm font-medium	opacity-70'>
          {data?.location_name}, {data?.location}
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

export interface DetailCardProps {
  data: LocationDetail;
}
