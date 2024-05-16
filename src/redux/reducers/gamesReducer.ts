import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  games: [],
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames(state, action) {
      state.games = action.payload;
    },
  },
});

export const { setGames } = gamesSlice.actions;
export default gamesSlice.reducer;
