import { createSlice } from '@reduxjs/toolkit';
import { login, logout, updateCoins, setUserFromLocalStorage } from '../actions/userActions';

const initialState = {
  username: '',
  coins: 0,
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login, (state, action) => {
        console.log(action)
        state.username = action.payload.username;
        state.coins = action.payload.coins;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(logout, (state) => {
        state.username = '';
        state.coins = 0;
        state.token = '';
        localStorage.removeItem('user');
      })
      .addCase(setUserFromLocalStorage, (state, action) => {
        state.username = action.payload.username;
        state.coins = action.payload.coins;
        state.token = action.payload.token;
      })
      .addCase(updateCoins, (state, action) => {
        state.coins = action.payload.coins;
      });
  },
});

export default userSlice.reducer;
