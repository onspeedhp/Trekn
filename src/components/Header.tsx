import { Button } from 'antd';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';
import Torus from '@toruslabs/solana-embed';

const Header = ({ hidden }: { hidden: boolean }) => {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, setUser, setTorus } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const torus = new Torus();

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
                if (!torus.isInitialized) {
                  await torus.init({
                    buildEnv: 'production', // "production", or "developement" are also the option
                    enableLogging: true, // default: false
                    network: {
                      blockExplorerUrl:
                        'https://explorer.solana.com/?cluster=mainnet', // devnet and mainnet
                      chainId: '0x1',
                      displayName: 'Solana Mainnet',
                      logo: 'solana.svg',
                      rpcTarget: process.env.REACT_APP_HELIUS_RPC_URL!, // from "@solana/web3.js" package
                      ticker: 'SOL',
                      tickerName: 'Solana Token',
                    },
                    showTorusButton: false, // default: true
                    useLocalStorage: false, // default: false to use sessionStorage
                    buttonPosition: 'top-left', // default: bottom-left
                    apiKey: process.env.REACT_APP_CLIENT_ID_WEB3_AUTH!, // https://developer.web3auth.io
                    whiteLabel: {
                      name: 'Whitelabel Demo',
                      theme: {
                        isDark: true,
                        colors: { torusBrand1: '#00a8ff' },
                      },
                      logoDark:
                        'https://solana-testing.tor.us/img/solana-logo-light.46db0c8f.svg',
                      logoLight:
                        'https://solana-testing.tor.us/img/solana-logo-light.46db0c8f.svg',
                      topupHide: true,
                    },
                  });
                }
                await torus.login();

                setTorus(torus);

                const torusInfo = await torus.getUserInfo();

                setUser({
                  ...torusInfo,
                  address: (await torus.getAccounts())[0],
                });

                setLoading(false);
                setLoggedIn(true);
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
