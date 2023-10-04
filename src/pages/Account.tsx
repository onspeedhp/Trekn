import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from 'antd';
import { FaLock } from 'react-icons/fa6';
import { FaSignOutAlt } from 'react-icons/fa';
import { getDropByUserAddress } from '../middleware/data/drop';
import { getMintedByUserAddress } from '../middleware/data/minted';

export const Account = () => {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, torus, user } = useAuthContext();
  const [current, setCurrent] = useState('item1');
  const [userDrops, setUserDrops] = useState<any[]>([]);
  const [userMinteds, setUserMinteds] = useState<any[]>([]);

  const logout = async () => {
    await torus.logout();
    setLoggedIn(false);
    navigate('/home');
  };

  useEffect(() => {
    if (user.address) {
      getDropByUserAddress({
        userAddress: user.address,
        onSuccess: (data: any) => {
          setUserDrops(data);
        },
      });

      getMintedByUserAddress({
        userAddress: user.address,
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
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='64'
                height='64'
                viewBox='0 0 64 64'
                fill='none'
              >
                <g clipPath='url(#clip0_39_3693)'>
                  <mask
                    id='mask0_39_3693'
                    // style='mask-type:alpha'
                    maskUnits='userSpaceOnUse'
                    x='0'
                    y='0'
                    width='64'
                    height='64'
                  >
                    <path
                      d='M64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32Z'
                      fill='white'
                    />
                  </mask>
                  <g mask='url(#mask0_39_3693)'>
                    <path d='M24 0H16V8H24V0Z' fill='#FFAD08' />
                    <path d='M40 0H32V8H40V0Z' fill='#EDD75A' />
                    <path d='M56 0H48V8H56V0Z' fill='#EDD75A' />
                    <path d='M16 0H8V8H16V0Z' fill='#EDD75A' />
                    <path d='M32 0H24V8H32V0Z' fill='#FFAD08' />
                    <path d='M48 0H40V8H48V0Z' fill='#EDD75A' />
                    <path d='M64 0H56V8H64V0Z' fill='#FFAD08' />
                    <path d='M8 8H0V16H8V8Z' fill='#EDD75A' />
                    <path d='M8 16H0V24H8V16Z' fill='#73B06F' />
                    <path d='M8 24H0V32H8V24Z' fill='#FFAD08' />
                    <path d='M8 32H0V40H8V32Z' fill='#0C8F8F' />
                    <path d='M8 40H0V48H8V40Z' fill='#EDD75A' />
                    <path d='M8 48H0V56H8V48Z' fill='#73B06F' />
                    <path d='M8 56H0V64H8V56Z' fill='#FFAD08' />
                    <path d='M24 8H16V16H24V8Z' fill='#FFAD08' />
                    <path d='M24 16H16V24H24V16Z' fill='#EDD75A' />
                    <path d='M24 24H16V32H24V24Z' fill='#FFAD08' />
                    <path d='M24 32H16V40H24V32Z' fill='#73B06F' />
                    <path d='M24 40H16V48H24V40Z' fill='#EDD75A' />
                    <path d='M24 48H16V56H24V48Z' fill='#FFAD08' />
                    <path d='M24 56H16V64H24V56Z' fill='#405059' />
                    <path d='M40 8H32V16H40V8Z' fill='#405059' />
                    <path d='M40 16H32V24H40V16Z' fill='#0C8F8F' />
                    <path d='M40 24H32V32H40V24Z' fill='#EDD75A' />
                    <path d='M40 32H32V40H40V32Z' fill='#FFAD08' />
                    <path d='M40 40H32V48H40V40Z' fill='#FFAD08' />
                    <path d='M40 48H32V56H40V48Z' fill='#EDD75A' />
                    <path d='M40 56H32V64H40V56Z' fill='#FFAD08' />
                    <path d='M56 8H48V16H56V8Z' fill='#73B06F' />
                    <path d='M56 16H48V24H56V16Z' fill='#FFAD08' />
                    <path d='M56 24H48V32H56V24Z' fill='#73B06F' />
                    <path d='M56 32H48V40H56V32Z' fill='#EDD75A' />
                    <path d='M56 40H48V48H56V40Z' fill='#405059' />
                    <path d='M56 48H48V56H56V48Z' fill='#FFAD08' />
                    <path d='M56 56H48V64H56V56Z' fill='#FFAD08' />
                    <path d='M16 8H8V16H16V8Z' fill='#FFAD08' />
                    <path d='M16 16H8V24H16V16Z' fill='#0C8F8F' />
                    <path d='M16 24H8V32H16V24Z' fill='#EDD75A' />
                    <path d='M16 32H8V40H16V32Z' fill='#FFAD08' />
                    <path d='M16 40H8V48H16V40Z' fill='#FFAD08' />
                    <path d='M16 48H8V56H16V48Z' fill='#73B06F' />
                    <path d='M16 56H8V64H16V56Z' fill='#405059' />
                    <path d='M32 8H24V16H32V8Z' fill='#FFAD08' />
                    <path d='M32 16H24V24H32V16Z' fill='#EDD75A' />
                    <path d='M32 24H24V32H32V24Z' fill='#FFAD08' />
                    <path d='M32 32H24V40H32V32Z' fill='#EDD75A' />
                    <path d='M32 40H24V48H32V40Z' fill='#EDD75A' />
                    <path d='M32 48H24V56H32V48Z' fill='#EDD75A' />
                    <path d='M32 56H24V64H32V56Z' fill='#0C8F8F' />
                    <path d='M48 8H40V16H48V8Z' fill='#FFAD08' />
                    <path d='M48 16H40V24H48V16Z' fill='#405059' />
                    <path d='M48 24H40V32H48V24Z' fill='#FFAD08' />
                    <path d='M48 32H40V40H48V32Z' fill='#EDD75A' />
                    <path d='M48 40H40V48H48V40Z' fill='#0C8F8F' />
                    <path d='M48 48H40V56H48V48Z' fill='#FFAD08' />
                    <path d='M48 56H40V64H48V56Z' fill='#0C8F8F' />
                    <path d='M64 8H56V16H64V8Z' fill='#405059' />
                    <path d='M64 16H56V24H64V16Z' fill='#EDD75A' />
                    <path d='M64 24H56V32H64V24Z' fill='#73B06F' />
                    <path d='M64 32H56V40H64V32Z' fill='#FFAD08' />
                    <path d='M64 40H56V48H64V40Z' fill='#405059' />
                    <path d='M64 48H56V56H64V48Z' fill='#0C8F8F' />
                    <path d='M64 56H56V64H64V56Z' fill='#EDD75A' />
                  </g>
                </g>
                <defs>
                  <clipPath id='clip0_39_3693'>
                    <rect width='64' height='64' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className='flex items-center justify-center mb-4 font-semibold'>
              Undefined
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
