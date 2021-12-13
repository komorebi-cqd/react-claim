import React, { useState } from 'react'
import './index.scss';

export default function AddressButton() {
    const [showNet, setShowNet] = useState(false);

    return (
        <ul className='head-title'>
            <li className={['down', showNet ? 'select-down' : null].join(' ')} onClick={() => {
                setShowNet(!showNet);
            }}>You are on the wrong network
                <ul className='menu'>
                    <li className='down-l'>Select a network</li>
                    <li className='down-l'>Wlblock Test Chian</li>
                </ul>
            </li>
            <li className='down'>{'0x2b8***b33e'}</li>
        </ul>
    )
}
