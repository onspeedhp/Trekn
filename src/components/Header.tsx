import { Button } from 'antd';
import { FaMedal, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';

const Header = ({ hidden }: { hidden: boolean }) => {
  const navigate = useNavigate();
  const { loggedIn, init, leaderBoard, setLeaderBoard } = useAuthContext();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {!hidden && (
        <div className='m-5 flex items-center relative'>
          <a href='/home'>
            <img src='./Logo.png' alt='' />
          </a>

          <div className='absolute flex items-center inset-y-0 right-0'>
            <Button
              className='rounded-full h-9 w-9 bg-[#66C61B] mr-3'
              style={{ paddingLeft: 9 }}
              onClick={() => {
                setLeaderBoard(!leaderBoard);
              }}
            >
              <FaMedal size={16} className='text-white w-4 h-4' />
            </Button>

            {loggedIn ? (
              <>
                <FaUserCircle
                  onClick={() => {
                    navigate('/account');
                  }}
                  size={36}
                  className='text-black'
                />
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
