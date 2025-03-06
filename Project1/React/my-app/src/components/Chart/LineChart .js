import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ width = 400, height = 250, data: MetalPrice, title ='제목을입력하세요' }) => {
  // 날짜 그룹화 함수 (effectiveDate 사용)
  
  const groupBy = (data, granularity) => {
    const groupedData = {};
    data.forEach(({ effectiveDate, prices }) => {
      let key = effectiveDate;
      if (granularity === "month") {
        key = effectiveDate.slice(0, 7); // "YYYY-MM"
      } else if (granularity === "quarter") {
        const [year, month] = effectiveDate.split("-");
        const quarter = Math.ceil(parseInt(month, 10) / 3);
        key = `${year}-Q${quarter}`;
      }
      if (!groupedData[key]) {
        groupedData[key] = {};
      }
      Object.keys(prices).forEach((material) => {
        groupedData[key][material] = (groupedData[key][material] || 0) + prices[material];
      });
    });

    return Object.entries(groupedData).map(([key, prices]) => ({ effectiveDate: key, prices }));
  };

  // 최근 10일 데이터만 가져오기 (effectiveDate 기준 정렬)
  const getLastNDaysData = (data, days) => {
    const sortedData = [...data].sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
    return sortedData.slice(0, days).reverse();
  };

  // 상태 관리
  const [view, setView] = useState("daily"); // 기본값: 일자별

  // 선택에 따라 데이터 그룹화
  const filteredData =
    view === "daily"
      ? getLastNDaysData(MetalPrice, 10) // 일자별: 최근 10일
      : view === "monthly"
      ? groupBy(MetalPrice, "month")
      : groupBy(MetalPrice, "quarter");

  // 차트 데이터 준비 (labels: effectiveDate 사용)
  const labels = filteredData.map((item) => item.effectiveDate);
  const datasets = Object.keys(filteredData[0].prices)
    .sort((a, b) => {
      // 재료의 고정 순서를 정의
      const order = ['IRON', 'ALUMINUM', 'COPPER', 'STAINLESS', 'NICKEL', 'ZINC'];
      return order.indexOf(a) - order.indexOf(b);
    })
    .map((material) => {
      // 재료와 색상을 매칭하는 객체
      const colorMap = {
        'IRON': 'rgba(255, 0, 0, 0.6)',       // 철 (붉은색)
        'ALUMINUM': 'rgba(192, 192, 192, 0.6)', // 알루미늄 (은색)
        'COPPER': 'rgba(184, 115, 51, 0.6)',    // 구리 (구리색)
        'STAINLESS': 'rgba(169, 169, 169, 0.6)', // 스테인리스 (회색)
        'NICKEL': 'rgba(105, 105, 105, 0.6)',   // 주철 (어두운 회색)
        'ZINC': 'rgba(30, 144, 255, 0.6)',       // 아연 (파란색)
      };

      return {
        label: material,
        data: filteredData.map((item) => item.prices[material]),
        fill: false,
        borderColor: colorMap[material] || 'rgba(0, 0, 0, 0.6)',
        backgroundColor: colorMap[material] || 'rgba(0, 0, 0, 0.6)',
        tension: 0.1,
      };
    });

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: title,
        position: 'top',
        align: 'center',
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
      }}
    >
      <select
        value={view}
        onChange={(e) => setView(e.target.value)}
        style={{
          position: 'relative',
          top: '30px',
          left: '270px',
          zIndex: 1,
        }}
      >
        <option value="daily">일자별</option>
        <option value="monthly">월별</option>
        <option value="quarterly">분기별</option>
      </select>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
