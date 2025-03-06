import React, { useState } from "react";
import { usePost } from "../../../hooks/usePost";
import { usePut } from "../../../hooks/usePut";
import MergeCustomGrid from "../../Grid/MergeCustomGrid";

function EntryPop({ onCancel }) {
  const [formData, setFormData] = useState({
    transactionStatus: "입차",
    time: "",
    scrapType: "",
    weight: "",
    numberPlate: null
  });

  const { responseData: postResponseData, isPosting, postError, postData } = usePost();
  const { responseData: putResponseData, isPutting, putError, putData } = usePut();

  const labels = [
    { label: "구분", key: "transactionStatus", required: true, type: "select", options: ["입차", "출차"] },
    { label: "시간", key: "time", required: false, type: "datetime" },
    { label: "종류", key: "scrapType", required: false, type: "select", options: ["ALUMINUM", "ZINC", "COPPER", "IRON", "STAINLESS", "NICKEL"] },
    { label: "중량", key: "weight", required: false, type: "number" },
    { label: "번호판", key: "numberPlate", required: true, type: "file" },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 입력값 확인
    for (const field of labels) {
      if (field.required && !formData[field.key]) {
        alert(`${field.label}은(는) 필수 입력값입니다.`);
        return;
      }
    }

    const status = formData["transactionStatus"];
    const formDataToSend = new FormData();

    // labels 순회하면서 transactionStatus만 빼고 나머지 필드만 폼데이터에 추가
    for (const field of labels) {
      const value = formData[field.key];
      // transactionStatus는 전송 제외
      if (field.key === "transactionStatus") continue;
      // 값이 없으면 스킵
      if (!value) continue;

      if (field.key === "time") {
        let timeValue = value.replace("T", " ");
        if (timeValue.length === 16) timeValue += ":00";
        if (status === "입차") {
          formDataToSend.append("entryTime", timeValue);
        } else {
          formDataToSend.append("exitTime", timeValue);
        }
      } else if (field.key === "weight") {
        if (status === "입차") {
          formDataToSend.append("entryWeight", value);
        } else {
          formDataToSend.append("exitWeight", value);
        }
      } else if (field.key === "numberPlate") {
        if (status === "입차") {
          formDataToSend.append("inImg1", value);
        } else {
          formDataToSend.append("outImg1", value);
        }
      } else {
        formDataToSend.append(field.key, value);
      }
    }

    // 디버깅용
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const url = "http://10.125.121.208:8080/transaction";
    try {
      if (status === "출차") {
        await putData(url, formDataToSend);
      } else {
        await postData(url, formDataToSend);
      }
      alert("데이터가 성공적으로 업로드되었습니다.");
      window.location.reload(); // 전송 후 페이지 새로고침
    } catch (error) {
      console.error("데이터 업로드 실패:", error);
      alert("데이터 업로드에 실패했습니다.");
    }
    
  };

  return (
    <div className="relative p-4">
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-2 right-2 text-2xl font-bold text-gray-700"
      >
        x
      </button>

      <h2>입/출차 입력</h2>
      <form onSubmit={handleSubmit}>
        <MergeCustomGrid
          rows={labels.length}
          cols={2}
          horizontalAlign="left"
          defaultRowSize="55px"
          colSizes={{ 0: "100px", 1: "328px" }}
          cellContent={(rowIndex, colIndex) => {
            const { label, key, required, type, options } = labels[rowIndex];
            if (colIndex === 0) {
              return (
                <span>
                  {required && <span className="text-red-500">*</span>} {label}
                </span>
              );
            }
            if (colIndex === 1) {
              if (type === "file") {
                return (
                  <div className="flex items-center">
                    <span className="mr-2 w-[200px] border border-black px-2 py-0 bg-white">
                      {formData[key] ? formData[key].name : "선택된 파일 없음"}
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
                      onChange={(e) => handleInputChange(key, e.target.files[0])}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                );
              } else if (type === "select") {
                return (
                  <select
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-[125px] h-full border border-black px-1 py-1 focus:outline-none"
                  >
                    {options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                );
              } else if (type === "datetime") {
                return (
                  <input
                    type="datetime-local"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-[210px] h-full border border-black px-1 py-1 focus:outline-none"
                  />
                );
              } else if (type === "number") {
                return (
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-[125px] h-full border border-black px-1 py-1 focus:outline-none"
                  />
                );
              } else {
                return (
                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-[125px] h-full border border-black px-1 py-1 focus:outline-none"
                  />
                );
              }
            }
            return null;
          }}
          cellStyle={() => ({
            backgroundColor: "white",
          })}
        />

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isPosting || isPutting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {(isPosting || isPutting) ? "전송 중..." : "전송"}
          </button>
        </div>
      </form>

      {(isPosting || isPutting) && <p className="mt-2">업로드 중...</p>}
      {(postError || putError) && (
        <p className="mt-2 text-red-500">
          업로드 실패: {postError || putError}
        </p>
      )}
      {(postResponseData || putResponseData) && (
        <p className="mt-2 text-green-500">업로드 성공!</p>
      )}
    </div>
  );
}

export default EntryPop;
