import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IDrop, IUser } from '../models/types';
import Torus from '@toruslabs/solana-embed';
import { insertUser, isUserIsExisted } from '../middleware/data/user';

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [coordsNow, setCoordsNow] = useState({ log: -1, lat: -1 } as ICoords);
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    name: '',
    email: '',
    address: '',
    profileImage: '',
    point: 0,
  });
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
        setCoordsNow({ log: longitude, lat: latitude });
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

    const userInfo = {
      name: torusInfo.name,
      email: torusInfo.email,
      profileImage: torusInfo.profileImage,
      address: (await torus.getAccounts())[0],
    };

    const { isUserIsExist, data } = await isUserIsExisted({
      email: userInfo.email,
    });

    if (isUserIsExist) {
      setUser(data);
    } else {
      await insertUser({
        props: userInfo,
        onSuccess: (data: any) => {
          setUser(data);
        },
      });
    }

    setLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        coordsNow: coordsNow,
        metadata: nftMetada,
        setMetadata: setNFTMetadata,
        loggedIn: loggedIn,
        setLoggedIn: setLoggedIn,
        torus: torus,
        setTorus: setTorus,
        user: user,
        setUser: setUser,
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
  coordsNow: ICoords;
  metadata: IDrop;
  setMetadata: (metadata: any) => void;
  loggedIn: boolean;
  setLoggedIn: (login: boolean) => void;
  torus: Torus;
  setTorus: (torus: Torus) => void;
  user: IUser;
  setUser: (user: any) => void;
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
