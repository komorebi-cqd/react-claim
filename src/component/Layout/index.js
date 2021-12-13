import React from 'react'
import AddressButton from '../AddressButton/index'
import Connect from '../Connect/index'
import logo from '../../assets/logo.png';
import './index.scss';


export default function Layout(props) {
    return (
        <div className="container">
            <header className="header">
                <div className='header-content'>
                    <img className='logo' src={logo} alt="log" />
                    {false ? <AddressButton /> : <Connect />}
                </div>
            </header>
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}
