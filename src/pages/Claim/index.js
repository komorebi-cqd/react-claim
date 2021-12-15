import React, { useEffect,useState } from 'react'
import './index.scss'
import { useSelector } from 'react-redux'
import useTokenSymb from '../../hooks/useTokenSymb';
import { BN } from '../../utils/bigNumber'


export default function Claim() {
    const tokenSymb = useTokenSymb();
    const tokenInfo = useSelector(state => state.account.tokenInfo);
    const balance = useSelector(state => state.account.balance);
    // const [] = use
    console.log(tokenInfo, 'tokenInfo');
    const submit = () => {
        console.log('提交');
    }

    useEffect(() => {
        const { decimal } = tokenInfo;
        return decimal - 0 <= 0
            ? "0.0000"
            : new BN(balance)
                .div(10 ** decimal)
                .toFixed(4, 1)
                .toString();
    }, [])

    return (
        <div className='claim-container'>
            <h3>Claim {tokenSymb} Token</h3>
            <div className='nums'>0.0000</div>
            <button className='btn' disabled={true} onClick={submit}>You are on the wrong network</button>
        </div>
    )
}
