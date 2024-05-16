import { createAction } from '@reduxjs/toolkit';

export const login = createAction<{ username: string, coins: number, token: string }>('user/login');
export const logout = createAction('user/logout');
export const updateCoins = createAction<{ coins: number }>('user/updateCoins');
export const setUserFromLocalStorage = createAction<{ username: string, coins: number, token: string }>('user/setUserFromLocalStorage');
