/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthProvider } from './context/AuthContext';

function App({
  header,
  layout,
  hideHeader,
}: {
  header: any;
  layout: any;
  hideHeader?: boolean;
}) {
  const Layout: any = layout;

  const Header: any = header;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 2000);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <div className='bg-white font-sans'>
          <AuthProvider>
            <Header hidden={hideHeader}></Header>
            <Layout>
              <Outlet />
            </Layout>
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
