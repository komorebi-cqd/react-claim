import React from 'react'
import './index.scss'

export default function index() {

    const submit = () => {
        console.log('提交');
    }

    return (
        <div className='claim-container'>
            <h3>Claim {} Token</h3>
            <div className='nums'>0.0000</div>
            <button className='btn' disabled={true} onClick={submit}>You are on the wrong network</button>
        </div>
    )
}
