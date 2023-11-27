import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { checkTimeAgo, getLabelLocation } from '../utils/common.utils';
import parse from 'html-react-parser';
import { useAuthContext } from '../context/AuthContext';
import { DropDetail } from './DropDetail';
import { FaMapPin, FaPlusCircle, FaThumbsUp } from 'react-icons/fa';
import moment from 'moment';
import {
  calculateDistance,
  convertDistance,
} from '../functions/calculateDistance';
import { getUserByDropId } from '../middleware/data/user';
import LazyImageCustom from './LazyImageCustom';
import { getScore } from '../utils/account.util';
import { Carousel } from 'antd';
import './detailCard.css';

interface ImageProps {
  src: string;
  alt?: string;
}

export const DetailCard = ({ data, status }: { data: any; status?: any }) => {
  const navigate = useNavigate();
  const { Icon, label } = getLabelLocation(status, data?.distance);
  const { windowSize } = useAuthContext();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [userChecked, setUserChecked] = useState([]);
  const location = useLocation();
  const [lastChecked, setLastChecked] = useState<any>(null);

  const overlap = 13.75;

  const isHome = () => {
    return location.pathname === '/' || location.pathname === '/home';
  };

  useEffect(() => {
    getUserByDropId({
      dropId: data.drop_id || data.id,
      onSuccess: (res) => {
        setUserChecked(res);

        if (res) {
          for (let userChecked of res) {
            if (userChecked.minted.length > 0) {
              const have_last_checked =
                moment().unix() -
                moment(userChecked.minted[0].created_at).unix() <=
                60 * 60 * 24 * 2;

              if (have_last_checked) {
                setLastChecked(userChecked);
              }
            }
          }
        }
      },
    });
  }, []);

  const getWidth = () => {
    if (userChecked.length > 1) {
      return `${22.4 * userChecked.length}px`;
    }
    return '28px';
  };

  return (
    <div className={`${isHome() ? 'pb-6' : 'pb-8'} detail-card`}>
      {isHome() && (
        <DropDetail
          selectedLocation={data}
          isDrawerVisible={isDrawerVisible}
          setIsDrawerVisible={setIsDrawerVisible}
        />
      )}
      {isHome() && lastChecked && (
        <>
          <div className='text-[13px] text-black opacity-70 flex items-center px-1 mb-3'>
            <FaMapPin className='w-3 h-3 mr-2' /> {lastChecked.name} checkin{' '}
            {moment(lastChecked.minted[0].created_at).startOf('hour').fromNow()}
          </div>
        </>
      )}

      <div className='flex items-center' key={data.id}>
        <img
          src={`${data.user.profileImage}`}
          className='w-10 h-10 mr-2 rounded-full'
          alt=''
        />

        <div className='flex-col'>
          <span className='font-medium mb-2'>{data.user.name}</span>
          <div className='flex items-center'>
            {isHome() ? (
              <FaPlusCircle size={12} />
            ) : data?.type === 'minted' ? (
              <FaMapPin className='w-3 h-3' />
            ) : (
              <FaPlusCircle className='w-3 h-3' />
            )}
            <span className='font-medium text-black text-[13px] opacity-50 ml-1'>
              {checkTimeAgo(data.created_at)}
            </span>
          </div>
        </div>
      </div>
      <div
        className='flex justify-center items-center rounded-xl relative mt-3 cursor-pointer rounded-xl'
        style={{
          height: 377,
          backgroundColor: '#525252',
        }}
        onClick={() => {
          // setIsDrawerVisible(true);
          navigate(`/drop/details/${data.id}`);
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
            {data?.drop?.imageArray || data?.imageArray ?
              <>
                <Carousel swipeToSlide draggable style={{ height: '100%', width: '100%' }}>
                  {(data.imageArray
                    ? data.imageArray
                    : data?.drop?.imageArray
                  )?.map((item: string, idx: number) => (
                    <LazyImageCustom
                      key={idx}
                      src={item}
                      alt='Drop Img'
                      className='skeleton h-full object-cover rounded-xl object-center'
                    />
                  ))}
                </Carousel>
                <div
                  className='absolute bottom-0 h-[50%] w-full'
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 34.71%, rgba(0, 0, 0, 0.60) 77.95%)',
                    borderRadius: 12,
                  }}
                ></div>
              </>
              :
              <>
                <LazyImageCustom
                  src={data?.drop?.image || data?.image}
                  alt='Drop Img'
                  className='skeleton  object-cover rounded-xl object-center'
                  size={[windowSize.width - 40, 377]}
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
              </>
            }
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
          <div className='font-semibold	text-base'>
            {data?.name || data?.drop?.name}
          </div>
          <div className='flex items-center text-base mt-1'>
            <div className='flex items-center justify-center mr-2'>
              <FaThumbsUp className='text-[#FFB800] mr-1' />
              <span className='text-[14px] text-white opacity-70'>{getScore(data, false)}</span>
            </div>
            <div className='flex items-center justify-center text-white opacity-70 text-[14px]'>
              <span className='mr-2 w-[11px]'>●</span>{' '}
              {isHome()
                ? label
                : convertDistance(
                  calculateDistance(
                    data.lat || data?.drop.lat,
                    data.lng || data?.drop.lng,
                    data.user.lat,
                    data.user.lng
                  )
                )}{' '}
              away
            </div>
          </div>
          {userChecked.length > 0 &&
            <div className='mt-4 flex items-center'>
              <div
                className='relative h-[27.5px] flex justify-start items-center'
                style={{ width: getWidth() }}
              >
                {userChecked.map((item: any, idx: number) => (
                  <LazyImageCustom
                    key={idx}
                    src={item.profileImage}
                    alt={item.profileImage}
                    size={[30, 30]}
                    style={{
                      border: '1.146px solid #FFF',
                      position: 'absolute',
                      width: '27.5px',
                      height: '27.5px',
                      borderRadius: '50%',
                      left: `${idx * overlap}px`, // Chồng lên 40%
                      zIndex: idx + 1,
                    }}
                  />
                ))}
              </div>
              <div className='bg-white text-black ml-2 p-2 text-[13px] font-medium rounded-full'>
                {userChecked.length} checked-in
              </div>
            </div>
          }
        </div>
      </div>
      {isHome() && <div className='border-b mt-6'></div>}
    </div>
  );
};
