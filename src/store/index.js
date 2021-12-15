import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './accountSlice';
// import accountSlice from './accountSlice';

export default configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    reducer: {
        account: accountSlice,
    }
})
