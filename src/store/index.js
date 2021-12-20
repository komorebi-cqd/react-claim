import { configureStore } from '@reduxjs/toolkit';
import walletSlice from './walletSlice';
import connectSlice from './connectSlice';

export default configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    reducer: {
        wallet: walletSlice,
        connect: connectSlice,
    }
})
