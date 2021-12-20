import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNetwork } from '../../api/claim';
import { switchChainId, errorNetWork, getClaimNumber, updataToken } from '../../store/walletSlice'
import useTokenSymb from '../../hooks/useTokenSymb';
import './index.scss';

export default function AddressButton(props) {
    const dispatch = useDispatch();

    const [showNet, setShowNet] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [nets, setNets] = useState([]);

    const tokenList = useSelector(state => state.wallet.tokenList);
    const maskNetWork = useSelector(state => state.wallet.metaMaskNetWork);
    const error = useSelector(errorNetWork);
    const tokenSymb = useTokenSymb();
    useEffect(() => {
        getNetwork().then(r => {
            setNets(r.data);
        })
    }, []);

    const account = (props.account && props.account.slice(0, 5) + "***" + props.account.slice(-4)) || "";

    const netsList = nets.map(it => (<li className='down-l' onClick={() => { dispatch(switchChainId(it)) }} key={it.chainName}>{it.chainName}</li>));
    const tokens = tokenList.map(it => (<li className='down-l' onClick={() => { dispatch(updataToken(it.token)); dispatch(getClaimNumber()) }} key={it.symb}>{it.symb}</li>));

    return (
        <ul className='head-title'>
            <li className={['down', showNet ? 'select-down' : null].join(' ')} onClick={() => {
                if(!showNet) setShowToken(false);
                setShowNet(!showNet);
            }}>{error ? 'You are on the wrong network' : (maskNetWork.chainName || 'Select a network')}
                <ul className='menu'>
                    <li className='down-l'>Select a network</li>
                    {netsList}
                </ul>
            </li>
            <li className={['down', showToken ? 'select-down' : null].join(' ')} onClick={() => {
                if(!showToken) setShowNet(false);
                setShowToken(!showToken);
            }}>{error ? 'empty token' : (tokenSymb || 'Select a token')}
                <ul className='menu'>
                    <li className='down-l'>Select a token</li>
                    {tokens}
                </ul>
            </li>
            <li className='down'>{account}</li>
        </ul>
    )
}
