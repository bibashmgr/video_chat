import { createSlice } from '@reduxjs/toolkit';
import socketio from 'socket.io-client';

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    value: socketio.connect(`${window.location.hostname}:9999`),
  },
  reducers: {},
});

export const {} = socketSlice.actions;

export default socketSlice.reducer;
