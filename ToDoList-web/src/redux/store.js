import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from 'redux/activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';
import activeCardReducer from './activeCard/activeCardSlice';
import notificationsReducer from './notification/notificationSlice';

import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['user'],
};

const reducers = combineReducers({
    activeBoard: activeBoardReducer,
    user: userReducer,
    activeCard: activeCardReducer,
    notifications: notificationsReducer,
});

const persistReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistReducers,
    // Fix warning error when implement redux-persist
    // https://stackoverflow.com/a/63244831/8324172
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
