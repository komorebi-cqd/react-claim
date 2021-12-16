import { createSlice } from '@reduxjs/toolkit'
import { metaMaskDownload, netWorks } from '../config';
import claimABI from '../web3-config/ABI/claim.json';
import tokenABI from '../web3-config/ABI/token.json';
import { getExtractCash, getSign } from '../api/claim';

import Web3 from 'web3';
let web3 = new Web3(window.ethereum);

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        account: localStorage.getItem('account') || '',
        errorNetWork: false,
        metaMaskNetWork: {},
        tokenList: [],
        token: '',
        tokenInfo: { decimal: 0, symbol: '' },
        balance: 0,
        contract: null,
    },
    reducers: {
        updataAccount(state, action) {
            localStorage.setItem('account', action.payload);
            state.account = action.payload
        },
        updataState(state, action) {
            state[action.payload.key] = action.payload.data;
        },
        updataErrorNetWork(state, action) {
            state.errorNetWork = action.payload
        },
        updataMetaMaskNetWork(state, action) {
            state.metaMaskNetWork = action.payload
        },
        updataTokenList(state, action) {
            state.tokenList = action.payload
        },
        updataToken(state, action) {
            state.token = action.payload
        },
        updataTokenInfo(state, action) {
            console.log(action.payload, 'updataTokenInfo');
            state.tokenInfo = action.payload
        },
        updataBalance(state, action) {
            state.balance = action.payload
        },
        updataContract(state, action) {
            state.contract = action.payload
        },
    }
})

export const { updataAccount, updataState, updataContract, updataErrorNetWork, updataTokenInfo, updataMetaMaskNetWork, updataTokenList, updataToken, updataBalance } = accountSlice.actions;

export const connect = () => async (dispatch, getState) => {
    if (window.ethereum === undefined) {
        window.location = metaMaskDownload;
        return false
    }
    const ethereum = window.ethereum;
    if (window.web3) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' }); //请求连接
        dispatch(updataAccount(accounts[0])); //存储地址
        const chainId = await ethereum.request({ method: 'eth_chainId' }); //获取网络id
        dispatch(changeChainId(chainId))
    }
}

//监听钱包事件
export const subscribeChain = () => async (dispatch, getState) => {
    console.log('subscribeChain');
    const ethereum = window.ethereum;
    if (!ethereum) {
        return;
    }
    ethereum.on('connect', (accounts) => {
        console.log("ethereum connect");
        dispatch(connect()); //连接时调用connect
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
        localStorage.removeItem('account')
        // commit("accountChange", '')
        dispatch(updataBalance(0));
    })
}
export const changeChainId = chainId => async (dispatch, getState) => {
    const config = await netWorks();
    const obj = config.find(it => parseInt(it.chainId) === parseInt(chainId));
    if (!obj) {
        console.log('no obj');
        dispatch(updataErrorNetWork(true));
        dispatch(updataTokenList([]));
    } else {
        localStorage.setItem('net', JSON.stringify(obj));
        const tokenList = obj.tokens.map(async it => {
            const contract = new web3.eth.Contract(tokenABI, it)
            const symbol = await contract.methods.symbol().call();
            return {
                token: it,
                symb: symbol
            }
        })
        await Promise.all(tokenList).then(values => {
            dispatch(updataTokenList(values));
            localStorage.setItem('token', JSON.stringify(values))
        })
        dispatch(updataMetaMaskNetWork(obj));
        const tokens = getState().account.tokenList;
        if (tokens.length !== 0) {
            dispatch(updataToken(tokens[0].token));
        }
        dispatch(updataErrorNetWork(false));
        dispatch(getClaimNumber());
    }
}


export const getClaimNumber = () => async (dispatch, getState) => {
    const state = getState().account;
    let chainId = window.ethereum.chainId;
    const config = await netWorks();
    const contractToken = config.find(e => (Number(e.chainId) === Number(chainId)));
    const contract = new web3.eth.Contract(claimABI, contractToken.claim);
    const nonce = await contract.methods.nonceOf(state.account, state.token).call();
    const extractCash = await getExtractCash({ token: state.token, address: state.account, chain_id: chainId, nonce: parseInt(nonce) + 1 });
    dispatch(updataBalance(parseInt(extractCash.data)));
    dispatch(updataContract(contract));
    dispatch(getTokenInfo(state.token));
}


export const getTokenInfo = (token) => async (dispatch, getState) => {
    const contract = new web3.eth.Contract(tokenABI, token)
    const decimal = await contract.methods.decimals().call();
    const symbol = await contract.methods.symbol().call();
    dispatch(updataTokenInfo({ decimal, symbol }));
}


export const switchChainId = (chainObj) => async (dispatch, getState) => {
    console.log(chainObj, 'chainObj');
    const ethereum = window.ethereum;
    const { chainId, rpcUrls, chainName } = chainObj;
    const newrpcUrls = rpcUrls.slice(0, rpcUrls.length);
    const chainId_16 = `0x${(Number(chainId)).toString(16)}`
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId_16 }],
        });
        dispatch(updataMetaMaskNetWork(chainObj));
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: chainId_16, rpcUrls: newrpcUrls, chainName }],
                });
                dispatch(updataMetaMaskNetWork(chainObj));
            } catch (addError) {
                // handle "add" error
                console.log(addError, 'error');
            }
        }
    }
};


export const claimToken = () => async (dispatch, getState) => {
    const state = getState().account
    if (state.contract) {
        try {
            const once = await state.contract.methods.nonceOf(state.account, state.token).call();
            const { chainId } = JSON.parse(localStorage.getItem('net'));
            const res = await getSign({ token: state.token, address: state.account, chain_id: chainId, nonce: parseInt(once) + 1 });
            const receipt = state.contract.methods.claim(res.data.token, res.data.account, res.data.number, res.data.nonce, res.data.v, res.data.r, res.data.s)
                .send({ from: state.account });
            console.log(receipt, 'receipt:::');
            dispatch(getClaimNumber());
            return Promise.resolve(receipt);
        } catch (error) {
            return Promise.reject(error);
        }
    }else{

    }
}

export const errorNetWork = state => state.account.errorNetWork;
export const token = state => state.account.token;



export default accountSlice.reducer;