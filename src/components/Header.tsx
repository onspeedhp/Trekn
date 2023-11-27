import { Button } from 'antd';
import { FaMap, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Header = ({ hidden }: { hidden: boolean }) => {
  const navigate = useNavigate();
  const { init, leaderBoard, setLeaderBoard } = useAuthContext();
  const user = useSelector((state: any) => state.user);

  const [loading, setLoading] = useState(false);

  return (
    <>
      {!hidden && (
        <div className='m-5 flex items-center relative'>
          <a href='/home'>
            <img src='./Logo.svg' alt='' className='h-6' />
          </a>

          <div className='absolute flex items-center inset-y-0 right-0'>
            <Button
              className='rounded-full h-9 w-9 bg-white mr-3 border-0 text-black'
              style={{ paddingLeft: 8, border: '1px solid black' }}
              onClick={() => {
                // setLeaderBoard(!leaderBoard);
              }}
            >
              <FaMap
                size={16}
                className='ml-[1px]'
                onClick={() => {
                  navigate('/map-view');
                }}
              />
              {/* <FaMedal size={16} className='text-white w-4 h-4' /> */}
            </Button>

            {user.id ? (
              <>
                <img src={user.profileImage} alt="" onClick={() => {navigate('/account')}} className='w-9 h-9 rounded-full border box-border'/>
              </>
            ) : (
              <>
                <Button
                  className='bg-black text-white flex items-center jsutify-center h-9 rounded-xl'
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    await init();
                    setLoading(false);
                  }}
                >
                  <FaSignOutAlt size={16} className='mr-1' />
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
