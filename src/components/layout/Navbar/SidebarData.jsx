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
        title: 'Tra Cứu Sách',
        path: '/tatcasach',
        icon: <FaIcons.FaBook />,
        cName: 'nav-text'
    },

    ,
    {
        title: 'Thêm Sách',
        path: '/themsach',
        icon: <FaIcons.FaPlusSquare />,
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
        icon: <FaIcons.FaCcAmazonPay />,
        cName: 'nav-text',
        subNav: [
            {
                title: 'Tạo Hóa Đơn Sách',
                path: '/thanhtoan/moi',
                icon: <HiIcons.HiDocumentText />,
                cName: 'nav-text subnav-item'
            },
            {
                title: 'Phiếu Thu Tiền',
                path: '/thanhtoan/cu',
                icon: <HiIcons.HiCalculator />,
                cName: 'nav-text subnav-item'
            }
        ]
    },

    {
        title: 'Khách Hàng',
        path: '/khachhang',
        icon: <FaIcons.FaUserFriends />,
        cName: 'nav-text'
    },

    {
        title: 'Báo Cáo',
        path: '/baocao',
        icon: <HiIcons.HiDocumentReport />,
        cName: 'nav-text',
        subNav: [
            {
                title: 'Báo Cáo Tồn',
                path: '/baocao/ton',
                icon: <HiIcons.HiDocumentText />,
                cName: 'nav-text subnav-item'
            },
            {
                title: 'Báo Cáo Công Nợ',
                path: '/baocao/congno',
                icon: <HiIcons.HiDocumentDuplicate />,
                cName: 'nav-text subnav-item'
            }
        ]
    },


    {
        title: 'Phân Quyền',
        path: '/phanquyen',
        icon: <FaIcons.FaUniversalAccess />,
        cName: 'nav-text'
    }
]

export const bottomMenuItems = [
    {
        title: 'Thay Đổi Quy Định',
        path: '/thaydoiquydinh',
        icon: <FaIcons.FaCog />,
        cName: 'nav-text'
    },
    {
        title: 'Đăng Xuất',
        path: '/dangxuat',
        icon: <FaIcons.FaSignOutAlt />,
        cName: 'nav-text'
    }
]