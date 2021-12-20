import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BN } from '../../utils/bigNumber';
import { claimToken } from '../../store/walletSlice';
import { fetchConnect } from '../../store/connectSlice'
import './index.scss';


export default function Claim() {
    const dispatch = useDispatch();
    const account = useSelector(state => state.connect.account);
    const errorNetWork = useSelector(state => state.wallet.errorNetWork);
    const tokenInfo = useSelector(state => state.wallet.tokenInfo);
    const balance = useSelector(state => state.wallet.balance);
    const [newBalance, setNewBalance] = useState();
    const [disabled, setDisabled] = useState(true);
    const [chaiming, setChaiming] = useState(false);
    const submit = async () => {
        setChaiming(true);
        await dispatch(claimToken());
        setChaiming(false);
    }

    useEffect(() => {
        const { decimal } = tokenInfo;
        setNewBalance(decimal - 0 <= 0
            ? "0.0000"
            : new BN(balance)
                .div(10 ** decimal)
                .toFixed(4, 1)
                .toString())
    }, [balance, tokenInfo]);

    useEffect(() => {
        if (balance <= 0 || errorNetWork || chaiming) {
            setDisabled(true);
        }
    }, [balance, errorNetWork, chaiming]);

    const btn = (<button className='btn' onClick={() => {
        dispatch(fetchConnect());
    }}>Connect</button>)


    return (
        <div className='claim-container'>
            <h3>Claim {errorNetWork? '' : tokenInfo.symbol} Token</h3>
            <div className='nums'>{newBalance}</div>
            {account ? <button className='btn' disabled={disabled} onClick={submit}>
                {errorNetWork ? 'You are on the wrong network' : chaiming ? 'Claim...' : `Claim ${tokenInfo.symbol}`}
            </button> : btn}

        </div>
    )
}
