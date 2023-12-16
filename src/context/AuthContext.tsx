import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IDrop } from '../models/types';
import Torus from '@toruslabs/solana-embed';
import { insertUser, isUserIsExisted } from '../middleware/data/user';
import { updateCoordinate, updateUser } from '../redux/slides/userSlides';
import { useDispatch } from 'react-redux';
import useApi from '../hooks/useAPI';
import { Button, Drawer } from 'antd';

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const dispatch = useDispatch();
  const { get } = useApi();
  const [torus, setTorus] = useState(new Torus());
  const [leaderBoard, setLeaderBoard] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleError(error: any) {
    let message = '';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        // Người dùng từ chối quyền truy cập vị trí
        message =
          'Quyền truy cập vị trí bị từ chối. Hãy cho phép truy cập để sử dụng đầy đủ chức năng của ứng dụng.';

        // Có thể hiển thị modal hoặc thông báo với hướng dẫn chi tiết
        break;
      case error.POSITION_UNAVAILABLE:
        // Không thể lấy được vị trí
        message = 'Thông tin vị trí không khả dụng. Vui lòng thử lại sau.';
        break;
      case error.TIMEOUT:
        // Yêu cầu lấy vị trí bị timeout
        message = 'Yêu cầu lấy vị trí bị quá hạn. Vui lòng thử lại.';
        break;
      default:
        // Xử lý các lỗi khác
        message = 'Đã xảy ra lỗi khi lấy thông tin vị trí.';
    }
    setErrorMessage(message);
    setIsDrawerVisible(true);
  }

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        (async () => {
          const countryInfo: any = await get(
            `https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=3&format=jsonv2`
          );
          dispatch(
            updateCoordinate({
              lat: latitude,
              lng: longitude,
              country: countryInfo?.address?.country,
            })
          );
        })();
      },
      handleError,
      { timeout: 10000 }
    );
  }, []);

  const init = async () => {
    if (!torus.isInitialized) {
      await torus.init({
        buildEnv: 'production', // "production", or "developement" are also the option
        enableLogging: true, // default: false
        network: {
          blockExplorerUrl: 'https://explorer.solana.com/?cluster=mainnet', // devnet and mainnet
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
          name: 'Trekn',
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
    try {
      await torus.login();
    } catch (e) {
      await torus.cleanUp();
      return;
    }

    setTorus(torus);

    const torusInfo = await torus.getUserInfo();

    const userInfo = {
      name: torusInfo.name || 'Undefined',
      email: torusInfo.email,
      profileImage:
        torusInfo.profileImage ||
        `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/drop_image/profileImage.svg`,
      address: (await torus.getAccounts())[0],
    };

    const { isUserIsExist, data } = await isUserIsExisted({
      email: userInfo.email,
    });

    if (isUserIsExist) {
      dispatch(updateUser(data));
    } else {
      await insertUser({
        props: userInfo,
        onSuccess: (data: any) => {
          dispatch(updateUser(data));
        },
      });
    }
  };

  const openSettings = () => {
    window.open('app-settings:', '_blank');
  };

  return (
    <>
      <Drawer
        placement='bottom'
        onClose={closeDrawer}
        visible={isDrawerVisible}
        height={421}
        className='rounded-t-3xl'
        headerStyle={{ display: 'none' }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='30'
          height='30'
          viewBox='0 0 30 30'
          fill='none'
          className='absolute top-3 right-4'
          onClick={closeDrawer}
        >
          <g filter='url(#filter0_b_2266_10404)'>
            <rect width='30' height='30' rx='15' fill='#F2F2F7' />
            <path
              d='M10.0493 19.1811C9.73828 19.4921 9.73193 20.0444 10.0557 20.3681C10.3857 20.6918 10.938 20.6855 11.2427 20.3808L15.0005 16.623L18.752 20.3745C19.0693 20.6918 19.6152 20.6918 19.939 20.3681C20.2627 20.038 20.2627 19.4985 19.9453 19.1811L16.1938 15.4296L19.9453 11.6718C20.2627 11.3544 20.269 10.8085 19.939 10.4848C19.6152 10.1611 19.0693 10.1611 18.752 10.4785L15.0005 14.2299L11.2427 10.4785C10.938 10.1674 10.3794 10.1547 10.0557 10.4848C9.73193 10.8085 9.73828 11.3671 10.0493 11.6718L13.8008 15.4296L10.0493 19.1811Z'
              fill='#3C3C43'
              fill-opacity='0.6'
            />
          </g>
          <defs>
            <filter
              id='filter0_b_2266_10404'
              x='-54.3656'
              y='-54.3656'
              width='138.731'
              height='138.731'
              filterUnits='userSpaceOnUse'
              color-interpolation-filters='sRGB'
            >
              <feFlood flood-opacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='27.1828' />
              <feComposite
                in2='SourceAlpha'
                operator='in'
                result='effect1_backgroundBlur_2266_10404'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_backgroundBlur_2266_10404'
                result='shape'
              />
            </filter>
          </defs>
        </svg>

        <div className='flex-col w-full mt-[37px]'>
          <div className='w-full flex items-center justify-center mb-6'>
            <img
              src='./location_error.png'
              className='w-[82px] h-[124px]'
              alt=''
            />
          </div>
          <div className='font-bold text-[20px] mb-2'>
            Enhance Your Experience
          </div>
          <div className='mb-10'>
            Enable location access to discover places tailored to you.
          </div>
        </div>

        <div className='flex items-center'>
          <Button
            onClick={closeDrawer}
            className='bg-[#F3F3F3] mr-3 h-12 rounded-3xl border-0 font-semibold text-base'
            style={{
              width: (windowSize.width - 52) / 2,
            }}
          >
            Cencel
          </Button>
          <Button
            className='h-12 rounded-3xl bg-[#9DFF50] border-0 font-semibold text-base'
            style={{
              width: (windowSize.width - 52) / 2,
            }}
            onClick={openSettings}
          >
            Eneble
          </Button>
        </div>
      </Drawer>
      <AuthContext.Provider
        value={{
          metadata: nftMetada,
          setMetadata: setNFTMetadata,
          torus: torus,
          setTorus: setTorus,
          windowSize: windowSize,
          init: init,
          leaderBoard: leaderBoard,
          setLeaderBoard: setLeaderBoard,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  metadata: IDrop;
  setMetadata: (metadata: any) => void;
  torus: Torus;
  setTorus: (torus: Torus) => void;
  windowSize: {
    width: number;
    height: number;
  };
  init: () => Promise<void>;
  leaderBoard: boolean;
  setLeaderBoard: (leaderBoard: boolean) => void;
}

interface ICoords {
  log: number;
  lat: number;
}
