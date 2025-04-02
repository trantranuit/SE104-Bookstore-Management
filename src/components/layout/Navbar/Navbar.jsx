import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mainMenuItems, bottomMenuItems } from './SidebarData.jsx';
import './Navbar.css';
import { IconContext } from 'react-icons';
import logo from '../../../assets/imgs/logo.svg';
import avata from '../../../assets/imgs/avt.svg';

function Navbar() {
    const location = useLocation();

    return (
        <>
            <IconContext.Provider value={{ color: '#000' }}>
                <div className="navbar">
                    <div className="profile-card">
                        <div className="avatar">
                            <img src={avata} alt="Avatar" />
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
                                <Link 
                                    to={item.path}
                                    className={location.pathname === item.path ? 'active' : ''}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                        <div className="bottom-items">
                            {bottomMenuItems.map((item, index) => (
                                <li key={`bottom-${index}`} className={item.cName}>
                                    <Link 
                                        to={item.path}
                                        className={location.pathname === item.path ? 'active' : ''}
                                    >
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