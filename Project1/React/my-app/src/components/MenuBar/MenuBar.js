import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
// react-router-dom에서 Link 컴포넌트 추가
import { Link } from "react-router-dom";

function MenuBar({ 
  mainTitle, 
  subTitles, 
  styles = {
    wrapper: '',
    mainTitle: '',
    subTitle: '',
    subTitleHover: '',
    transition: '',
  } 
}) {
  const [showSubTitles, setShowSubTitles] = useState(true);

  const handleMainTitleClick = () => {
    setShowSubTitles(!showSubTitles);
  };

  return (
    <div className={`p-0 w-72 ${styles.wrapper}`}>
      {/* 메인 타이틀 */}
      <h1
        onClick={handleMainTitleClick}
        className={`text-xl font-bold cursor-pointer flex items-center justify-between ${styles.mainTitle}`}
      >
        {mainTitle}
        <span
          className={`transition-transform duration-300 ${
            showSubTitles ? "" : "rotate-90"
          }`}
        >
          <IoIosArrowForward />
        </span>
      </h1>

      {/* 서브 타이틀 리스트 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showSubTitles ? "max-h-[500px]" : "max-h-0"
        } ${styles.transition}`}
      >
        {subTitles.map((sub, index) => (
          <h2
            key={index}
            className={`cursor-pointer ml-5 text-lg ${styles.subTitle} hover:${styles.subTitleHover}`}
            onClick={sub.action ? sub.action : undefined} // ✅ `action`이 있으면 실행
          >
            {/* 기존 onClick 대신 Link 컴포넌트를 사용하여 경로 연결 */}
            <Link to={sub.path}>{sub.title}</Link>
            {/* sub.path를 통해 라우터 경로 설정 */}
          </h2>
        ))}
      </div>
    </div>
  );
}

export default MenuBar;



/* 
사용 예시:
import React from 'react';
import MenuBar from './MenuBar';

function App() {
  return (
    <div className="p-10">
      <MenuBar
        mainTitle="메인 타이틀"
        subTitles={[
          { title: "서브타이틀 1", action: () => alert("서브타이틀 1 실행") },
          { title: "서브타이틀 2", action: () => console.log("서브타이틀 2 실행") },
          { title: "서브타이틀 3", action: () => alert("서브타이틀 3 실행") },
        ]}
        styles={{
          wrapper: 'border border-gray-500 bg-gray-100 rounded-lg shadow-lg',
          mainTitle: 'text-blue-500 hover:text-blue-700',
          subTitle: 'text-gray-700',
          subTitleHover: 'text-green-500',
          transition: 'ease-in-out',
        }}
      />
    </div>
  );
}

export default App;
*/
