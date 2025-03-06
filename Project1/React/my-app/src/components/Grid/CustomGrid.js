import React from "react";

const CustomGrid = ({
  rows,
  cols,
  cellContent,
  colSizes = {},
  rowSizes = {},
  defaultRowSize = "auto",
  defaultColSize = "auto",
  cellStyle = () => ({}), // 추가: 각 셀 스타일을 담는 함수
}) => {
  const colWidths = Array.from({ length: cols }).map(
    (_, colIndex) => colSizes[colIndex] || defaultColSize
  );

  const rowHeights = Array.from({ length: rows }).map(
    (_, rowIndex) => rowSizes[rowIndex] || defaultRowSize
  );

  return (
    <div className="flex ">
      <div
        className={`grid gap-0`}
        style={{
          gridTemplateColumns: colWidths.join(" "),
          gridTemplateRows: rowHeights.join(" "),
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={`row-${rowIndex}-col-${colIndex}`}
              className="bg-gray-200 border border-gray-300 p-1 text-center flex items-center"
              style={cellStyle(rowIndex, colIndex)} // 추가: 셀 스타일 적용
            >
              {cellContent(rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomGrid;
