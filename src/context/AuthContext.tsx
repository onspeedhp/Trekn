import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IDrop } from '../models/types';
import { insertUser, isUserIsExisted } from '../middleware/data/user';
import { updateCoordinate, updateUser } from '../redux/slides/userSlides';
import { useDispatch } from 'react-redux';
import { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const dispatch = useDispatch();
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
        dispatch(
          updateCoordinate({
            lat: latitude,
            lng: longitude,
          })
        );
      }
    );
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        (async () => {
          dispatch(
            updateCoordinate({
              lat: latitude,
              lng: longitude,
            })
          );
        })();
      }
    );
  });

  const web3auth = new Web3Auth({
    clientId: process.env.REACT_APP_CLIENT_ID_WEB3_AUTH!, // get it from Web3Auth Dashboard
    web3AuthNetwork: 'sapphire_mainnet',
    chainConfig: {
      chainNamespace: 'solana',
      chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
      rpcTarget: process.env.REACT_APP_HELIUS_RPC_URL!,
      displayName: 'Solana Mainnet',
      blockExplorer: 'https://explorer.solana.com',
      ticker: 'SOL',
      tickerName: 'Solana',
    },
  });

  const init = async () => {
    console.log('Login');
    await web3auth.initModal();
    await web3auth.connect();
    console.log('Done login');

    const torusInfo = await web3auth.getUserInfo();
    const _web3authProvider = await web3auth.connect();
    if (_web3authProvider) {
      const solanaWallet = new SolanaWallet(_web3authProvider);
      const accounts = await solanaWallet.requestAccounts();
      console.log(accounts);

      const userInfo = {
        name: torusInfo.name || 'Undefined',
        email: torusInfo.email,
        profileImage:
          torusInfo.profileImage ||
          `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/drop_image/profileImage.svg`,
        address: accounts[0],
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        metadata: nftMetada,
        setMetadata: setNFTMetadata,
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
