import { Modal, Popover } from 'antd';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, setProvider, web3auth } = useAuthContext();

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const login = async () => {
    if (!web3auth) {
      Modal.error({
        title: 'Error',
        content: 'web3auth not initialized yet',
        okButtonProps: {
          type: 'default',
          style: {
            background: 'red',
            color: 'white',
          },
        },
      });
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setLoggedIn(true);
  };

  const unloggedInView = (
    <FaUserCircle onClick={login} size={36} className='text-black' />
  );

  const loggedInView = (
    <>
      <Popover
        content={<></>}
        trigger='click'
        open={open}
        onOpenChange={handleOpenChange}
      >
        <>
          <FaUserCircle
            onClick={() => {
              navigate('/account');
            }}
            size={36}
            className='text-black'
          />
        </>
      </Popover>
    </>
  );

  return (
    <>
      <div className='m-5 flex items-center justify-between'>
        <a href='/home'>
          <img src='./Logo.png' alt='' />
        </a>
        <div className='grid'>{loggedIn ? loggedInView : unloggedInView}</div>
      </div>
    </>
  );
};

export default Header;
