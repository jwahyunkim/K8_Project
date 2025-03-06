import { useEffect, useState } from "react";

export const useDataJoin = (data1, data2, joinKey) => {
  const [mergedData, setMergedData] = useState(null);

  useEffect(() => {
    if (data1 && data2) {
      const merged = data1.map((item1) => {
        const item2 = data2.find((item) => item[joinKey] === item1[joinKey]);
        return { ...item1, ...item2 };
      });
      setMergedData(merged);
    }
  }, [data1, data2, joinKey]);

  return mergedData;
};
