import React, { useState, useEffect } from "react";
import "./PurchaseStatus.css";
import CustomGrid from "../../Grid/MergeCustomGrid";
import GroupedBarChart from "../../Chart/GroupedBarChart";
import DonutPieChart from "../../Chart/DonutPieChart";
import LineChart from "../../Chart/LineChart ";
// import dummyData from "../../../dummyData/VisitorManagement1.json";
// import metalPrice from "../../../dummyData/MetalPrice.json";

import { useGet } from "../../../hooks/useGet";
import axios from "axios";

export default function PurchaseStatus() {

  const [metalPrice, setMetalPrice] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchMetalPrice = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get("http://10.125.121.208:8080/scraps/prices");
        console.log("scraps/prices 리스폰", response);
        setMetalPrice(response.data);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMetalPrice();
  }, []);


  const [dummyData, settransAction] = useState([]);
  const [isFetching2, setIsFetching2] = useState(false);
  const [fetchError2, setFetchError2] = useState(null);

  useEffect(() => {
    const fetchTransAction = async () => {
      setIsFetching2(true);
      try {
        const response = await axios.get("http://10.125.121.208:8080/homeview");
        // const response = await axios.get("http://localhost:5000/visitorManagement");
        console.log("transAction 리스폰", response);
        settransAction(response.data);
      } catch (error) {
        setFetchError2(error.message);
      } finally {
        setIsFetching2(false);
      }
    };
    fetchTransAction();
  }, []);



  const [filters, setFilters] = useState({}); // 필터 상태 관리

  const labels = [
    // { label: "상태", key: "transactionStatus" },
    { label: "상태", key: "stauts" },
    { label: "차량번호", key: "carNumber" },
    { label: "이름", key: "memberName" },
    { label: "연락처", key: "memberContact" },
    { label: "고철종류", key: "scrapType" },
    { label: "매입단가", key: "price", },
    { label: "중량", key: "totalWeight" },
    { label: "매입금액", key: "purchaseAmount" },
    { label: "날짜", key: "entryDate" },
    { label: "시간", key: "entryTime" },
    { label: "날짜", key: "exitDate" },
    { label: "시간", key: "exitTime" },
  ];

  const colSizes = {
    0: "113px",
    1: "140px",
    2: "100px",
    3: "150px",
    4: "100px",
    5: "130px",
    6: "144px",
    7: "156px",
    8: "100px",
    9: "100px",
    10: "100px",
    11: "100px",
  };

  const mergedCells = [
    { row: 0, col: 0, rowSpan: 2, colSpan: 1 },
    { row: 0, col: 1, rowSpan: 2, colSpan: 1 },
    { row: 0, col: 2, rowSpan: 2, colSpan: 1 },
    { row: 0, col: 3, rowSpan: 2, colSpan: 1 },
    { row: 0, col: 4, rowSpan: 2, colSpan: 1 },
    // { row: 0, col: 5, rowSpan: 2, colSpan: 1 },
    // { row: 0, col: 6, rowSpan: 2, colSpan: 1 },
    // { row: 0, col: 7, rowSpan: 2, colSpan: 1 },
    { row: 0, col: 8, rowSpan: 1, colSpan: 2 },
    { row: 0, col: 10, rowSpan: 1, colSpan: 2 },
  ];



  // entryTime, exitTime은 공백 기준으로 날짜와 시간 분리
  const processedData = dummyData.map((item) => {
    // entryTime과 exitTime을 문자열로 변환 후 분리
    const entryTimeStr = item.entryTime ? String(item.entryTime) : "";
    const exitTimeStr = item.exitTime ? String(item.exitTime) : "";
    const [entryDate = "", entryTime = ""] = entryTimeStr.split(" ");
    const [exitDate = "", exitTime = ""] = exitTimeStr.split(" ");

    // 원본 데이터를 복사하고 날짜 및 시간 추가
    const newItem = { ...item, entryDate, entryTime, exitDate, exitTime };

    // exitDate가 있으면 "출차", 없으면 "입차"
    newItem.stauts = exitDate ? "출차" : "입차";

    // 모든 속성 중 숫자인 값은 문자열로 변경
    Object.keys(newItem).forEach((key) => {
      if (typeof newItem[key] === "number") {
        newItem[key] = newItem[key].toString();
      }
    });

    return newItem;
  });
  ///////processedData문자열로 바꾸지 않는 코드///////
  // const processedData = dummyData.map((item) => {
  //   const entryTimeStr = item.entryTime || "";
  //   const exitTimeStr = item.exitTime || "";
  //   const [entryDate = "", entryTime = ""] = entryTimeStr.split(" ");
  //   const [exitDate = "", exitTime = ""] = exitTimeStr.split(" ");
  //   return { ...item, entryDate, entryTime, exitDate, exitTime };
  // });

  /////////////////////////////////////////////////


  const filteredData = processedData.filter((row) =>
    Object.entries(filters).every(([colIndex, value]) =>
      value === "" || row[labels[colIndex].key] === value
    )
  );

  const dynamicUniqueValuesByColumn = (colIndex) => {
    const { key } = labels[colIndex];
    const applicableData = processedData.filter((row) =>
      Object.entries(filters).every(([filterColIndex, value]) =>
        filterColIndex === colIndex.toString() ||
        value === "" ||
        row[labels[filterColIndex].key] === value
      )
    );
    return Array.from(new Set(applicableData.map((data) => data[key])));
  };

  // chartData 생성 시 totalWeight는 이미 숫자이므로 그대로 사용
  // const chartData = Object.values(
  //   filteredData.reduce((acc, cur) => {
  //     const dateString = cur.entryDate;
  //     const numericWeight = cur.totalWeight || 0;
  //     if (!acc[dateString]) {
  //       acc[dateString] = { date: dateString };
  //     }
  //     acc[dateString][cur.scrapType] =
  //       (acc[dateString][cur.scrapType] || 0) + numericWeight;
  //     return acc;
  //   }, {})
  // );
  /////////processedData를 모두 문자열로 바꾼경우 사용하는 코드 //////////////
  const chartData = Object.values(
    filteredData.reduce((acc, cur) => {
      const dateString = cur.entryDate;
      const numericWeight = Number(cur.totalWeight) || 0; // 문자열을 숫자로 변환

      if (!acc[dateString]) {
        acc[dateString] = { date: dateString };
      }

      // 기존 값도 숫자로 변환 후 더하기
      acc[dateString][cur.scrapType] =
        (Number(acc[dateString][cur.scrapType]) || 0) + numericWeight;

      return acc;
    }, {})
  );

  ///////////////////////
  return (
    <>
      <div className="b">
        {metalPrice ? (
          <LineChart
            data={metalPrice}
            width={1400}
            height={270}
            title="스크랩매입시세"
          />
        ) : (
          <div>데이터 로딩중....</div>
        )}
      </div>
      <div className="c">
        <GroupedBarChart
          data={chartData}
          width={700}
          height={350}
          limitXAxisCount={5}
          xAxisKey="date"
          barColors={[
            "rgba(255, 0, 0, 0.6)",
            "rgba(192, 192, 192, 0.6)",
            "rgba(184, 115, 51, 0.6)",
            "rgba(169, 169, 169, 0.6)",
            "rgba(105, 105, 105, 0.6)",
            "rgba(30, 144, 255, 0.6)",
          ]}
          yAxisLabel="무게 (kg)"
        />
        <DonutPieChart chartData={chartData} />
      </div>
      <div className="d">
        <CustomGrid
          rows={filteredData.length + 3} // 데이터 행 + 헤더(2) + 합계행(1)
          cols={labels.length}
          defaultRowSize="32px"
          colSizes={colSizes}
          mergedCells={mergedCells} // 병합 적용
          cellContent={(rowIndex, colIndex) => {

            if (rowIndex === 0 && colIndex === 8) {
              return "IN";
            }
            if (rowIndex === 0 && colIndex === 10) {
              return "OUT";
            }
            //////////////////
            if (rowIndex === 0 && (colIndex === 5 || colIndex === 6 || colIndex === 7)) {
              // 헤더 행: 필터 select
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
                    display: "flex",
                    alignItems: "center",
                    textAlignLast: "center",
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
            }

            //////////////////
            if (rowIndex === 1) {
              // 헤더 행: 필터 select
              // 1. 만약 1행, 5열이면 단순 텍스트만 넣기
              if (colIndex === 5) {
                return "(원/kg)";
              }
              if (colIndex === 6) {
                return "(kg)";
              }
              if (colIndex === 7) {
                return "(원)";
              }



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
                    display: "flex",
                    alignItems: "center",
                    textAlignLast: "center",
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
            }
            else if (rowIndex === filteredData.length + 2) {
              // 마지막 합계 행
              if (colIndex === 0) {
                return "Total";
              }
              if (colIndex === 6 || colIndex === 7) {
                const sum = filteredData.reduce((total, row) => {
                  const cellValue = row[labels[colIndex].key];
                  // 숫자이면 바로 사용, 문자열이면 숫자로 변환
                  const value =
                    typeof cellValue === "number"
                      ? cellValue
                      : parseFloat(String(cellValue).replace(/[^0-9.-]+/g, "")) || 0;
                  return total + value;
                }, 0);
                return colIndex === 6
                  ? `${sum.toLocaleString()} kg`
                  : `${sum.toLocaleString()} 원`;
              }



              return "";
            }

            // 일반 데이터 행
            const data = filteredData[rowIndex - 2];
            const { key } = labels[colIndex];
            if (data) {

              ////일반 데이터 셀에 단위 붙이기////
              // if (colIndex === 6) {
              //   return `${data[key]} kg`;
              // }
              if (colIndex === 7) {
                return `${Number(data[key]).toLocaleString()}`;
              }
              return data[key];
            }
            return null;
          }}
          cellStyle={(rowIndex, colIndex) => {
            if (rowIndex === 0 || rowIndex === 1) {
              return {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                border: "1px solid #ccc",
              };
            } else if (rowIndex === filteredData.length + 2) {
              return {
                backgroundColor: "#e8f5e9",
                fontWeight: "bold",
              };
            }
            return {};
          }}
        />
      </div>
    </>
  );
}
