/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

function App({
  header,
  layout,
  hideHeader,
}: {
  header: any;
  layout: any;
  hideHeader?: boolean;
}) {
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  const Layout: any = layout;

  const Header: any = header;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Header hidden={hideHeader}></Header>
                  <Layout>
                    <Outlet />
                  </Layout>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
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
