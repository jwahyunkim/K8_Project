import { Outlet } from "react-router-dom";

import React, { useState } from "react";
import "./VendorManagement.css";
import MenuBar from "../../components/MenuBar/MenuBar";

export default function VendorManagement() {


  return (
    <div className="mainarea">
      <div className="area1">
        {/* 방문 및 차량 관리 */}
        <div className="a1">
          <MenuBar
            mainTitle="계정 관리"
            subTitles={[
              { title: "⁃ 계정조회", path: "Search" }, // 상대 경로로 설정
              { title: "⁃ 업체등록", path: "signup" }, // 상대 경로로 설정
            ]}
            styles={{
              // wrapper: 'border border-gray-500 bg-gray-100 rounded-lg shadow-lg',
              mainTitle: 'text-black-500 hover:text-gray-700',
              subTitle: 'text-[16px] text-gray-700', // 텍스트 크기를 `text-sm`으로 설정
              subTitleHover: 'text-green-500',
              transition: 'ease-in-out',
            }}
          />
        </div>
        <div className="a2">

        </div>
        <div className="a3">

        </div>


      </div>

      <div className="area2">
        <Outlet />
      </div>


    </div>
  );
}
