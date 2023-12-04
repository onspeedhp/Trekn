import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Header from '../components/Header';
import { DropOnboarding } from '../pages/DropOnboarding';
import { UploadImage } from '../pages/UploadImage';
import { SelectLocation } from '../pages/SelectLocation';
import { AddDescription } from '../pages/AddDescription';
import { Confirm } from '../pages/Confirm';
import { DropSuccess } from '../pages/DropSuccess';
import { Account } from '../pages/Account';
import { MintSuccess } from '../pages/MintSuccess';
import { Reaction } from '../pages/Reaction';
import { MapGL } from '../pages/MapGL';
import { DraggableLocation } from '../pages/DraggableLocation';
import { DropDetailPage } from '../pages/DropDetailPage';
import EditProfile from '../pages/EditProfile';
import { EnterDropInfo } from '../pages/EnterDropInfo';
import CheckinWPhoto from '../pages/CheckinWPhoto';
import CheckinNearBy from '../pages/CheckinNearBy';

const AppRoutes = () => (
  <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<App layout={Home} header={Header} />}>
        <Route path='home' element={<Home />} />
      </Route>

      <Route
        path='/check-in/nearby'
        element={
          <App header={Header} hideHeader={true} layout={CheckinNearBy} />
        }
      ></Route>

      <Route
        path='/drop-onboarding'
        element={
          <App header={Header} hideHeader={true} layout={DropOnboarding} />
        }
      ></Route>

      <Route
        path='/drop-onboarding/enter-info'
        element={<App header={Header} hideHeader={true} layout={EnterDropInfo} />}
      ></Route>

      <Route
        path='/drop-onboarding/upload-image'
        element={<App header={Header} hideHeader={true} layout={UploadImage} />}
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
        path='/account/edit'
        element={<App header={Header} hideHeader={true} layout={EditProfile} />}
      ></Route>

      <Route
        path='/collect-with-photo'
        element={<App header={Header} hideHeader={true} layout={CheckinWPhoto} />}
      ></Route>

      <Route
        path='/collect-success'
        element={<App header={Header} hideHeader={true} layout={MintSuccess} />}
      ></Route>

      <Route
        path='/reaction-drop'
        element={<App header={Header} hideHeader={true} layout={Reaction} />}
      ></Route>

      <Route
        path='/map-view'
        element={<App header={Header} hideHeader={true} layout={MapGL} />}
      ></Route>

      <Route
        path='/drop-onboarding/drag-location'
        element={
          <App header={Header} hideHeader={true} layout={DraggableLocation} />
        }
      ></Route>

      <Route
        path='/drop/details/:dropId'
        element={
          <App header={Header} hideHeader={true} layout={DropDetailPage} />
        }
      ></Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
