import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './accountSlice';
import connectSlice from './connectSlice';

export default configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    reducer: {
        account: accountSlice,
        connect: connectSlice,
    }
})
