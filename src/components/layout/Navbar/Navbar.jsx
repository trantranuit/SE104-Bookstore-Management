import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mainMenuItems, bottomMenuItems } from './SidebarData.jsx';
import './Navbar.css';
import { IconContext } from 'react-icons';
import logo from '../../../assets/imgs/logo.svg';
import avata from '../../../assets/imgs/avt.svg';

function Navbar() {
    const location = useLocation();
    const [activeSubNav, setActiveSubNav] = useState('');
    
    const handleItemClick = (item, e) => {
        if (item.subNav) {
            e.preventDefault();
            setActiveSubNav(activeSubNav === item.path ? '' : item.path);
        } else {
            setActiveSubNav('');
        }
    };

    React.useEffect(() => {
        if (!location.pathname.includes('/baocao') && !location.pathname.includes('/thanhtoan')) {
            setActiveSubNav('');
        }
    }, [location.pathname]);

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
                            <React.Fragment key={index}>
                                <li className={item.cName}>
                                    {item.subNav ? (
                                        <div 
                                            className={`nav-menu-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                                            onClick={(e) => handleItemClick(item, e)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </div>
                                    ) : (
                                        <Link 
                                            to={item.path}
                                            className={location.pathname === item.path ? 'active' : ''}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </li>
                                {item.subNav && activeSubNav === item.path && (
                                    <div className={`subnav-items ${activeSubNav === item.path ? 'active' : ''}`}>
                                        {item.subNav.map((subItem, subIndex) => (
                                            <li key={subIndex} className={subItem.cName}>
                                                <Link 
                                                    to={subItem.path}
                                                    className={location.pathname === subItem.path ? 'active' : ''}
                                                >
                                                    {subItem.icon}
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
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