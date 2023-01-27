import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    value: {
      email: '',
      prefs: {
        audio: true,
        video: false,
        screen: false,
      },
    },
  },
  reducers: {
    setUserEmail: (state, actions) => {
      state.value.email = actions.payload;
    },
    setAudio: (state) => {
      state.value.prefs.audio = !state.value.prefs.audio;
    },
    setVideo: (state) => {
      state.value.prefs.audio = !state.value.prefs.video;
    },
    setScreen: (state) => {
      state.value.prefs.audio = !state.value.prefs.screen;
    },
  },
});

export const { setUserEmail, setVideo, setAudio, setScreen } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;
