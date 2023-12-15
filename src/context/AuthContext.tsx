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

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const dispatch = useDispatch();
  const { get } = useApi();
  const [torus, setTorus] = useState(new Torus());
  const [leaderBoard, setLeaderBoard] = useState(false);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        (async () => {
          const countryInfo: any = await get(`https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=3&format=jsonv2`);
          dispatch(
            updateCoordinate({
              lat: latitude,
              lng: longitude,
              country: countryInfo?.address?.country
            })
          );
        })()

      }
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
    } catch(e) {
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

  return (
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
