import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useGet = (url, dependencies = [], config = {}) => {
  const [fetchedData, setFetchedData] = useState(null); // data를 fetchedData로 변경
  const [isFetching, setIsFetching] = useState(false); // loading을 isFetching으로 변경
  const [fetchError, setFetchError] = useState(null); // error를 fetchError로 변경

  // fetchData 함수를 useCallback으로 메모이제이션
  const fetchData = useCallback(async () => {
    console.log("useget실행")
    setIsFetching(true);
    setFetchError(null);
    try {
      const response = await axios.get(url, config);
      console.log("response",response);
      setFetchedData(response.data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [ JSON.stringify(config)]); // config를 stringify하여 의존성 배열에 추가

  // useEffect에서 fetchData 호출
  useEffect(() => {
    fetchData();
  }, []);

  // refetch 함수 반환
  return { fetchedData, isFetching, fetchError, refetch: fetchData };
};