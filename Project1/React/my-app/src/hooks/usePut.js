import { useState } from "react";
import axios from "axios";

export const usePut = () => {
  const [responseData, setResponseData] = useState(null);
  const [isPutting, setIsPutting] = useState(false);
  const [putError, setPutError] = useState(null);

  const putData = async (url, body) => {
    setIsPutting(true);
    setPutError(null);

    try {
      let axiosConfig = {};
      let actualBody = body;

      // 1) FormData인지 확인
      const isFormData = body instanceof FormData;

      if (isFormData) {
        // FormData인 경우 (파일 + 텍스트 혼합)
        // axios가 자동으로 `multipart/form-data`를 설정하므로 headers 지정 안 함
        axiosConfig = {
          headers: {
            // Content-Type을 비워두면 axios가 자동으로 multipart/form-data로 설정
          },
        };
      } else {
        // JSON 데이터인 경우 (단순 텍스트)
        actualBody = JSON.stringify(body);
        axiosConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      const response = await axios.put(url, actualBody, axiosConfig);
      setResponseData(response.data);
    } catch (err) {
      console.error("PUT 요청 에러:", err.response?.data || err.message);
      setPutError(err.response?.data?.message || "요청 처리 중 에러가 발생했습니다.");
    } finally {
      setIsPutting(false);
    }
  };

  return { responseData, isPutting, putError, putData };
};
