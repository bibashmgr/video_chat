import { configureStore } from '@reduxjs/toolkit';

// reducers
import userInfoReducer from '../features/userInfo';
import participantsReducer from '../features/participants';

export default configureStore({
  reducer: {
    userInfo: userInfoReducer,
    participants: participantsReducer,
  },
});
