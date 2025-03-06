import React from "react";

const MergeCustomGrid = ({
  rows,
  cols,
  cellContent,
  colSizes = {},
  rowSizes = {},
  defaultRowSize = "auto",
  defaultColSize = "auto",
  cellStyle = () => ({}),
  mergedCells = [],
  horizontalAlign = "center",
  verticalAlign = "middle",
  onCellClick,
}) => {
  const mergedCellsMap = new Map();
  const coveredCells = new Set();

  mergedCells.forEach(({ row, col, rowSpan = 1, colSpan = 1 }) => {
    mergedCellsMap.set(`${row}-${col}`, { rowSpan, colSpan });
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        if (r === row && c === col) continue;
        coveredCells.add(`${r}-${c}`);
      }
    }
  });

  const colWidths = Array.from({ length: cols }).map(
    (_, colIndex) => colSizes[colIndex] || defaultColSize
  );

  const rowHeights = Array.from({ length: rows }).map(
    (_, rowIndex) => rowSizes[rowIndex] || defaultRowSize
  );

  const justifyContentMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  const alignItemsMap = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
  };

  // 병합된 셀 영역에서, row-major 순서(위에서 아래, 왼쪽에서 오른쪽)로
  // non-null 값을 찾는 함수
  const getMergedContent = (startRow, startCol, rowSpan, colSpan) => {
    for (let r = startRow; r < startRow + rowSpan; r++) {
      for (let c = startCol; c < startCol + colSpan; c++) {
        const value = cellContent(r, c);
        if (value !== null) return value;
      }
    }
    return null;
  };

  return (
    <div className="flex">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: colWidths.join(" "),
          gridTemplateRows: rowHeights.join(" "),
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;

            if (coveredCells.has(cellKey)) {
              return null;
            }

            const mergeInfo = mergedCellsMap.get(cellKey);
            const customStyle = cellStyle(rowIndex, colIndex) || {};

            const alignmentStyle = {
              justifyContent: justifyContentMap[horizontalAlign] || "center",
              alignItems: alignItemsMap[verticalAlign] || "center",
            };

            if (mergeInfo) {
              alignmentStyle.gridColumn = `span ${mergeInfo.colSpan}`;
              alignmentStyle.gridRow = `span ${mergeInfo.rowSpan}`;
            }

            const baseBorder = "1px solid #ccc";
            const cellBorders = {
              borderTop: rowIndex === 0 ? baseBorder : "none",
              borderLeft: colIndex === 0 ? baseBorder : "none",
              borderRight: baseBorder,
              borderBottom: baseBorder,
            };

            const handleClick = () => {
              if (onCellClick) {
                onCellClick(rowIndex, colIndex);
              }
            };

            // 병합된 셀이면 해당 영역 내의 첫번째 non-null 값을 사용
            const content = mergeInfo
              ? getMergedContent(rowIndex, colIndex, mergeInfo.rowSpan, mergeInfo.colSpan)
              : cellContent(rowIndex, colIndex);

            return (
              <div
                key={`row-${rowIndex}-col-${colIndex}`}
                className="bg-gray-200 p-1 text-center flex"
                style={{
                  ...alignmentStyle,
                  ...customStyle,
                  ...cellBorders,
                }}
                onClick={handleClick}
              >
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MergeCustomGrid;
