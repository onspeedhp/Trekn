import { createSlice } from '@reduxjs/toolkit';

const storedData = localStorage.getItem('user');
const storedUser = storedData ? JSON.parse(storedData) : null;
console.log(storedUser);

const initialState = storedUser || {
  id: 0,
  name: '',
  email: '',
  address: '',
  profileImage: '',
  description: '',
  point: 0,
  lat: 0,
  lng: 0,
};

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name, email, address, profileImage, point, id, description } = action.payload;
      state.id = id ? id : state.id;
      state.name = name ? name : state.name;
      state.email = email ? email : state.email;
      state.address = address ? address : state.address;
      state.profileImage = profileImage ? profileImage : state.profileImage;
      state.point = point ? point : state.point;
      state.description = description ? description : state.description;

      localStorage.setItem('user', JSON.stringify(state));
    },
    updateCoordinate: (state, action) => {
      const { lat, lng } = action.payload;
      state.lat = lat ? lat : state.lat;
      state.lng = lng ? lng : state.lng;
      localStorage.setItem('user', JSON.stringify(state)); // Update localStorage
    },
    resetUser: (state) => {
      state.id = 0;
      state.name = '';
      state.email = '';
      state.address = '';
      state.profileImage = '';
      state.point = 0;
      state.description = '';

      localStorage.removeItem('user');
    },
    updateInit: (state, action)=>{
      const { country, follow } = action.payload;
      state = {...state,...(follow && {follow}),...(country && {country})}
    }
  },
});

export const { updateUser, resetUser, updateCoordinate, updateInit } = userSlide.actions;

export default userSlide.reducer;
