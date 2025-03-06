import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

function GroupedBarChart({
  data,
  width = 500,
  height = 300,
  xAxisKey = 'entryTime',
  barKeys, // 수정: 기본값 제거
  barColors = [
    'rgba(255, 0, 0, 0.6)',       // 철 (붉은색)
    'rgba(192, 192, 192, 0.6)',   // 알루미늄 (은색)
    'rgba(184, 115, 51, 0.6)',    // 구리 (구리색)
    'rgba(169, 169, 169, 0.6)',   // 스테인리스 (회색)
    'rgba(105, 105, 105, 0.6)',   // 니켈 (어두운 회색)
    'rgba(30, 144, 255, 0.6)',    // 아연 (파란색)
  ],
  limitXAxisCount = 0,
  sortOrder = 'desc',
  xAxisLabel,
  yAxisLabel,
}) {
  const [groupBy, setGroupBy] = useState('date'); // 그룹화 기준 상태

  // barKeys 동적 생성: 데이터에서 xAxisKey를 제외한 나머지 키 추출
  // 예: 전체 data에 대해 키를 모아 배열 만든 뒤 xAxisKey 제외
const dynamicBarKeys = barKeys 
|| Array.from(
     new Set(data.flatMap(item => Object.keys(item)))
   ).filter(key => key !== xAxisKey);


  const groupData = (data, groupBy) => {
    return data.reduce((acc, item) => {
      const date = new Date(item[xAxisKey]);
      const year = date.getFullYear();
      let groupKey, sortKey;

      switch (groupBy) {
        case 'month':
          groupKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          sortKey = new Date(year, date.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          groupKey = `${year}-Q${quarter}`;
          sortKey = new Date(year, (quarter - 1) * 3, 1);
          break;
        default:
          groupKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate()
          ).padStart(2, '0')}`;
          sortKey = date;
          break;
      }

      if (!acc[groupKey]) acc[groupKey] = { [xAxisKey]: groupKey, sortKey };

      dynamicBarKeys.forEach((key) => {
        acc[groupKey][key] = (acc[groupKey][key] || 0) + (item[key] || 0);
      });

      return acc;
    }, {});
  };

  const groupedData = Object.values(groupData(data, groupBy));

  const sortedData = [...groupedData].sort((a, b) => {
    const dateA = a.sortKey;
    const dateB = b.sortKey;
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const limitedData = limitXAxisCount > 0
    ? sortedData.slice(0, limitXAxisCount)
    : sortedData;

  const limitedBarKeys = dynamicBarKeys.slice(0, 6);

  console.log("Raw Data:", data);
  console.log("Grouped Data:", groupedData);
  console.log("Limited Data:", limitedData);

  return (
    <div style={{ position: 'relative', width, height: height + 50 }}>
      <select
        style={{
          position: 'absolute',
          top: 10,
          left: 525,
          zIndex: 1,
          padding: '5px',
          border: '1px solid #d1d5db', // gray-300 색상
        }}
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value)}
      >
        <option value="date">일자별</option>
        <option value="month">월별</option>
        <option value="quarter">분기별</option>
      </select>

      <BarChart
        width={width}
        height={height}
        data={limitedData}
        layout="horizontal"
        margin={{ top: 20, right: 80, bottom: 10, left: 40 }}
      >
        <XAxis dataKey={xAxisKey} type="category" reversed={true}>
          {xAxisLabel && (
            <Label value={xAxisLabel} offset={-5} position="bottom" />
          )}
        </XAxis>
        <YAxis>
          {yAxisLabel && (
            <Label
              value={yAxisLabel}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          )}
        </YAxis>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
        {limitedBarKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={barColors[index] || barColors[0]} />
        ))}
      </BarChart>
    </div>
  );
}


export default GroupedBarChart;
