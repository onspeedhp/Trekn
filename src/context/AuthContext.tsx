import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IDrop } from '../models/types';
import Torus from '@toruslabs/solana-embed';

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [coordsNow, setCoordsNow] = useState({ log: -1, lat: -1 } as ICoords);
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [torus, setTorus] = useState(new Torus());

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        setCoordsNow({ log: longitude, lat: latitude });
      }
    );
  }, []);

  useEffect(() => {
    try {
      const init = async () => {
        if (torus.isInitialized) {
          const torusInfo = await torus.getUserInfo();

          setUser({
            ...torusInfo,
            address: (await torus.getAccounts())[0],
          });

          setLoggedIn(true);
        }
      };

      init();
    } catch (e) {
      console.log(e);
    }
  }, []);

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
  user: any;
  setUser: (user: any) => void;
}

interface ICoords {
  log: number;
  lat: number;
}
