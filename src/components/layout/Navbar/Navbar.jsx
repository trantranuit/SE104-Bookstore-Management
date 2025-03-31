import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { mainMenuItems, bottomMenuItems } from './SidebarData.jsx';
import './Navbar.css';
import { IconContext } from 'react-icons';
import logo from '../../../assets/imgs/logo.svg';

function Navbar() {
    return (
        <>
            <IconContext.Provider value={{ color: '#000' }}>
                <div className="navbar">
                    <div className="profile-card">
                        <div className="avatar">
                            <img src="../../../assets/imgs/avt.svg" alt="Avatar" />
                        </div>
                        <div className="info">
                            <h1 className="name">Ngọc Bích</h1>
                            <h2 className="position">Nhân Viên</h2>
                        </div>
                    </div>
                </div>
                <nav className="nav-menu">
                    <ul className="nav-menu-items">
                        <li className="logo-container">
                            <img src={logo} alt="Logo" className="sidebar-logo" />
                        </li>
                        {mainMenuItems.map((item, index) => (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                        <div className="bottom-items">
                            {bottomMenuItems.map((item, index) => (
                                <li key={`bottom-${index}`} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </div>
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;
