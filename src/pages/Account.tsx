import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import {
  FaClone,
  FaCookie,
  FaMapPin,
  FaPlusCircle,
  FaShare,
  FaThumbsUp,
} from 'react-icons/fa';
import { getDropByUserAddress } from '../middleware/data/drop';
import { getMintedByUserAddress } from '../middleware/data/minted';
import { useSelector } from 'react-redux';
import {
  checkClassNameAccountItem,
  getScore,
  sortDataByTimeline,
} from '../utils/account.util';
import {
  calculateDistance,
  convertDistance,
} from '../functions/calculateDistance';
import { DetailCard } from '../components/DetailCard';
import moment from 'moment';
import LazyImageCustom from '../components/LazyImageCustom';

export const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [userData, setUserData] = useState<any[]>([]);
  const [test, setTest] = useState('');
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!user.id) {
      navigate('/home');
    }
  }, []);

  useEffect(() => {
    if (user.address) {
      (async () => {
        const userData: any = [];
        await getDropByUserAddress({
          userId: user.id,
          onSuccess: (res: any) => {
            userData.push(
              ...res.map((item: any) => {
                item.type = 'drop';
                return item;
              })
            );
          },
        });

        await getMintedByUserAddress({
          userId: user.id,
          onSuccess: (res: any) => {
            userData.push(
              ...res.map((item: any) => {
                item.type = 'minted';
                return item;
              })
            );
          },
        });

        setUserData(sortDataByTimeline(userData));
      })();
    }
  }, [user.address]);

  return (
    <>
      <div className='absolute w-full h-screen overflow-scroll'>
        <div className='m-4 font-semibold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            className='mb-6'
            onClick={() => {
              navigate('/');
            }}
          >
            <path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='black'
              fillOpacity='0.7'
            />
          </svg>

          <div className='user-info mb-6 text-black'>
            <div className='flex items-center justify-between mb-5 font-normal px-1 py-2'>
              <div className='flex items-center gap-2 font-semibold text-xl leading-4'>
                {user.address.slice(0, 2)}...
                {user.address.slice(-6, -1)}
                <FaClone className='w-3 h-3' />
              </div>
              <Button className='bg-[#F4F4F4] rounded-full flex items-center justify-center border-0 py-2 px-3'>
                <span className='font-medium text-black'>
                  Copy seed phrase{' '}
                </span>
              </Button>
            </div>

            <div className='flex items-center justify-between mb-4'>
              <img
                className='rounded-full w-[100px] h-[100px] object-cover object-center'
                src={`${user.profileImage}`}
                alt=''
              />
              <div className='flex items-center gap-2'>
                <div className='rounded-full border border-black flex justify-center items-center p-[9px]'>
                  <FaShare className='w-3 h-3' />
                </div>
                <div
                  className='rounded-full border border-black py-[6px] px-4'
                  onClick={() => {
                    navigate('/account/edit');
                  }}
                >
                  <p className='text-base font-medium leading-4 tracking-[-0.08px]'>
                    Edit profile
                  </p>
                </div>
              </div>
            </div>

            <div className='px-2'>
              <div className='name font-semibold text-2xl'>{user.name}</div>
              <div className='desc py-3 text-sm text-[#000000b3] font-normal'>
                {user.description}
              </div>
              <div className='balance flex items-center gap-1'>
                <p className='font-semibold text-base'>{user.point}</p>
                <FaCookie className='text-[#FFAD08] w-3 h-3' />
              </div>
            </div>
          </div>
        </div>
        <div className='collection'>
          <div className='collection__tab relative w-full mb-6 h-8 flex items-center justify-center border-b border-[#D9D9D9] text-base font-semibold'>
            <div
              className={`flex items-center justify-center w-1/2 ${activeTab === 'timeline' ? 'text-black' : 'text-[#00000080]'
                }`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </div>
            <div className='h-4 w-px bg-gray-400 absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'></div>

            <div
              className={`flex items-center justify-center w-1/2 ${activeTab === 'feed' ? 'text-black' : 'text-[#00000080]'
                }`}
              onClick={() => setActiveTab('feed')}
            >
              Feed
            </div>
          </div>
          {activeTab === 'timeline' ? (
            <div className='collection__timeline'>
              {Object.entries(userData).map(([key, data], dataIdx) => (
                <>
                  <div
                    className='bg-[#F3F3F3] w-44 py-2 pr-4 rounded-tr-full rounded-br-full flex items-center justify-end relative'
                    key={dataIdx}
                  >
                    <span className='font-medium text-[13px]'>{key}</span>
                    <div className='absolute w-2 h-2 rounded-full bg-[#0500FF] left-[32.5%]'>
                      <div className='absolute w-[2px] h-16 bg-[#0500FF] left-1/2 translate-x-[-50%]'></div>
                    </div>
                  </div>
                  <div className='px-4 mt-9'>
                    {data.map((item: any, itemIdx: number) => (
                      <div
                        className='mb-9 flex items-stretch gap-3'
                        key={itemIdx}
                        onClick={() => {
                          navigate(
                            `/drop/details/${item?.drop_id || item?.id}`
                          );
                        }}
                      >
                        <div className='w-[88px] h-[88px] relative z-20'>
                          <LazyImageCustom
                            src={item?.drop?.image || item?.image}
                            alt='Drop Img'
                            className='w-full h-full rounded-xl object-cover skeleton'
                          />
                          <div
                            className={`absolute w-[2px] ${checkClassNameAccountItem(
                              itemIdx,
                              data,
                              dataIdx,
                              userData
                            )} bg-[#0500FF] left-1/2 z-10`}
                          ></div>
                        </div>
                        <div className='flex-grow flex flex-col justify-between my-2'>
                          <div className='flex items-center gap-1'>
                            {item?.type === 'minted' ? (
                              <FaMapPin className='w-3 h-3' />
                            ) : (
                              <FaPlusCircle className='w-3 h-3' />
                            )}
                            <div className='text-[13px] font-medium text-[#02030380]'>
                              {item?.type === 'minted'
                                ? 'Checked-in'
                                : 'Created'}{' '}
                              at {moment(item?.created_at).format('hh:ss A')}
                            </div>
                          </div>
                          <div className='text-[15px] font-medium leading-[18px]'>
                            {item?.drop?.name || item?.name}
                          </div>
                          <div className='flex items-center gap-2 leading-4'>
                            <div className='flex gap-[2px] items-center'>
                              <FaThumbsUp className='w-3 h-3 text-[#FFB800]' />
                              <div className='text-[13px] text-[#000000b3] font-medium'>
                                {getScore(item, true)}
                              </div>
                            </div>
                            <div className='flex gap-2 items-center'>
                              <div className='rounded-full bg-[#dfdfdfb3] w-2 h-2'></div>
                              <div className='text-[13px] text-[#02030380] font-medium'>
                                {convertDistance(
                                  calculateDistance(
                                    item.lat || item?.drop.lat,
                                    item.lng || item?.drop.lng,
                                    user.lat,
                                    user.lng
                                  )
                                )}{' '}
                                away
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          ) : (
            <div className='collection__feed'>
              {Object.entries(userData).map(([key, data], dataIdx) => (
                <>
                  {data.map((item: any, itemIdx: number) => (
                    <div
                      className='mx-5'
                      onClick={() => {
                        navigate(`/drop/details/${item?.drop_id || item?.id}`);
                      }}
                    >
                      <DetailCard key={itemIdx} data={{ ...item, user }} last={(itemIdx + 1) === data?.length && (dataIdx + 1) === Object.entries(userData)?.length} />
                    </div>
                  ))}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
