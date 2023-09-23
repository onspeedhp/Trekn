import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IDrop, LocationDetail } from '../models/types';
import request from '../axios';
import { useParams } from 'react-router';
import { useLocation } from 'react-router';
import { CHAIN_NAMESPACES, IProvider, log } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { SolanaWalletConnectorPlugin } from '@web3auth/solana-wallet-connector-plugin';
import { PhantomAdapter } from '@web3auth/phantom-adapter';

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [coordsNow, setCoordsNow] = useState({ log: -1, lat: -1 } as ICoords);
  const [listLocation, setListLocation] = useState([] as Array<LocationDetail>);
  const [listLocationNearBy, setListLocationNearBy] = useState(
    [] as Array<LocationDetail>
  );
  const [locationDetail, setLocationDetail] = useState({} as LocationDetail);
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const { id } = useParams();

  const routerLocation = useLocation();

  const handleGetListLocation = async (valueSearch = '') => {
    const { log, lat } = coordsNow;
    const res = await request.post('location/list', {
      search: valueSearch,
      longitude: log,
      latitude: lat,
      size: 100,
    });
    if (res.status === 200) {
      const resData = res.data;
      setListLocation(resData.locations);
    } else {
      alert(res.data);
    }
  };

  const handleGetListLocationNearBy = async () => {
    const { log, lat } = coordsNow;
    const res = await request.post('location/nearby', {
      longitude: log,
      latitude: lat,
      size: 100,
    });
    if (res.status === 200) {
      const resData = res.data;
      setListLocationNearBy(resData.locations);
    } else {
      alert(res.data);
    }
  };

  const handleGetLocationDetail = async (locationId: string) => {
    const { log, lat } = coordsNow;
    const res = await request.post('location/info', {
      locationId: locationId,
      longitude: log,
      latitude: lat,
    });
    if (res.status === 200) {
      const resData = res.data;
      setLocationDetail(resData);
    } else {
      alert(res.data);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        setCoordsNow({ log: longitude, lat: latitude });
      }
    );
  }, [id]);

  useEffect(() => {
    setLocationDetail({} as LocationDetail);
  }, [routerLocation]);

  const clientId = process.env.REACT_APP_CLIENT_ID_WEB3_AUTH!;
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: process.env.REACT_APP_HELIUS_RPC_URL, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan
          uiConfig: {
            appName: 'W3A Heroes',
            mode: 'light',
            // loginMethodsOrder: ["apple", "google", "twitter"],
            logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
            logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
            defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: 'externalLogin', // "externalLogin" | "socialLogin" | "emailLogin"
          },
          web3AuthNetwork: 'cyan',
        });

        // adding solana wallet connector plugin

        const torusPlugin = new SolanaWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              name: 'Whitelabel Demo',
              theme: { isDark: true, colors: { torusBrand1: '#00a8ff' } },
              logoDark: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
              logoLight: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
              topupHide: true,
              defaultLanguage: 'en',
            },
            enableLogging: true,
          },
        });
        await web3auth.addPlugin(torusPlugin);

        const solflareAdapter = new PhantomAdapter({
          clientId,
        });
        web3auth.configureAdapter(solflareAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        coordsNow: coordsNow,
        metadata: nftMetada,
        setMetadata: setNFTMetadata,
        listLocationNearBy: listLocationNearBy,
        listLocation: listLocation,
        locationDetail: locationDetail,
        getListLocation: handleGetListLocation,
        getListLocationNearBy: handleGetListLocationNearBy,
        getLocationDetail: handleGetLocationDetail,
        web3auth: web3auth,
        provider: provider,
        setProvider: setProvider,
        loggedIn: loggedIn,
        setLoggedIn: setLoggedIn,
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
  listLocationNearBy: Array<LocationDetail>;
  listLocation: Array<LocationDetail>;
  locationDetail: LocationDetail;
  getListLocation: (valueSearch?: string) => void;
  getLocationDetail: (locationId: string) => void;
  getListLocationNearBy: () => void;
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  setProvider: (provider: IProvider | null) => void;
  loggedIn: boolean;
  setLoggedIn: (login: boolean) => void;
}

interface ICoords {
  log: number;
  lat: number;
}
