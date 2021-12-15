import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const claimSlice = createSlice({
    name: 'claim',
    initialState: {
        error: null,
        status: 'idle'
    },
    reducers: {

    },
    extraReducers:{

    }
});


createAsyncThunk('claim/getClaim',async () => {
    
})


