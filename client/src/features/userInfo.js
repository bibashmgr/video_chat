import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    value: {
      email: '',
    },
  },
  reducers: {
    setUserInfo: (state, actions) => {
      let { email } = actions.payload;
      state.value = { ...state.value, email: email };
    },

    removeUser: (state) => {
      state.value = {
        email: '',
      };
    },
  },
});

export const { setUserInfo, removeUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;
