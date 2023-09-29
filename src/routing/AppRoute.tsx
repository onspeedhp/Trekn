import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import ConnectWallet from '../pages/ConnectWallet';
import Details from '../pages/Details';
import Header from '../components/Header';
import { MapView } from '../pages/MapView';
import { DropOnboarding } from '../pages/DropOnboarding';
import { EnterName } from '../pages/EnterName';
import { UploadImage } from '../pages/UploadImage';
import { SelectLocation } from '../pages/SelectLocation';
import { AddDescription } from '../pages/AddDescription';
import { Confirm } from '../pages/Confirm';
import { DropSuccess } from '../pages/DropSuccess';
import { Account } from '../pages/Account';
import { NftDetails } from '../pages/NftDetails';

const AppRoutes = () => (
  <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<App layout={ConnectWallet} header={Header} />}>
        <Route path='connect-wallet' element={<ConnectWallet />} />
      </Route>

      <Route
        path='/map-view'
        element={<App header={Header} hideHeader={true} layout={MapView} />}
      ></Route>

      <Route
        path='/drop-onboarding'
        element={
          <App header={Header} hideHeader={true} layout={DropOnboarding} />
        }
      ></Route>

      <Route
        path='/drop-onboarding/enter-name'
        element={<App header={Header} hideHeader={true} layout={EnterName} />}
      ></Route>

      <Route
        path='/drop-onboarding/upload-image'
        element={<App header={Header} hideHeader={true} layout={UploadImage} />}
      ></Route>

      <Route
        path='/drop-onboarding/select-location'
        element={
          <App header={Header} hideHeader={true} layout={SelectLocation} />
        }
      ></Route>

      <Route
        path='/drop-onboarding/add-description'
        element={
          <App header={Header} hideHeader={true} layout={AddDescription} />
        }
      ></Route>

      <Route
        path='/drop-onboarding/confirm'
        element={<App header={Header} hideHeader={true} layout={Confirm} />}
      ></Route>

      <Route
        path='/drop-onboarding/success'
        element={<App header={Header} hideHeader={true} layout={DropSuccess} />}
      ></Route>

      <Route
        path='/account'
        element={<App header={Header} hideHeader={true} layout={Account} />}
      ></Route>

      <Route
        path='/details/minted/:mintedId'
        element={<App header={Header} hideHeader={true} layout={NftDetails} />}
      ></Route>

      <Route
        path='/details/drop/:dropId'
        element={<App header={Header} hideHeader={true} layout={NftDetails} />}
      ></Route>

      <Route
        path='/home'
        element={<App header={Header} layout={Home} />}
      ></Route>

      <Route
        path='/details/:id'
        element={<App header={Header} layout={Details} />}
      ></Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
