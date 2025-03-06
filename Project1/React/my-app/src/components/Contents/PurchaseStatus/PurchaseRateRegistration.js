import React, { useState } from "react";
import "./PurchaseRateRegistration.css";
import { usePost } from "../../../hooks/usePost";
import MergeCustomGrid from "../../Grid/MergeCustomGrid";
import { FaSearch, FaSave, FaTrash } from "react-icons/fa";

export default function PurchaseRateRegistration() {
  const { responseData, isPosting, postError, postData } = usePost();
  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    marketPrice: null,
  });

  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // 수동 탭 라벨 (날짜, 알루미늄, 아연, 구리, 철, 스테인리스, 니켈)
  const manualLabels = [
    { label: "날짜", key: "date", required: false, type: "date" },
    { label: "철", key: "IRON", required: false },
    { label: "구리", key: "COPPER", required: false },
    { label: "알루미늄", key: "ALUMINUM", required: false },
    { label: "아연", key: "ZINC", required: false },
    { label: "스테인리스", key: "STAINLESS", required: false },
    { label: "니켈", key: "NICKEL", required: false },
  ];

  // 자동 탭 라벨 (csv 파일)
  const autoLabels = [
    { label: "csv파일", key: "marketPrice", required: false, type: "file" },
  ];

  // 현재 탭에 따른 라벨 선택
  const activeLabels = activeTab === "manual" ? manualLabels : autoLabels;

  // 입력값 변경 함수
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://10.125.121.208:8080/scraps/prices";

    if (activeTab === "manual") {
      if (!formData.date) {
        alert("날짜는 필수 입력값입니다.");
        return;
      }

      // payload 수정: 날짜는 effectiveDate, 가격들은 prices 객체에 담음
      const payload = {
        effectiveDate: formData.date,
        prices: {},
      };

      manualLabels.forEach(({ key }) => {
        if (key !== "date" && formData[key]) {
          payload.prices[key] = parseFloat(formData[key]);
        }
      });

      console.log("Payload:", payload);

      try {
        await postData(url, payload, {
          "Content-Type": "application/json",
        });

        alert("데이터가 성공적으로 업로드되었습니다.");
      } catch (error) {
        console.error("데이터 업로드 실패:", error);
        alert("데이터 업로드에 실패했습니다.");
      }
    } else {
      // 자동 탭: 기존 FormData 방식 사용
      const formDataToSend = new FormData();
      if (formData.marketPrice) {
        formDataToSend.append("marketPrice", formData.marketPrice);
      }
      try {
        await postData(url, formDataToSend);
        alert("파일이 성공적으로 업로드되었습니다.");
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto p-4 ml-0 mr-0">
      {/* 차량 등록 폼 컨테이너 */}
      <div className="flex flex-col justify-center items-start w-full  rounded-md p-4">
        <h1 className="text-2xl font-bold mb-4">차량 등록</h1>
        <hr className="w-[1450px] border-t-2 border-black mb-4" />
        {/* ////////////////// */}

        <div className="w-[1450px] bg-[#434a4f] text-white py-1 flex justify-start space-x-4">

          {/* 저장 버튼 */}
          <button
            className="flex items-center space-x-2 hover:bg-gray-600 px-4 py-2 rounded"
            onClick={() => setShowSearchPanel(!showSearchPanel)}
          >
            <FaSave className="w-5 h-5" />
            <span>입력방식</span>
          </button>
          <button
            className="flex items-center space-x-2 hover:bg-gray-600 px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            <FaSave className="w-5 h-5" />
            <span>저장</span>
          </button>
        </div>
        {showSearchPanel && (
         <div className="w-full bg-[#f0f0f0] p-2">
         <div className="flex items-center space-x-4">
           <label className="flex items-center cursor-pointer">
             <input
               type="radio"
               name="mode"
               value="manual"
               checked={activeTab === "manual"}
               onChange={() => setActiveTab("manual")}
               className="form-radio text-blue-500"
             />
             <span className="ml-2">수동</span>
           </label>
           <label className="flex items-center cursor-pointer">
             <input
               type="radio"
               name="mode"
               value="auto"
               checked={activeTab === "auto"}
               onChange={() => setActiveTab("auto")}
               className="form-radio text-blue-500"
             />
             <span className="ml-2">자동</span>
           </label>
         </div>
       </div>
       
        )}
        {/* ////////////////// */}
        {/* <div className="flex mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 mr-2 rounded ${
              activeTab === "manual" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            수동
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("auto")}
            className={`px-4 py-2 rounded ${
              activeTab === "auto" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            자동
          </button>
        </div> */}

        {/* 선택된 탭에 따라 그리드 렌더링 */}
        <form onSubmit={handleSubmit} className="flex justify-start w-full">
          <div className="flex justify-center flex-col w-fit items-center overflow-auto">
            {activeTab === "manual" && (
              <div className="absolute top-[125px] right-[450px] p-1 ">
                단위 : kg/원
              </div>
            )}

            <MergeCustomGrid
              rows={activeLabels.length}
              cols={2}
              horizontalAlign="left"
              defaultRowSize="32px"
              colSizes={{ 0: "135px", 1: "465px" }}
              cellContent={(rowIndex, colIndex) => {
                const { label, key, required, type } = activeLabels[rowIndex];
                if (colIndex === 0) {
                  return (
                    <span>
                      {required && <span className="text-red-500">*</span>}
                      {label}
                    </span>
                  );
                }
                if (colIndex === 1) {
                  if (key === "date") {
                    return (
                      <input
                        type="date"
                        value={formData[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-[125px] h-full border border-gray-300 px-[3px] focus:outline-none"
                      />
                    );
                  } else if (type === "file") {
                    return (
                      <div className="flex items-center">
                        <span className="mr-2 w-[300px] border border-black px-2 py-0 bg-white">
                          {formData[key]
                            ? formData[key].name
                            : "선택된 파일 없음"}
                        </span>
                        <label
                          htmlFor={key}
                          className="px-4 py-0 bg-gray-300 border border-black rounded cursor-pointer hover:bg-gray-400"
                        >
                          파일 선택
                        </label>
                        <input
                          id={key}
                          type="file"
                          name={key}
                          onChange={(e) =>
                            handleInputChange(key, e.target.files[0])
                          }
                          className="hidden"
                        />
                      </div>
                    );
                  }
                  return (
                    <input
                      type="text"
                      value={formData[key] || ""}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-[125px] h-full border border-black px-1 py-3 focus:outline-none"
                    />
                  );
                }
                return null;
              }}
              cellStyle={(rowIndex, colIndex) => {
                if (colIndex === 0) {
                  return {
                    backgroundColor: "",
                    color: "",
                    fontWeight: "",
                    border: "",
                  };
                }
                if (colIndex === 1) {
                  return {
                    backgroundColor: "white",
                    color: "",
                    fontWeight: "",
                    border: "",
                  };
                }
                return {};
              }}
            />
            {/* <button
              type="submit"
              className="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              제출하기
            </button> */}
          </div>
        </form>

        {isPosting && <p className="mt-2">업로드 중...</p>}
        {postError && (
          <p className="mt-2 text-red-500">업로드 실패: {postError}</p>
        )}
        {responseData && (
          <p className="mt-2 text-green-500">업로드 성공!</p>
        )}
      </div>
    </div>
  );
}
