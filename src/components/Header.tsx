import { Button } from 'antd';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';

const Header = ({ hidden }: { hidden: boolean }) => {
  const navigate = useNavigate();
  const { loggedIn, init } = useAuthContext();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {!hidden && (
        <div className='m-5 flex items-center justify-between'>
          <a href='/home'>
            <img src='./Logo.png' alt='' />
          </a>

          {loggedIn ? (
            <FaUserCircle
              onClick={() => {
                navigate('/account');
              }}
              size={36}
              className='text-black'
            />
          ) : (
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
          )}
        </div>
      )}
    </>
  );
};

export default Header;
