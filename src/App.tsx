/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccountData } from './middleware/data/user';
import { updateUser } from './redux/slides/userSlides';

function App({
  header,
  layout,
  hideHeader,
  showNav = false,
}: {
  header: any;
  layout: any;
  showNav?: boolean;
  hideHeader?: boolean;
}) {
  const Layout: any = layout;

  const Header: any = header;
  const mobileMaxWidth = 748;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= mobileMaxWidth);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= mobileMaxWidth);
    }

    if (!isMobile) {
      // window.location.href('asd');
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    (async () => {
      if(user.id) {
        const userData = await getUserAccountData({ userId: user.id });
        dispatch(updateUser(userData));
      }
    })()
  }, [user.id])

  return (
    <>
      {isMobile ? (
        <div className='bg-white font-sans'>
          <AuthProvider>
            <Header hidden={hideHeader}></Header>
            <Layout>
              <Outlet />
            </Layout>
            {showNav && <Navbar />}
          </AuthProvider>
        </div>
      ) : (
        <div className='w-full flex items-center justify-center font-sans font-semibold text-[34px] text-center'>
          <h1>This website is only available in mobile brower</h1>
        </div>
      )}
    </>
  );
}

export default App;
