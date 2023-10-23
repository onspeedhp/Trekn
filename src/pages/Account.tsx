import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from 'antd';
import { FaLock } from 'react-icons/fa6';
import { FaSignOutAlt } from 'react-icons/fa';
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
    await torus.logout();
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
      <div className='bg-black absolute w-full h-screen overflow-scroll'>
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
              fill='white'
              fillOpacity='0.7'
            />
          </svg>

          <div
            className='m-5 absolute top-0 right-0 text-white flex items-center justify-center'
            onClick={() => {
              logout();
            }}
          >
            <FaSignOutAlt size={16} className='opacity-70 mr-1' />
            <span>Log out</span>
          </div>
          <div className='user-info mb-9 text-white'>
            <div className='flex items-center justify-center mb-4'>
              <img
                className='rounded-full w-16 h-16'
                src={`${user.profileImage}`}
                alt=''
              />
            </div>

            <div className='flex items-center justify-center mb-4 font-semibold'>
              {user.name}
            </div>

            <div className='flex items-center justify-center mb-4 font-normal'>
              {user.address.slice(0, 2)}...
              {user.address.slice(-6, -1)}
            </div>

            <div className='flex items-center justify-center font-normal'>
              <Button className='bg-[#323232] text-white flex items-center justify-center border-0'>
                <FaLock className='opacity-70 mr-1' />
                <span className='font-normal'>Copy seed phrase </span>
              </Button>
            </div>
          </div>

          <div className='collection-detail'>
            <div className='bg-[#323232] w-full h-16 rounded-2xl flex items-center justify-center'>
              <div
                className={`mr-4 flex items-center justify-center ${
                  current === 'item1' ? 'text-black' : 'text-white'
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
                className={`flex items-center justify-center ${
                  current === 'item2' ? 'text-black' : 'text-white'
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
