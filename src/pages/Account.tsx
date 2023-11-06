import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from 'antd';
import { FaClone, FaCookie, FaMapPin, FaShare, FaThumbsUp } from 'react-icons/fa';
import { getDropByUserAddress } from '../middleware/data/drop';
import { getMintedByUserAddress } from '../middleware/data/minted';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../redux/slides/userSlides';
import { checkClassNameAccountItem, getScore, getTime, sortDataByTimeline } from '../utils/account.util';
import { calculateDistance, convertDistance } from '../functions/calculateDistance';

export const Account = () => {
  const navigate = useNavigate();
  const { torus } = useAuthContext();
  const [activeTab, setActiveTab] = useState('timeline');
  const [userData, setUserData] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);
  const dispath = useDispatch();

  useEffect(() => {
    if (!user.id) {
      navigate('/home');
    }
  }, []);

  const logout = async () => {
    if (torus.isInitialized) {
      await torus.logout();
    }

    dispath(resetUser());
    navigate('/home');
  };

  useEffect(() => {
    if (user.address) {
      (async () => {
        const userData: any = [];
        await getDropByUserAddress({
          userId: user.id,
          onSuccess: (res: any) => {
            userData.push(...res.map((item: any) => {
              item.type = 'drop';
              return item;
            }));
          },
        });

        await getMintedByUserAddress({
          userId: user.id,
          onSuccess: (res: any) => {
            userData.push(...res.map((item: any) => {
              item.type = 'minted';
              return item;
            }));
          },
        });
        setUserData(sortDataByTimeline(userData));
      })()
    }
  }, [user.address]);

  return (
    <>
      <div className=' absolute w-full h-screen overflow-scroll'>
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
              <div className="flex items-center gap-2 font-semibold text-xl leading-4">
                {user.address.slice(0, 2)}...
                {user.address.slice(-6, -1)}
                <FaClone className='w-3 h-3' />
              </div>
              <Button className='bg-[#F4F4F4] rounded-full flex items-center justify-center border-0 py-2 px-3'>
                <span className='font-medium text-black'>Copy seed phrase </span>
              </Button>
            </div>

            <div className='flex items-center justify-between mb-4'>
              <img
                className='rounded-full w-[100px] h-[100px]'
                src={`${user.profileImage}`}
                alt=''
              />
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-black flex justify-center items-center p-[9px]">
                  <FaShare className='w-3 h-3' />
                </div>
                <div className="rounded-full border border-black text-base font-medium py-2 px-4">
                  Edit profile
                </div>
              </div>
            </div>



            <div className='px-2'>
              <div className="name font-semibold text-2xl">
                {user.name}
              </div>
              <div className="desc py-3 text-sm text-[#000000b3] font-normal">
                ✈️ Wandering the world one suitcase at a time, in search of unforgettable adventures. #Jetsetter #WanderlustWanderer #LostInTravel
              </div>
              <div className="balance flex items-center gap-1">
                <p className='font-semibold text-base'>12,000</p>
                <FaCookie className='text-[#FFAD08] w-3 h-3' />
              </div>
            </div>
          </div>

        </div>
        <div className='collection'>
          <div className='collection__tab relative w-full mb-6 h-8 flex items-center justify-center border-b border-[#D9D9D9] text-base font-semibold'>
            <div
              className={`flex items-center justify-center w-1/2 ${activeTab === 'timeline' ? 'text-black' : 'text-[#00000080]'}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </div>
            <div className="h-4 w-px bg-gray-400 absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"></div>

            <div
              className={`flex items-center justify-center w-1/2 ${activeTab === 'feed' ? 'text-black' : 'text-[#00000080]'
                }`}
              onClick={() => setActiveTab('feed')}
            >
              Feed
            </div>
          </div>
          {activeTab === 'timeline' ? (
            // <>
            //   {userMinteds.length !== 0 ? (
            //     <>
            //       <div className='flex flex-wrap mt-9' style={{ width: 356 }}>
            //         {userMinteds.map((minted: any, index: any) => (
            //           <div
            //             className='relative'
            //             key={index}
            //             onClick={() => {
            //               navigate(`/details/minted/${minted.id}`);
            //             }}
            //           >
            //             <img
            //               src={`${minted.drop.image}`}
            //               className='rounded-xl mr-3'
            //               style={{
            //                 width: 165,
            //                 height: 165,
            //                 marginBottom: 21,
            //                 objectFit: 'cover',
            //                 objectPosition: 'center',
            //               }}
            //             />

            //             <div
            //               className='absolute left-0 bottom-0 text-white p-2 text-[13px] font-semibold flex-wrap'
            //               style={{
            //                 background: 'rgba(46, 46, 46, 0.70)',
            //                 marginBottom: 27,
            //                 marginLeft: 6,
            //                 marginRight: 18,
            //                 borderRadius: 6,
            //               }}
            //             >
            //               {minted.drop.name}
            //             </div>
            //           </div>
            //         ))}
            //       </div>
            //     </>
            //   ) : (
            //     <div
            //       className='text-white opacity-70 w-full font-semibold'
            //       style={{ marginTop: 102 }}
            //     >
            //       <div className='flex justify-center items-center mb-2'>
            //         No Collected Experience Yet!
            //       </div>
            //       <div className='flex justify-center items-center text-center'>
            //         You haven't collected any experience yet. Start your
            //         journey of discovery and ownership today ;)
            //       </div>
            //     </div>
            //   )}
            // </>
            <div className="collection__timeline">
              {Object.entries(userData).map(([key, data], dataIdx) => (
                <>
                  <div className='bg-[#F3F3F3] w-44 py-2 pr-4 rounded-tr-full rounded-br-full flex items-center justify-end relative' key={dataIdx}>
                    <span className='font-medium'>
                      {key}
                    </span>
                    <div className="absolute w-2 h-2 rounded-full bg-[#0500FF] left-1/3">
                      <div className="absolute w-[2px] h-16 bg-[#0500FF] left-1/2 translate-x-[-50%]"></div>
                    </div>
                  </div>
                  <div className="px-4 mt-9">
                    {data.map((item: any, itemIdx: number) => (
                      <div className='mb-9 flex items-stretch gap-3' key={itemIdx}>
                        <div className='w-[88px] h-[88px] relative'>
                          <img src={item?.drop?.image || item?.image} alt="" className='w-full h-full rounded-xl' />
                          <div className={`absolute w-[2px] ${checkClassNameAccountItem(itemIdx, data, dataIdx, userData)} bg-[#0500FF] left-1/2 translate-x-[-50%]`}></div>
                        </div>
                        <div className="flex-grow flex flex-col justify-between my-2">
                          <div className="flex items-center gap-1">
                            <FaMapPin className='w-3 h-3' />
                            <div className="font-[13px] text-xs text-[#02030380]">
                              {item?.type === 'minted' ? 'Checked-in' : 'Created'} at {getTime(item?.created_at)}
                            </div>
                          </div>
                          <div className="text-[15px] font-medium leading-[18px]">{item?.drop?.name || item?.name}</div>
                          <div className="flex items-center gap-2 leading-4">
                            <div className="flex gap-[2px] items-center">
                              <FaThumbsUp className='w-3 h-3 text-[#FFB800]' />
                              <div className="text-[13px] text-[#000000b3] font-medium">
                                {getScore(item)}
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="rounded-full bg-[#dfdfdfb3] w-2 h-2"></div>
                              <div className="text-[13px] text-[#02030380] font-medium">
                                {convertDistance(calculateDistance(item.lat || item?.drop.lat, item.lng || item?.drop.lng, user.lat, user.lng))} away
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
            // <>
            //   {userDrops.length !== 0 ? (
            //     <>
            //       <div className='flex flex-wrap mt-9' style={{ width: 356 }}>
            //         {userDrops.map((drop: any, index: any) => (
            //           <div
            //             className='relative'
            //             key={index}
            //             onClick={() => {
            //               navigate(`/details/drop/${drop.id}`);
            //             }}
            //           >
            //             <img
            //               src={`${drop.image}`}
            //               alt={`drop_${index}`}
            //               className='rounded-xl mr-3'
            //               style={{
            //                 width: 165,
            //                 height: 165,
            //                 marginBottom: 21,
            //                 objectFit: 'cover',
            //                 objectPosition: 'center',
            //               }}
            //             />

            //             <div
            //               className='absolute left-0 bottom-0 text-white p-2 text-[13px] font-semibold flex-wrap'
            //               style={{
            //                 background: 'rgba(46, 46, 46, 0.70)',
            //                 marginBottom: 27,
            //                 marginLeft: 6,
            //                 marginRight: 18,
            //                 borderRadius: 6,
            //               }}
            //             >
            //               {drop.name}
            //             </div>
            //           </div>
            //         ))}
            //       </div>
            //     </>
            //   ) : (
            //     <div
            //       className='text-white opacity-70 w-full font-semibold'
            //       style={{ marginTop: 102 }}
            //     >
            //       <div className='flex justify-center items-center mb-2'>
            //         No Created Drops
            //       </div>
            //       <div className='flex justify-center items-center text-center'>
            //         Start sharing your experience to everyone by dropping
            //         experience today ;)
            //       </div>
            //     </div>
            //   )}
            // </>
            <div className="collection__feed">

            </div>
          )}
        </div>
      </div>
    </>
  );
};
