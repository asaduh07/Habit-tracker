import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/user/userReducer.js';
import { habitReducer } from '@/features/habit/habitReducer.js';
export const store = configureStore({
  reducer: {
    authReducer,
    habitReducer
  },   
});
