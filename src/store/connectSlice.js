import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { metaMaskDownload } from '../config/index'


export const fetchConnect = createAsyncThunk('connect/fetchConnect', async (_, { dispatch }) => {
    if (window.ethereum === undefined) {
        window.location = metaMaskDownload;
        return false
    }
    const ethereum = window.ethereum;
    if (window.web3) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        return { accounts, chainId }
    }
});

export const subsribeChain = createAsyncThunk('connect/subscribeChain', async (_, { dispatch }) => {
    const ethereum = window.ethereum;
    if (!ethereum) {
        return;
    }
    ethereum.on('connect', (accounts) => {
        console.log("ethereum connect");
        dispatch(fetchConnect());
    })
    ethereum.on('accountsChanged', (accounts) => {
        console.log('change account', accounts);
        if (!accounts[0]) {
            dispatch(updataAccount(''));
            return;
        }
        dispatch(updataAccount(accounts[0])); //地址改变更新
        // dispatch("getClaimNumber")
    })
    ethereum.on('chainIdChanged', chainID => {
        console.log('chainIdChanged-' + chainID);
    })
    ethereum.on('chainChanged', (event) => {
        console.log('chainChanged', event);
        dispatch(changeChainId(event));
        // dispatch("getClaimNumber")
    })
    ethereum.on('disconnect', e => {
        console.log('------disconnect', e);
        // 清空钱包连接类型
        localStorage.removeItem('account');
        // commit("accountChange", '')
        dispatch(updataBalance(0));
    })
})


const connectSlice = createSlice({
    name: 'connect',
    initialState: {
        account: '',
    },
    reducers: {
        updataAccount(state, action) {
            state.account = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchConnect.fulfilled, (state, { payload }) => {
            state.account = payload.accounts;
        })
    }
});


export const { updataAccount } = connectSlice.actions;

export default connectSlice.reducer;





