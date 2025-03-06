import React, { useState, useEffect } from "react";
import { usePut } from "../../../hooks/usePut";
import { useGet } from "../../../hooks/useGet";
import MergeCustomGrid from "../../Grid/MergeCustomGrid";

function VisitorRegister() {
  // 데이터 가져오기
  const {
    fetchedData: dummyData,
    isFetching,
    fetchError,
    refetch,
  } = useGet("http://10.125.121.208:8080/car", []);
  // } = useGet("http://localhost:5000/cars?requestStatus=pending", []);

  // PUT 요청 훅
  const { responseData, isPutting, putError, putData } = usePut();

  // formData 초기화
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (dummyData && dummyData.length > 0) {
      setFormData(
        dummyData.map((item) => ({
          ...item,
          isChecked: false,
        }))
      );
    }
  }, [dummyData]);

  // 필터 상태
  const [filters, setFilters] = useState({
    1: "", // BRN
    2: "", // Car Number
    3: "", // requestStatus
  });

  // 승인/반려 상태
  const [actionType, setActionType] = useState("APPROVED");

  // 열 정보
  const labels = [
    { key: "", label: "No" },
    { key: "brn", label: "사업자번호" },
    { key: "carNumber", label: "차량번호" },
    { key: "requestStatus", label: "승인여부" },
    { key: "", label: "체크" },
  ];

  // 열 크기
  const colSizes = {
    0: "100px",
    1: "140px",
    2: "150px",
    3: "170px",
    4: "60px",
  };

  // 체크박스 토글 (필터된 인덱스 대신, 고유값(carNumber)으로 업데이트)
  const handleCheckboxChange = (selectedItem) => {
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.carNumber === selectedItem.carNumber
          ? { ...item, isChecked: !item.isChecked }
          : item
      )
    );
  };

  // 제출 (PUT 요청)
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setActionType(type);

    // 체크된 항목만 carNumber, requestStatus로 구성
    const dataToSend = formData
      .filter((item) => item.isChecked)
      .map((item) => ({
        carNumber: item.carNumber,
        requestStatus: type,
      }));

    if (dataToSend.length === 0) {
      alert("업데이트할 항목을 선택해주세요.");
      return;
    }

    try {
      // 한 번에 PUT (배열 형태)
      const url = "http://10.125.121.208:8080/car/status";
      // const url = `http://localhost:5000/cars/status`;
      await putData(url, dataToSend);

      // 완료 후 재조회
      await refetch();

      // 체크박스 해제
      setFormData((prevFormData) =>
        prevFormData.map((item) => ({
          ...item,
          isChecked: false,
        }))
      );
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  // 필터링된 데이터
  const filteredData = formData.filter((row) => {
    // 아래에서 필요한 요청 상태 조건을 사용하고, 사용하지 않을 조건은 주석 처리하세요.

    // 모든 상태 사용 (기본)
    // const statusCondition = true;
    
    // PENDING 상태만 사용
    const statusCondition = row.requestStatus === "PENDING";
    
    // APPROVED 상태만 사용
    // const statusCondition = row.requestStatus === "APPROVED";
    
    // REJECTED 상태만 사용
    // const statusCondition = row.requestStatus === "REJECTED";

    return statusCondition && Object.entries(filters).every(([colIndex, value]) => {
      const key = labels[colIndex].key;
      if (key === "") return true;
      return value === "" || row[key] === value;
    });
  });

  // 열별 동적 옵션
  const dynamicUniqueValuesByColumn = (colIndex) => {
    const { key } = labels[colIndex];
    if (key === "") return [];

    const applicableData = formData.filter((row) =>
      Object.entries(filters).every(([filterColIndex, value]) => {
        const filterKey = labels[filterColIndex].key;
        if (filterKey === "") return true;
        return (
          filterColIndex === colIndex.toString() ||
          value === "" ||
          row[filterKey] === value
        );
      })
    );
    return Array.from(new Set(applicableData.map((data) => data[key]))).sort();
  };

  // 로딩/에러 처리
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>데이터를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-start w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col justify-center items-start w-full rounded-md p-4">
        <h1 className="text-2xl font-bold mb-4">요청 목록</h1>
        <hr className="w-full border-t-2 border-black mb-4" />

        <form onSubmit={(e) => e.preventDefault()} className="w-auto">
          <div className="flex justify-center items-start w-auto h-[700px] overflow-auto mb-4">
            <MergeCustomGrid
              rows={filteredData.length + 2}
              cols={labels.length}
              defaultRowSize="32px"
              colSizes={colSizes}
              cellContent={(rowIndex, colIndex) => {
                if (rowIndex === 0) {
                  // 헤더 셀 (필터)
                  const dynamicUniqueValues = dynamicUniqueValuesByColumn(colIndex);
                  return (
                    <select
                      value={filters[colIndex] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [colIndex]: e.target.value,
                        }))
                      }
                      style={{
                        width: `calc(${colSizes[colIndex]} - 10px)`,
                        height: "28px",
                        textAlignLast: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: "transparent",
                      }}
                    >
                      <option value="">{labels[colIndex].label}</option>
                      {dynamicUniqueValues.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  );
                } else if (rowIndex === filteredData.length + 1) {
                  // 마지막 빈 행
                  return "";
                }

                // 데이터 행
                const data = filteredData[rowIndex - 1];
                const { key } = labels[colIndex];

                // 첫 번째 열 (번호)
                if (colIndex === 0) {
                  return rowIndex;
                }

                // 체크박스 열
                if (colIndex === 4) {
                  return (
                    <input
                      type="checkbox"
                      checked={data.isChecked}
                      onChange={() => handleCheckboxChange(data)}
                      className="form-checkbox h-4 w-4"
                    />
                  );
                }

                // 그 외 셀
                return data ? data[key] : null;
              }}
              cellStyle={(rowIndex, colIndex) => {
                if (rowIndex === 0) {
                  return {
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    fontWeight: "bold",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  };
                } else if (rowIndex === filteredData.length + 1) {
                  return {
                    backgroundColor: "#e8f5e9",
                    fontWeight: "bold",
                  };
                }
                return {
                  border: "1px solid #ccc",
                  padding: "4px",
                };
              }}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "APPROVED")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
            >
              승인
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "REJECTED")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
            >
              반려
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisitorRegister;
