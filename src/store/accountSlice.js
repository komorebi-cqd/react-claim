import { createSlice } from '@reduxjs/toolkit'
import Web3 from 'web3';

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        account: localStorage.getItem('account') || ''
    },
    reducers: {
        updataAccount(state, action) {
            state.account = action.payload
        }
    }
})

export const { updataAccount } = accountSlice.actions;

export const connect = () => async (dispatch, getState) => {
    if (window.ethereum === undefined) {
        // window.location = metaMaskDownload;
        return false
    }
    const ethereum = window.ethereum;
    let web3 = null
    if (window.web3) {
        web3 = new Web3(ethereum);
        console.log(web3,"web3");
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        localStorage.setItem('account',accounts[0]);
        dispatch(updataAccount(accounts[0]));
        console.log(getState());
    }
}


export default accountSlice.reducer;