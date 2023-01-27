import { configureStore } from '@reduxjs/toolkit';

// reducers
import socketReducer from '../features/socket';

export default configureStore({
  reducer: {
    socket: socketReducer,
  },
});
