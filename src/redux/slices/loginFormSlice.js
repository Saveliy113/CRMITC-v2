import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpened: false,
  token: '',
  username: '',
};

const loginFormSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    toggleLoginForm(state) {
      state.isOpened = !state.isOpened;
    },
    setToken(state, action) {
      console.log(action.payload);
      state.token = action.payload;
    },
    setUsername(state, action) {
      console.log(action.payload);
      state.username = action.payload;
    },
    clearUserData(state) {
      state.token = '';
      state.username = '';
    },
  },
});

export const { toggleLoginForm, setToken, setUsername, clearUserData } =
  loginFormSlice.actions;

export default loginFormSlice.reducer;
