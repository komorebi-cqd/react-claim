import React,{useState} from 'react'
import AddressButton from '../AddressButton/index'
import Connect from '../Connect/index'
import logo from '../../assets/logo.png';
import { useSelector } from 'react-redux'
import './index.scss';


export default function Layout(props) {
    const account = useSelector(state => {
        return state.account.account;
    });
    const [show,setShow] = useState(false)
    const showConnect = () => {
        setShow(!show);
    }
    

    return (
        <div className="container">
            <header className="header">
                <div className='header-content'>
                    <img className='logo' src={logo} alt="log" />
                    {account ? <AddressButton account={account}/> : <div className='connect' onClick={showConnect}>connect</div>}
                </div>
                {show  ? <Connect show={show} showConnect={showConnect} account={account}/> : null}
            </header>
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}
