import React, { useState } from 'react'
import './index.scss'
import mastIcon from '../../assets/metaMask.png';
import goIcon from '../../assets/go.png';
import close from '../../assets/close.png';

export default function Connect() {
    const [show, setShow] = useState(false);

    const showConnect = () => {
        setShow(!show);
    }
    const exceptSelf = (e) => {
        setShow(!show);
    }

    return (
        <div className='connect-container'>

            <div className='connect' onClick={showConnect}>connect</div>
            {
                show &&
                <div className='connect-wallet' onClick={exceptSelf}>
                    <div className='connect-wallet-content' onClick={e => e.stopPropagation()}>
                        <h3>Select a Wallet</h3>
                        <div className='click-connect'>
                            <img className='meta-mask-icon' src={mastIcon} alt="" />
                            <p>Metamask</p>
                            <img className='go-icon' src={goIcon} alt="" />
                        </div>
                        <p className='connect-tip'>Dont have wallet? <a href='https://metamask.io/' rel="noreferrer" target='_blank'>Download here</a></p>
                        <img src={close} alt="" className='close' onClick={showConnect} />
                    </div>
                </div>
            }

        </div>
    )
}
