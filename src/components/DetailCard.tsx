import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getLabelLocation } from '../utils/common.utils';
import parse from 'html-react-parser';
import { useAuthContext } from '../context/AuthContext';
import { DropDetail } from './DropDetail';
import { FaMapPin, FaPlusCircle, FaThumbsUp } from 'react-icons/fa';
import moment from 'moment';

interface ImageProps {
  src: string;
  alt?: string;
}

export const DetailCard = ({ data, status }: { data: any; status?: any }) => {
  // const navigate = useNavigate();
  const { Icon, label } = getLabelLocation(status, data?.distance);
  const { windowSize } = useAuthContext();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const overlap = 13.75;
  const images: ImageProps[] = [
    { src: `${data.user.profileImage}`, alt: 'Image 1' },
    { src: `${data.user.profileImage}`, alt: 'Image 2' },
    { src: `${data.user.profileImage}`, alt: 'Image 3' },
  ];

  return (
    <>
      <DropDetail
        selectedLocation={data}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
      />
      <div className='flex items-center' key={data.id}>
        <img
          src={`${data.user.profileImage}`}
          className='w-10 h-10 mr-2 rounded-full'
          alt=''
        />
        <div className='flex-col'>
          <span className='font-medium mb-2'>{data.user.name}</span>
          <div className='flex items-center'>
            <FaPlusCircle size={12} />
            <span className='font-medium text-black opacity-50 ml-1'>
              Created on {moment(data.created_at).format('Do MMM')}
            </span>
          </div>
        </div>
      </div>
      <div
        className='w-full flex justify-center items-center rounded-xl relative mt-3 cursor-pointer rounded-xl'
        style={{
          width: windowSize.width - 40,
          height: 377,
          backgroundColor: '#525252',
          marginRight: status === 'ReadyToCollect' ? 12 : 0,
        }}
        onClick={() => {
          setIsDrawerVisible(true);
        }}
      >
        <div className='relative'>
          <div
            className='rounded-xl'
            style={{
              width: windowSize.width - 40,
              height: 377,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          >
            <img
              src={`${data.image}`}
              style={{
                width: windowSize.width - 40,
                height: 377,
                borderRadius: 12,
                objectFit: 'cover',
                objectPosition: 'center',
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

        {status === 'ReadyToCollect' && (
          <div
            className='flex w-auto h-8 items-center justify-center text-sm text-black rounded-[60px] border-[1px] border-solid border-black absolute px-[12px] z-10 top-[12px] left-[16px]'
            style={{
              backgroundColor:
                status === 'ReadyToCollect' ? '#99FF48' : 'white',
            }}
          >
            {parse(Icon)}
            <div className='ml-1'>Ready to checkin</div>
          </div>
        )}

        <div className='flex-col text-white absolute bottom-[16px] left-[16px]'>
          <div className='font-semibold	text-base'>{data?.name}</div>
          <div className='flex items-center text-base'>
            <div className='flex items-center justify-center mr-2'>
              <FaThumbsUp className='text-[#FFB800] mr-1' />
              <span className='text-[14px] text-white opacity-70'>4.9</span>
            </div>
            <div className='flex items-center justify-center text-white opacity-70 text-[14px]'>
              <span className='mr-2 w-[11px]'>●</span> {label} away
            </div>
          </div>
          <div className='mt-4 mb-5 flex items-center'>
            <div className='relative h-[27.5px] flex justify-start items-center w-[55px]'>
              {images.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  style={{
                    border: '1.146px solid #FFF',
                    position: 'absolute',
                    width: '27.5px',
                    height: '27.5px',
                    borderRadius: '50%',
                    left: `${index * overlap}px`, // Chồng lên 40%
                    zIndex: index + 1,
                  }}
                />
              ))}
            </div>

            <div className='bg-white text-black ml-2 p-2 text-[13px] font-medium rounded-full'>
              12 checked-in
            </div>
          </div>
        </div>
      </div>

      <div className='border-b mt-6 mb-6'></div>
    </>
  );
};
