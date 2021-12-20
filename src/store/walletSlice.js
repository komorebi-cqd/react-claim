import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { netWorks } from '../config';
import claimABI from '../web3-config/ABI/claim.json';
import tokenABI from '../web3-config/ABI/token.json';
import { getExtractCash, getSign } from '../api/claim';

import Web3 from 'web3';
let web3 = new Web3(window.ethereum);

export const changeChainId = createAsyncThunk('wallet/changeChainId', async (chainId, { dispatch }) => {
    const config = await netWorks();
    const obj = config.find(it => parseInt(it.chainId) === parseInt(chainId));
    if (!obj) {
        console.log('no obj');
        return { tokenList: [], metaMaskNetWork: obj, errorNetWork: true, token: '', chainId }
    } else {
        localStorage.setItem('net', JSON.stringify(obj));
        let tokenList = obj.tokens.map(async it => {
            const contract = new web3.eth.Contract(tokenABI, it)
            const symbol = await contract.methods.symbol().call();
            return {
                token: it,
                symb: symbol
            }
        })

        await Promise.all(tokenList).then(values => {
            tokenList = values;
            localStorage.setItem('tokenList', JSON.stringify(values))
        })

        let token = null;
        if (tokenList !== 0) {
            token = tokenList[0].token;
        };
        dispatch(getClaimNumber());
        return { tokenList, metaMaskNetWork: obj, errorNetWork: false, token, chainId }
    }
});

export const getClaimNumber = createAsyncThunk('wallet/getClaimNumber', async (_, { dispatch, getState }) => {
    const config = await netWorks();
    const state = getState().wallet;
    const { account } = getState().connect;
    const contractToken = config.find(e => (parseInt(e.chainId) === parseInt(state.chainId)));
    const contract = new web3.eth.Contract(claimABI, contractToken.claim);
    const nonce = await contract.methods.nonceOf(account, state.token).call();
    const extractCash = await getExtractCash({ token: state.token, address: account, chain_id: state.chainId, nonce: parseInt(nonce) + 1 });
    
    dispatch(getTokenInfo(state.token));
    return { balance: extractCash.data, contract }
})
export const getTokenInfo = createAsyncThunk('wallet/getTokenInfo', async (token) => {
    const contract = new web3.eth.Contract(tokenABI, token);
    const decimal = await contract.methods.decimals().call();
    const symbol = await contract.methods.symbol().call();
    return { decimal, symbol };
})

export const switchChainId = createAsyncThunk('wallet/switchChainId', async (chainObj) => {
    const ethereum = window.ethereum;
    const { chainId, rpcUrls, chainName } = chainObj;
    const newrpcUrls = rpcUrls.slice(0, rpcUrls.length);
    const chainId_16 = `0x${(Number(chainId)).toString(16)}`;
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId_16 }],
        });
        return chainObj;
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: chainId_16, rpcUrls: newrpcUrls, chainName }],
                });
                return chainObj;
            } catch (addError) {
                console.log(addError, 'error');
            }
        }
    }
})

export const claimToken = createAsyncThunk('wallet/claimToken', async (_, { dispatch, getState }) => {
    const state = getState().wallet;
    const { account } = getState().connect;
    if (state.contract) {
        try {
            const once = await state.contract.methods.nonceOf(account, state.token).call();
            const { chainId } = getState().wallet;
            const res = await getSign({ token: state.token, address: account, chain_id: chainId, nonce: parseInt(once) + 1 });
            const receipt = state.contract.methods.claim(res.data.token, res.data.account, res.data.number, res.data.nonce, res.data.v, res.data.r, res.data.s)
                .send({ from: account });
            console.log(receipt, 'receipt:::::');
            dispatch(getClaimNumber());
        } catch (error) {
            console.log(error, '错误');
            return Promise.reject(error);
        }
    } else {

    }
})



const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        errorNetWork: false,
        metaMaskNetWork: {},
        tokenList: [],
        token: '',
        tokenInfo: { decimal: 0, symbol: '' },
        balance: 0,
        contract: null,
        chainId: '',
    },
    reducers: {
        updataToken(state, action) {
            state.token = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(changeChainId.fulfilled, (state, { payload }) => {
            state.tokenList = payload.tokenList;
            state.errorNetWork = payload.errorNetWork;
            state.metaMaskNetWork = payload.metaMaskNetWork;
            state.token = payload.token;
            state.chainId = payload.chainId;
        });
        builder.addCase(getClaimNumber.fulfilled, (state, { payload }) => {
            state.contract = payload.contract;
            state.balance = payload.balance;
        });
        builder.addCase(getTokenInfo.fulfilled, (state, { payload }) => {
            state.tokenInfo = payload;
        });
        builder.addCase(switchChainId.fulfilled, (state, { payload }) => {
            state.metaMaskNetWork = payload;
        });
    }
})


export const { updataToken } = walletSlice.actions;

export const errorNetWork = state => state.wallet.errorNetWork;
export const token = state => state.wallet.token;

export default walletSlice.reducer;


