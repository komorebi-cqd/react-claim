import React from 'react'
import AddressButton from '../AddressButton/index'
import logo from '../../assets/logo.png';
import './index.scss';


export default function Layout(props) {
    return (
        <div className="container">
            <header className="header">
                <div className='header-content'>
                    <img className='logo' src={logo} alt="log" />
                    <AddressButton />
                </div>
            </header>
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}
