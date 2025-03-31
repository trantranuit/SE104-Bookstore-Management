import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi";

export const mainMenuItems = [
    {
        title: 'Trang Chủ',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },

    {
        title: 'Tất cả sách',
        path: '/tatcasach',
        icon: <FaIcons.FaBook />,
        cName: 'nav-text'
    },

    {
        title: 'Nhập Sách',
        path: '/nhapsach',
        icon: <FaIcons.FaBookMedical />,
        cName: 'nav-text'
    },

    {
        title: 'Thanh Toán',
        path: '/thanhtoan',
        icon: <FaIcons.FaCcAmazonPay  />,
        cName: 'nav-text'
    },

    {
        title: 'Khách Hàng',
        path: '/khachhang',
        icon: <FaIcons.FaUserFriends  />,
        cName: 'nav-text'
    },

    {
        title: 'Báo Cáo',
        path: '/baocao',
        icon: <HiIcons.HiDocumentReport />,
        cName: 'nav-text'
    },


    {
        title: 'Phân Quyền',
        path: '/phanquyen',
        icon: <FaIcons.FaUniversalAccess />,
        cName: 'nav-text'
    },
]

export const bottomMenuItems = [
    {
        title: 'Thay Đổi Quy Định',
        path: '/quydinh',
        icon: <FaIcons.FaCog />, 
        cName: 'nav-text'
    },
    {
        title: 'Đăng Xuất',
        path: '/logout',
        icon: <FaIcons.FaSignOutAlt />, 
        cName: 'nav-text'
    }
]