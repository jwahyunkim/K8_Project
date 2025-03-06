import { Outlet } from "react-router-dom";

import React, { useState } from "react";
import "./VisitorManagement.css";
import MenuBar from "../../components/MenuBar/MenuBar";
import EntryPop from "../../components/Contents/EntryManagement/EntryPop";

export default function VisitorManagement() {
  const [isEntryPopupOpen, setEntryPopupOpen] = useState(false);



  return (
    <div className="mainarea">
      <div className="area1">
        {/* 방문 및 차량 관리 */}
        <div className="a1">
          <MenuBar
            mainTitle="출입 관리"
            subTitles={[
              {
                title: "⁃ 입/출차(Emulator)", action: () => {
                  console.log("입/출차 클릭됨");
                  setEntryPopupOpen(true);
                  console.log("isEntryPopupOpen 상태:", isEntryPopupOpen);

                }
              }, // 클릭 시 모달 열기
              { title: "⁃ 출입현황", path: "entry-status" }, // 상대 경로로 설정
              { title: "⁃ 차량등록", path: "vehicle-register" }, // 상대 경로로 설정
              { title: "⁃ 차량등록 승인", path: "visitor-register" }, // 상대 경로로 설정
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
          {/* <MenuBar
            mainTitle="매출 관리"
            subTitles={[
              { title: "⁃ 현대제철 스크랩 매입가", action: () => alert("준비중") }, // 상대 경로로 설정
            ]}
            styles={{
              // wrapper: 'border border-gray-500 bg-gray-100 rounded-lg shadow-lg',
              mainTitle: 'text-black-500 hover:text-gray-700',
              subTitle: 'text-[16px] text-gray-700', // 텍스트 크기를 `text-sm`으로 설정
              subTitleHover: 'text-green-500',
              transition: 'ease-in-out',
            }}
          /> */}

        </div>
        <div className="a3">
          <MenuBar
            mainTitle="매입관리"
            subTitles={[
              { title: "⁃ 매입현황", path: "sales-overview" }, // 상대 경로로 설정
              { title: "⁃ 매입가 등록", path: "scrap-buying-rate" },
              // { title: "⁃ 매입 정산", action: () => alert("서브타이틀 2 실행") },
              // { title: "⁃ 매입확인서 발행", path: "PurchaseForm" },
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


      </div>

      <div className="area2">
        <Outlet />
      </div>

      {/* 모달 창 */}
      {isEntryPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <EntryPop onCancel={() => setEntryPopupOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
