import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import login from './slices/loginFormSlice';
import data from './slices/dataSlice';
import { authApi } from '../services/authApi';
import { dataApi } from '../services/dataApi';

const rootReducer = combineReducers({
  login,
  data,
  [authApi.reducerPath]: authApi.reducer,
  [dataApi.reducerPath]: dataApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [authApi.reducerPath, dataApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, dataApi.middleware),
});

export const persistor = persistStore(store);
export default store;
