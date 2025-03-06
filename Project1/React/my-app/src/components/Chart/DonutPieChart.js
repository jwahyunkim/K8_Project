import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const DonutPieChart = ({ chartData, width = 450, height = 350 }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [groupBy, setGroupBy] = useState('date'); // 그룹화 기준: date, month, quarter

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleGroupChange = (event) => {
    setGroupBy(event.target.value);
    setSelectedDate(''); // 그룹화 변경 시 선택 초기화
  };

  const handleSelectChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // 고정된 색상 매핑 (레이블과 색상 연결)
  const colorMapping = {
    IRON: 'rgba(255, 0, 0, 0.6)', // 붉은색
    ALUMINUM: 'rgba(192, 192, 192, 0.6)', // 은색
    COPPER: 'rgba(184, 115, 51, 0.6)', // 구리색
    STAINLESS: 'rgba(169, 169, 169, 0.6)', // 회색
    NICKEL: 'rgba(105, 105, 105, 0.6)', // 어두운 회색
    ZINC: 'rgba(30, 144, 255, 0.6)', // 파란색
  };

  const hoverColorMapping = {
    IRON: 'rgba(255, 0, 0, 0.8)', // 붉은색 (hover)
    ALUMINUM: 'rgba(192, 192, 192, 0.8)', // 은색 (hover)
    COPPER: 'rgba(184, 115, 51, 0.8)', // 구리색 (hover)
    STAINLESS: 'rgba(169, 169, 169, 0.8)', // 회색 (hover)
    NICKEL: 'rgba(105, 105, 105, 0.8)', // 어두운 회색 (hover)
    ZINC: 'rgba(30, 144, 255, 0.8)', // 파란색 (hover)
  };


  // 데이터 그룹화 함수
  const groupData = (data, groupBy) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.date);
      let groupKey;

      if (groupBy === 'month') {
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      } else if (groupBy === 'quarter') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        groupKey = `${date.getFullYear()}-Q${quarter}`; // YYYY-Qx
      } else {
        groupKey = item.date; // YYYY-MM-DD
      }

      if (!acc[groupKey]) acc[groupKey] = {};
      Object.keys(item).forEach((key) => {
        if (key !== 'date') {
          acc[groupKey][key] = (acc[groupKey][key] || 0) + item[key];
        }
      });

      return acc;
    }, {});
  };

  // 선택된 그룹화 방식에 따라 데이터를 그룹화
  const groupedData = groupData(chartData, groupBy);

  // 선택된 그룹 (일자, 월별, 분기별)에 맞는 데이터 필터링
  const filteredData = selectedDate
    ? [groupedData[selectedDate]].filter(Boolean)
    : Object.entries(groupedData).map(([key, value]) => ({ date: key, ...value }));

  // 필터링된 데이터를 합산하여 차트에 사용할 데이터 생성
  const aggregatedData = filteredData.reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'date') {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  // 차트 데이터 생성
  const chartLabels = Object.keys(aggregatedData);
  const chartValues = Object.values(aggregatedData);

  const totalValue = chartValues.reduce((sum, value) => sum + value, 0);

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: chartLabels.map((label) => colorMapping[label] || 'rgba(211, 211, 211, 0.6)'), // 고정 색상
        hoverBackgroundColor: chartLabels.map((label) => hoverColorMapping[label] || 'rgba(211, 211, 211, 0.8)'), // 고정 hover 색상
        borderWidth: 1,
        radius: '100%',  // 차트 바깥둘레를 전체 캔버스의 80%로 설정 (예시)

      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 비율 유지 비활성화
    plugins: {
      legend: {
        position: 'right', // 범례를 오른쪽으로 이동
        align: 'end', // 하단 정렬
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0];
            return chart.data.labels.map((label, index) => {
              const value = datasets.data[index];
              const percentage = ((value / totalValue) * 100).toFixed(2);
              return {
                text: `${label}: ${value} (${percentage}%)`,
                fillStyle: datasets.backgroundColor[index],
              };
            });
          },
        },
      },
    },
    layout: {
      padding: {
        top: 0,
        bottom: 20, // 아래쪽 여백 추가
        right: 10, // 범례와 차트 사이 간격
      },
    },
  };



  return (
    <div className="flex flex-row items-start p-[10px] gap-6">
      <div
        className="relative"
        style={{
          width,
          height,
        }}
      >
        {/* 차트 영역 */}
        {filteredData.length > 0 ? (
          <Pie data={pieData} options={options} />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: '100px',    // 원하는 위치로 수정
              left: '50px',   // 원하는 위치로 수정
              color: 'red',   // 텍스트 색상 예시
              fontWeight: 'bold',
            }}
          >
            해당 날짜에는 자료가 없습니다.
          </div>
        )}

        {/* 셀렉트 박스 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', // 세로 정렬
            // position: 'relative',
            // top: '-350px',
            // left: '300px',
            position: 'absolute',
            top: '0px',
            left: '300px',
            zIndex: 10,
            gap: '10px', // 각 요소 간 간격 추가
          }}
        >
          {/* 그룹화 기준 선택 셀렉트 박스 */}
          <select
            value={groupBy}
            onChange={handleGroupChange}
            className="p-[4px] border border-gray-300"
            style={{
              width: '120px', // 크기 줄이기
            }}
          >
            <option value="date">일자별</option>
            <option value="month">월별</option>
            <option value="quarter">분기별</option>
          </select>

          {/* 입력 방식 변경 셀렉트 박스 */}
          {groupBy === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="p-[4px] border border-gray-300"
              style={{
                width: '120px', // 크기 줄이기
              }}
            />
          )}
          {groupBy === 'month' && (
            <select
              value={selectedDate}
              onChange={handleSelectChange}
              className="p-[4px] border border-gray-300"
              style={{
                width: '120px', // 크기 줄이기
              }}
            >
              <option value="">Select</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, '0');
                return (
                  <option key={month} value={`2025-${month}`}>
                    {month}월
                  </option>
                );
              })}
            </select>
          )}
          {groupBy === 'quarter' && (
            <select
              value={selectedDate}
              onChange={handleSelectChange}
              className="p-[4px] border border-gray-300"
              style={{
                width: '120px', // 크기 줄이기
              }}
            >
              <option value="">Select</option>
              {Array.from({ length: 4 }, (_, i) => (
                <option key={i + 1} value={`2025-Q${i + 1}`}>
                  {i + 1}분기
                </option>
              ))}
            </select>
          )}
        </div>


      </div>
    </div>
  );
};

export default DonutPieChart;
