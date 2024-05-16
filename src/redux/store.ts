import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import gamesReducer from './reducers/gamesReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
  },
});

export default store;
