// components/SideNavBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // jwtDecode를 named import

import './SideNavBar.css';
import { IoHomeOutline } from "react-icons/io5";
import { PiAddressBookBold } from "react-icons/pi";
import { MdOutlinePriceChange } from "react-icons/md";
import { IoCarSportOutline } from "react-icons/io5";



import { IoIosLogOut } from "react-icons/io";

export default function SideNavBar() {
  const [activeItem, setActiveItem] = useState("home");
  const navigate = useNavigate();

  // 토큰에서 사용자 역할 추출 (예: admin, vendor)
  let userRole = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      userRole = jwtDecode(token).role;
    } catch (error) {
      console.error("토큰 디코딩 에러:", error);
    }
  }

  const handleItemClick = (item, path) => {
    setActiveItem(item);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="sidenav">
      {/* 관리자(admin) 전용 메뉴 */}
      {userRole === 'admin' && (
        <>
          <div
            className={`sidenav-item ${activeItem === "VendorManagement" ? "active" : ""} mt-[10px]`}
            onClick={() => handleItemClick("VendorManagement", '/VendorManagement/Search')}
          >
            <IoHomeOutline className="sidenav-icon" />
          </div>
          <div
            className={`sidenav-item ${activeItem === "VisitorManagement" ? "active" : ""}`}
            onClick={() => handleItemClick("VisitorManagement", '/VisitorManagement/sales-overview')}
          >
            <PiAddressBookBold className="sidenav-icon" />
          </div>
        </>
      )}

      {/* 업체(vendor) 전용 메뉴 */}
      {userRole === 'vendor' && (
        <div
          className={`sidenav-item ${activeItem === "Vendor" ? "active" : ""}`}
          onClick={() => handleItemClick("Vendor", '/Vendor/vehicle-register')}
        >
          <IoCarSportOutline className="sidenav-icon" />
        </div>
      )}

      {/* 공통: 로그아웃 */}
      <div className="sidenav-logout" onClick={handleLogout}>
        <IoIosLogOut className="sidenav-icon" />
      </div>
    </div>
  );
}
