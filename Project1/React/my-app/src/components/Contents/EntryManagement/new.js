import React, { useState } from "react";
import { usePost } from "../../../hooks/usePost"; // 커스텀 POST 훅
import { usePut } from "../../../hooks/usePut";   // 커스텀 PUT 훅
import MergeCustomGrid from "../../Grid/MergeCustomGrid";

function EntryPop({ onCancel }) {
  const [formData, setFormData] = useState({
    transactionStatus: "입차",  // 구분: "입차" 또는 "출차"
    time: "",                   // 시간
    scrapType: "",              // 종류
    weight: "",                 // 중량
    numberPlate: null           // 번호판 파일
  });

  const { responseData: postResponseData, isPosting, postError, postData } = usePost();
  const { responseData: putResponseData, isPutting, putError, putData } = usePut();

  const labels = [
    { label: "구분", key: "transactionStatus", required: true, type: "select", options: ["입차", "출차"] },
    { label: "시간", key: "time", required: true, type: "datetime" },
    { label: "종류", key: "scrapType", required: false, type: "" },
    { label: "중량", key: "weight", required: flase, type: "number" },
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

    const formDataToSend = new FormData();
    for (const field of labels) {
      if (formData[field.key]) {


        if (field.key === "time") {
          let timeValue = formData[field.key].replace("T", " ");
          if (timeValue.length === 16) timeValue += ":00";


          if (formData["transactionStatus"] === "입차") {
            formDataToSend.append("entryTime", timeValue);
          } else if (formData["transactionStatus"] === "출차") {
            formDataToSend.append("exitTime", timeValue);
          }
        }
        else if (field.key === "weight") {
          if (formData["transactionStatus"] === "입차") {
            formDataToSend.append("entryWeight", formData[field.key]);
          } else if (formData["transactionStatus"] === "출차") {
            formDataToSend.append("exitWeight", formData[field.key]);
          }
        } 
        else if (field.key === "numberPlate") {
          if (formData["transactionStatus"] === "입차") {
            formDataToSend.append("inImg1", formData[field.key]);
          } else if (formData["transactionStatus"] === "출차") {
            formDataToSend.append("outImg1", formData[field.key]);
          }
        } else {
          formDataToSend.append(field.key, formData[field.key]);
        }
      }
    }

    // 디버깅: FormData 내용 확인
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const url = "http://10.125.121.208:8080/transaction";
    try {
      if (formData["transactionStatus"] === "출차") {
        await putData(url, formDataToSend);
      } else {
        await postData(url, formDataToSend);
      }
      alert("데이터가 성공적으로 업로드되었습니다.");
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
            backgroundColor: "white"
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
