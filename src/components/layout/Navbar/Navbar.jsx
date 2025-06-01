import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mainMenuItems, bottomMenuItems } from './SidebarData.jsx';
import './Navbar.css';
import { IconContext } from 'react-icons';
import logo from '../../../assets/imgs/logo.svg';
import avata1 from '../../../assets/imgs/avt_female.svg';
import avata2 from '../../../assets/imgs/avt_male.svg';
import axiosInstance from '../../../services/AxiosConfig';
import authService from '../../../services/authService'; // Import authService

function Navbar() {
  const location = useLocation();
  const [activeSubNav, setActiveSubNav] = useState('');
  const [userData, setUserData] = useState({ username: 'Đang tải...', id: null, gioiTinh: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Lấy quyền truy cập cho role hiện tại từ localStorage
  const rolePages = JSON.parse(localStorage.getItem('rolePages') || '{}');
  const currentRole = localStorage.getItem('currentRole') || 'Kho';
  const allowedPages = rolePages[currentRole] || [];

  // Hàm kiểm tra menu/submenu có được phép hiển thị không
  const isAllowed = (title) => allowedPages.includes(title);

  // Lọc main menu
  const filteredMainMenu = mainMenuItems
    .filter(item => {
      // Nếu là Thanh Toán hoặc Báo Cáo thì luôn hiện nếu role được phép vào menu cha
      if (item.title === 'Thanh Toán' && isAllowed('Thanh Toán')) return true;
      if (item.title === 'Báo Cáo' && isAllowed('Báo Cáo')) return true;
      // Luôn hiện Tất cả sách nếu role được phép vào
      if (item.title === 'Tất cả sách' && isAllowed('Tất Cả Sách')) return true;
      // Các menu khác lọc theo quyền
      return isAllowed(item.title);
    })
    .map(item => {
      if (item.subNav) {
        // Nếu là Thanh Toán hoặc Báo Cáo thì luôn hiện tất cả subNav
        if (item.title === 'Thanh Toán' || item.title === 'Báo Cáo') {
          return { ...item, subNav: item.subNav };
        }
        // Các menu khác lọc subNav theo quyền
        const filteredSubNav = item.subNav.filter(sub => isAllowed(sub.title));
        return { ...item, subNav: filteredSubNav.length > 0 ? filteredSubNav : undefined };
      }
      return item;
    });

  // Lọc bottom menu: luôn hiện Đăng Xuất, các mục khác thì lọc theo quyền
  const filteredBottomMenu = [
    ...bottomMenuItems.filter(item =>
      item.title === 'Đăng Xuất' || isAllowed(item.title)
    )
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check localStorage first
        const storedUser = authService.getCurrentUser();
        console.log('localStorage user:', storedUser);
        if (storedUser?.user) {
          setUserData(storedUser.user);
          console.log('Using stored userData:', storedUser.user);
          setIsLoading(false);
        } else {
          // Fallback to API call if no user data in localStorage
          console.log('Fetching user data from API');
          const response = await axiosInstance.get('http://localhost:8000/api/token/');
          console.log('API response:', response.data);
          const { user } = response.data;
          if (user) {
            setUserData(user);
            console.log('Updated userData from API:', user);
            // Update localStorage with new user data
            localStorage.setItem('user', JSON.stringify({
              ...storedUser,
              user
            }));
          } else {
            console.error('No user data in API response');
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

  useEffect(() => {
    console.log('Current userData:', userData);
  }, [userData]);

  const getPosition = (id) => {
    console.log('getPosition id:', id);
    switch (id) {
      case 1:
        return 'Quản Lý';
      case 2:
        return 'Thu Ngân';
      case 3:
        return 'Người Nhập';
      default:
        return 'Nhân Viên';
    }
  };

  const getAvatar = (gioiTinh) => {
    console.log('getAvatar gioiTinh:', gioiTinh);
    return gioiTinh === 'Nữ' ? avata1 : avata2;
  };

  const handleItemClick = (item, e) => {
    if (item.subNav) {
      e.preventDefault();
      setActiveSubNav(activeSubNav === item.path ? '' : item.path);
    } else {
      setActiveSubNav('');
    }
  };

  useEffect(() => {
    if (!location.pathname.includes('/baocao') && !location.pathname.includes('/thanhtoan')) {
      setActiveSubNav('');
    }
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
                <h2 className="position">{getPosition(userData.id)}</h2>
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
                      target={item.path === '/thanhtoan/moihoadon' ? '_blank' : undefined}
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
                          target={subItem.path === '/thanhtoan/moihoadon' ? '_blank' : undefined}
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