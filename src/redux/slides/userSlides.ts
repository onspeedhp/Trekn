import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: 0,
  name: '',
  email: '',
  address: '',
  profileImage: '',
  point: 0,
};

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name, email, address, profileImage, point, id } = action.payload;
      state.id = id ? id : state.id;
      state.name = name ? name : state.name;
      state.email = email ? email : state.email;
      state.address = address ? address : state.address;
      state.profileImage = profileImage ? profileImage : state.profileImage;
      state.point = point ? point : state.point;
    },
    resetUser: (state) => {
      state.id = 0;
      state.name = '';
      state.email = '';
      state.address = '';
      state.profileImage = '';
      state.point = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
