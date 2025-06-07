import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mainMenuItems, bottomMenuItems } from './SidebarData.jsx';
import './Navbar.css';
import { IconContext } from 'react-icons';
import logo from '../../../assets/imgs/logo.svg';
import avata1 from '../../../assets/imgs/avt_female.svg';
import avata2 from '../../../assets/imgs/avt_male.svg';
import axiosInstance from '../../../services/AxiosConfig';
import authService from '../../../services/authService';

function Navbar() {
  const location = useLocation();
  const [activeSubNav, setActiveSubNav] = useState('');
  const [userData, setUserData] = useState({ username: 'Đang tải...', id: null, gioiTinh: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Giá trị mặc định cho rolePages và defaultRole
  const defaultRolePages = {
    'Kho': ['Trang Chủ', 'Nhập Sách', 'Báo Cáo', 'Báo Cáo Công Nợ', 'Báo Cáo Tồn'],
    'Thu Ngân': ['Trang Chủ', 'Thanh Toán', 'Báo Cáo', 'Báo Cáo Công Nợ', 'Báo Cáo Tồn'],
    'Quản Lý': ['Trang Chủ', 'Báo Cáo', 'Báo Cáo Công Nợ', 'Báo Cáo Tồn', 'Phân Quyền'],
    'Admin': ['Trang Chủ', 'Thêm Sách', 'Nhập Sách', 'Khách Hàng', 'Thanh Toán', 'Báo Cáo', 'Báo Cáo Công Nợ', 'Báo Cáo Tồn', 'Thay Đổi Quy Định', 'Phân Quyền']
  };
  const defaultRole = 'Admin';

  // Ánh xạ role từ API sang role trong defaultRolePages
  const mapApiRoleToAppRole = (apiRole) => {
    switch (apiRole) {
      case 'NguoiThu':
        return 'Thu Ngân';
      case 'NguoiNhap':
        return 'Kho';
      case 'QuanLi':
        return 'Quản Lý';
      default:
        return 'Admin';
    }
  };

  // Lấy role từ localStorage và ánh xạ
  const apiRole = localStorage.getItem('currentRole') || 'Admin';
  const currentRole = mapApiRoleToAppRole(apiRole);
  const rolePages = JSON.parse(localStorage.getItem('rolePages')) || defaultRolePages;
  const allowedPages = rolePages[currentRole] || [];

  // Hàm kiểm tra menu/submenu có được phép hiển thị
  const isAllowed = (title) => allowedPages.includes(title);

  // Lọc main menu
  const filteredMainMenu = mainMenuItems
    .filter(item => isAllowed(item.title))
    .map(item => {
      if (item.subNav) {
        if (item.title === 'Thanh Toán' || item.title === 'Báo Cáo') {
          return { ...item, subNav: item.subNav };
        }
        const filteredSubNav = item.subNav.filter(sub => isAllowed(sub.title));
        return { ...item, subNav: filteredSubNav.length > 0 ? filteredSubNav : undefined };
      }
      return item;
    });

  // Lọc bottom menu
  const filteredBottomMenu = bottomMenuItems.filter(item => item.title === 'Đăng Xuất' || isAllowed(item.title));

  // Debug quyền và menu
  console.log('Current Role:', currentRole);
  console.log('Allowed Pages:', allowedPages);
  console.log('Filtered Main Menu:', JSON.stringify(filteredMainMenu, null, 2));
  console.log('Active SubNav:', activeSubNav);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser?.user) {
          setUserData(storedUser.user);
        } else {
          const response = await axiosInstance.get('http://localhost:8000/api/token/');
          console.log('API Response:', response.data); // Debug
          const { user } = response.data || {};
          if (user) {
            setUserData(user);
            localStorage.setItem('user', JSON.stringify({ ...storedUser, user }));
          } else {
            setUserData({ username: 'User', id: null, gioiTinh: '' });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        setUserData({ username: 'User', id: null, gioiTinh: '' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getPosition = (role) => {
    switch (role) {
      case 'NguoiNhap': return 'Kho';
      case "NguoiThu": return 'Thu Ngân';
      case "QuanLi": return 'Quản Lí';
      default: return 'Admin';
    }
  };

  const getAvatar = (gioiTinh) => {
    return gioiTinh === 'Nữ' ? avata1 : avata2;
  };

  const handleItemClick = (item, e) => {
    if (item.subNav && item.subNav.length > 0) {
      e.preventDefault();
      setActiveSubNav(activeSubNav === item.path ? '' : item.path);
      console.log('Set Active SubNav to:', item.path); // Debug
    } else {
      setActiveSubNav('');
    }
  };

  useEffect(() => {
    if (location.pathname.includes('/baocao')) {
      setActiveSubNav('/baocao');
    } else if (location.pathname.includes('/thanhtoan')) {
      setActiveSubNav('/thanhtoan');
    } else {
      setActiveSubNav('');
    }
    console.log('Location Pathname:', location.pathname, 'Active SubNav:', activeSubNav); // Debug
  }, [location.pathname]);

  return (
    <IconContext.Provider value={{ color: '#000' }}>
      <div className="navbar">
        <div className="profile-card">
          {isLoading ? (
            <div>Đang tải...</div>
          ) : (
            <>
              <div className="avatar">
                <img src={getAvatar(userData.gioiTinh)} alt="Avatar" />
              </div>
              <div className="info">
                <h1 className="name">{userData.username}</h1>
                <h2 className="position">{getPosition(userData.role)}</h2>
              </div>
            </>
          )}
        </div>
      </div>
      <nav className="nav-menu">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <div className="menu-content">
          <ul className="nav-menu-items">
            {filteredMainMenu.map((item, index) => (
              <React.Fragment key={index}>
                <li className={item.cName}>
                  {item.subNav && item.subNav.length > 0 ? (
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
                  <ul className={`subnav-items ${activeSubNav === item.path ? 'active' : ''}`}>
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
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
          <ul className="bottom-items">
            {filteredBottomMenu.map((item, index) => (
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
          </ul>
        </div>
      </nav>
    </IconContext.Provider>
  );
}

export default Navbar;