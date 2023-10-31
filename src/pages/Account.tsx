import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from 'antd';
import { FaClone, FaCookie, FaShare } from 'react-icons/fa';
import { getDropByUserAddress } from '../middleware/data/drop';
import { getMintedByUserAddress } from '../middleware/data/minted';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../redux/slides/userSlides';

export const Account = () => {
  const navigate = useNavigate();
  const { torus } = useAuthContext();
  const [current, setCurrent] = useState('item1');
  const [userDrops, setUserDrops] = useState<any[]>([]);
  const [userMinteds, setUserMinteds] = useState<any[]>([]);
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
      getDropByUserAddress({
        userId: user.id,
        onSuccess: (data: any) => {
          setUserDrops(data);
        },
      });

      getMintedByUserAddress({
        userId: user.id,
        onSuccess: (data: any) => {
          setUserMinteds(data);
        },
      });
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

          <div className='user-info mb-9 text-black'>
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

          <div className='collection-detail'>
            <div className='bg-[#323232] w-full h-16 rounded-2xl flex items-center justify-center'>
              <div
                className={`mr-4 flex items-center justify-center ${current === 'item1' ? 'text-black' : 'text-white'
                  }`}
                style={{
                  width: 150,
                  height: 48,
                  backgroundColor:
                    current === 'item1' ? 'white' : 'transparent',
                  borderRadius: current === 'item1' ? 12 : 0,
                }}
                onClick={() => setCurrent('item1')}
              >
                Collected
              </div>

              <div
                className={`flex items-center justify-center ${current === 'item2' ? 'text-black' : 'text-white'
                  }`}
                style={{
                  width: 150,
                  height: 48,
                  backgroundColor:
                    current === 'item2' ? 'white' : 'transparent',
                  borderRadius: current === 'item2' ? 12 : 0,
                }}
                onClick={() => setCurrent('item2')}
              >
                Drops
              </div>
            </div>
            {current === 'item1' ? (
              <>
                {userMinteds.length !== 0 ? (
                  <>
                    <div className='flex flex-wrap mt-9' style={{ width: 356 }}>
                      {userMinteds.map((minted: any, index: any) => (
                        <div
                          className='relative'
                          key={index}
                          onClick={() => {
                            navigate(`/details/minted/${minted.id}`);
                          }}
                        >
                          <img
                            src={`${minted.drop.image}`}
                            className='rounded-xl mr-3'
                            style={{
                              width: 165,
                              height: 165,
                              marginBottom: 21,
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                          />

                          <div
                            className='absolute left-0 bottom-0 text-white p-2 text-[13px] font-semibold flex-wrap'
                            style={{
                              background: 'rgba(46, 46, 46, 0.70)',
                              marginBottom: 27,
                              marginLeft: 6,
                              marginRight: 18,
                              borderRadius: 6,
                            }}
                          >
                            {minted.drop.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div
                    className='text-white opacity-70 w-full font-semibold'
                    style={{ marginTop: 102 }}
                  >
                    <div className='flex justify-center items-center mb-2'>
                      No Collected Experience Yet!
                    </div>
                    <div className='flex justify-center items-center text-center'>
                      You haven't collected any experience yet. Start your
                      journey of discovery and ownership today ;)
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {userDrops.length !== 0 ? (
                  <>
                    <div className='flex flex-wrap mt-9' style={{ width: 356 }}>
                      {userDrops.map((drop: any, index: any) => (
                        <div
                          className='relative'
                          key={index}
                          onClick={() => {
                            navigate(`/details/drop/${drop.id}`);
                          }}
                        >
                          <img
                            src={`${drop.image}`}
                            alt={`drop_${index}`}
                            className='rounded-xl mr-3'
                            style={{
                              width: 165,
                              height: 165,
                              marginBottom: 21,
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                          />

                          <div
                            className='absolute left-0 bottom-0 text-white p-2 text-[13px] font-semibold flex-wrap'
                            style={{
                              background: 'rgba(46, 46, 46, 0.70)',
                              marginBottom: 27,
                              marginLeft: 6,
                              marginRight: 18,
                              borderRadius: 6,
                            }}
                          >
                            {drop.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div
                    className='text-white opacity-70 w-full font-semibold'
                    style={{ marginTop: 102 }}
                  >
                    <div className='flex justify-center items-center mb-2'>
                      No Created Drops
                    </div>
                    <div className='flex justify-center items-center text-center'>
                      Start sharing your experience to everyone by dropping
                      experience today ;)
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
