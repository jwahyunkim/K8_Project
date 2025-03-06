import React, { useState, useEffect } from "react";
import CustomGrid from "../../Grid/CustomGrid";
import "./EntryStatus.css";

// 백엔드 서버 주소 변수 (필요에 따라 변경)
const SERVER_URL = "http://10.125.121.208:8080";

export default function EntryStatus() {
  // (1) 서버에서 받는 데이터(차량 정보 + 이미지 URL) 저장
  const [rawData, setRawData] = useState([]);

  // (2) 웹소켓 연결
  useEffect(() => {
    const ws = new WebSocket("ws://10.125.121.208:8080/ws");

    ws.onopen = () => {
      console.log("WebSocket 연결 성공");
      ws.send(JSON.stringify({ action: "getEntryExitStatus" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("서버에서 받은 데이터:", data);
      /////////////////////////////////////
      //서버에서 가져온 데이터 정렬순서 가공//
      /////////////////////////////////////
      // 기본 
      // setRawData(data);

      //역순 정렬
      // setRawData(data.reverse());

      // updatedAt기준 내림차순 정렬
      const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setRawData(sortedData);


    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    return () => {
      ws.close();
    };
  }, []);

  // (3) 날짜·시간 분리 (null 체크 추가)
  const processedData = rawData.map((item) => {
    let entryDate = "", entryTime = "", exitDate = "", exitTime = "";
    if (item.entryTime) {
      [entryDate, entryTime] = item.entryTime.split(" ");
    }
    if (item.exitTime) {
      [exitDate, exitTime] = item.exitTime.split(" ");
    }
    return { ...item, entryDate, entryTime, exitDate, exitTime };
  });

  // (4) "최신 데이터"를 기본 선택
  const [selectedData, setSelectedData] = useState(null);
  useEffect(() => {
    if (processedData.length > 0 && !selectedData) {
      setSelectedData(processedData[0]);
    }
  }, [processedData, selectedData]);

  // (5) 필터 관련 상태
  const [filters, setFilters] = useState({});
  const labels = [
    { label: "상태", key: "transactionStatus" },
    { label: "차량번호", key: "carNumber" },
    { label: "들어온날짜", key: "entryDate" },
    { label: "들어온시간", key: "entryTime" },
    { label: "나간날짜", key: "exitDate" },
    { label: "나간시간", key: "exitTime" },
  ];

  // (6) 필터 로직
  const filteredData = processedData.filter((row) =>
    Object.entries(filters).every(([colIndex, value]) =>
      value === "" || row[labels[colIndex].key] === value
    )
  );

  // (7) 열별 고유값 추출
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

  // (8) 그리드 설정
  const colSizes = {
    0: "35px",
    1: "70px",
    2: "70px",
    3: "60px",
    4: "70px",
    5: "60px",
  };
  const GRID_HEIGHT = "950px";

  // (9) 데이터 로딩 전 처리
  if (!selectedData) {
    return <div>데이터 로딩 중...</div>;
  }

  // (10) 이미지 URL 생성 함수
  const getImageUrl = (path) => SERVER_URL + path;

  // (11) 저장 로직: PUT 시도, 404면 POST로 전환
  // async function saveEntry(data) {
  //   // 입차: transactionStatus가 "입차"라고 가정
  //   if (data.transactionStatus === "입차") {
  //     const urlWithoutId = `${SERVER_URL}/api/entry`;
  //     try {
  //       const response = await fetch(urlWithoutId, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       });
  //       const result = await response.json();
  //       console.log("저장 결과:", result);
  //       return result;
  //     } catch (error) {
  //       console.error("저장 중 오류 발생:", error);
  //     }
  //   }
  //   // 출차: transactionStatus가 "출차"라고 가정
  //   else if (data.transactionStatus === "출차") {
  //     const urlWithId = `${SERVER_URL}/api/entry/${data.id}`;
  //     const urlWithoutId = `${SERVER_URL}/api/entry`;
  //     try {
  //       let response = await fetch(urlWithId, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       });
  //       if (!response.ok && response.status === 404) {
  //         console.warn("PUT 실패, POST로 전환합니다.");
  //         response = await fetch(urlWithoutId, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(data),
  //         });
  //       }
  //       const result = await response.json();
  //       console.log("저장 결과:", result);
  //       return result;
  //     } catch (error) {
  //       console.error("저장 중 오류 발생:", error);
  //     }
  //   }
  // }

  // (12) 화면 렌더
  return (
    <div className="entry-status-container">
      {/* (A) 왼쪽 섹션: 입차/출차 사진, 차량번호 등 */}
      <div className="left-section">
        {/* (A-1) 입차 */}
        <div className="photo-text-group">
          <div className="row-flex">
            <div className="photo-area">
              <div className="photo-area-header">입차</div>
              <div className="main-photo-wrapper">
                <div
                  style={{
                    width: "100%",
                    height: "65%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedData.inImg1 ? (
                    <img
                      // src={'http://10.125.121.208:8080/images/20250213_130354_inImg1.PNG'}
                      src={getImageUrl(selectedData.inImg1)}
                      alt="입차 사진"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    "입차 사진 없음"
                  )}
                </div>
                <div className="small-photos">
                  <div className="small-photo-box">
                    {selectedData.inImg2 ? (
                      <img
                        src={getImageUrl(selectedData.inImg2)}
                        alt="inImg2"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "photo2"
                    )}
                  </div>
                  <div className="small-photo-box">
                    {selectedData.inImg3 ? (
                      <img
                        src={getImageUrl(selectedData.inImg3)}
                        alt="inImg3"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "photo3"
                    )}
                  </div>
                  {/* <div className="small-photo-box">
                    {selectedData.photo4 ? (
                      <img
                        src={getImageUrl(selectedData.photo4)}
                        alt="photo4"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "photo4"
                    )}
                  </div> */}
                </div>
              </div>
            </div>
            {/* (A-1-2) 차량번호, 중량 */}
            <div className="text-box">
              <div className="single-text-block">
                <div className="block-header">차량번호</div>
                <div className="block-body">{selectedData.carNumber}</div>
              </div>
              <div className="single-text-block">
                <div className="block-header">중량</div>
                <div className="block-body">{selectedData.entryWeight}</div>
              </div>
            </div>
          </div>
        </div>

        {/* (A-2) 출차 */}
        <div className="photo-text-group">
          <div className="row-flex">
            <div className="photo-area">
              <div className="photo-area-header">출차</div>
              <div className="main-photo-wrapper">
                <div
                  style={{
                    width: "100%",
                    height: "65%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedData.outImg1 ? (
                    <img
                      src={getImageUrl(selectedData.outImg1)}
                      alt="출차 사진"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    "출차 사진 없음"
                  )}
                </div>
                <div className="small-photos">
                  <div className="small-photo-box">
                    {selectedData.outImg2 ? (
                      <img
                        src={getImageUrl(selectedData.outImg2)}
                        alt="outImg2"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "photo3"
                    )}
                  </div>
                  <div className="small-photo-box">
                    {selectedData.outImg3 ? (
                      <img
                        src={getImageUrl(selectedData.outImg3)}
                        alt="outImg3"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "photo4"
                    )}
                  </div>
                  {/* <div className="small-photo-box">
                    {selectedData.photo1 ? (
                      <img
                        src={getImageUrl(selectedData.photo1)}
                        alt="photo1"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "photo1"
                    )}
                  </div> */}
                </div>
              </div>
            </div>
            {/* (A-2-2) 차량번호, 중량 */}
            <div className="text-box">
              <div className="single-text-block">
                <div className="block-header">차량번호</div>
                <div className="block-body">{selectedData.exitDate ? selectedData.carNumber : ""}</div>
              </div>
              <div className="single-text-block">
                <div className="block-header">중량</div>
                <div className="block-body">{selectedData.exitWeight}</div>
              </div>
            </div>
          </div>
        </div>

        {/* (A-3) 저장 버튼 추가
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => saveEntry(selectedData)}>저장</button>
        </div> */}
      </div>

      {/* (B) 오른쪽 그리드 영역 */}
      <div
        style={{
          height: GRID_HEIGHT,
          overflow: "auto",
          position: "relative",
        }}
      >
        <CustomGrid
          rows={filteredData.length + 1}
          cols={labels.length}
          defaultRowSize="32px"
          colSizes={colSizes}
          cellContent={(rowIndex, colIndex) => {
            if (rowIndex === 0) {
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
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    appearance: "none",
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
            const data = filteredData[rowIndex - 1];
            if (!data) return null;
            const { key } = labels[colIndex];
            const cellValue = data[key];
            if (key === "carNumber") {
              return (
                <span
                  style={{
                    cursor: "pointer",
                    color: "#1e88e5",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    setSelectedData(data);
                  }}
                >
                  {cellValue}
                </span>
              );
            }
            return cellValue;
          }}
          cellStyle={(rowIndex, colIndex) => {
            if (rowIndex === 0) {
              return {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: "11px",
                border: "1px solid #ccc",
                position: "sticky",
                top: 0,
              };
            }
            const rowData = filteredData[rowIndex - 1];
            const baseStyle = { fontSize: "11px" };
            if (rowData && selectedData && rowData.carNumber === selectedData.carNumber) {
              return { ...baseStyle, backgroundColor: "yellow" };
            }
            return baseStyle;
          }}
        />
      </div>
    </div>
  );
}
