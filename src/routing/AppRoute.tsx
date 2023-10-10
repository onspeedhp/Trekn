import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
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
import { MintSuccess } from '../pages/MintSuccess';
import { Reaction } from '../pages/Reaction';

const AppRoutes = () => (
  <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<App layout={Home} header={Header} />}>
        <Route path='home' element={<Home />} />
      </Route>

      <Route
        path='/map-view'
        element={<App header={Header} hideHeader={true} layout={MapView} />}
      >
        <Route path=':dropId' element={<Home />} />
      </Route>

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
        path='/collect-success'
        element={<App header={Header} hideHeader={true} layout={MintSuccess} />}
      ></Route>

      <Route
        path='/reaction-drop'
        element={<App header={Header} hideHeader={true} layout={Reaction} />}
      ></Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
