import { useState } from "react";
import axios from "axios";

export const usePost = () => {
  const [responseData, setResponseData] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const postData = async (url, body) => {
    setIsPosting(true);
    setPostError(null);

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
            "Content-Type": "multipart/form-data",
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

      const response = await axios.post(url, actualBody, axiosConfig);
      setResponseData(response.data);
    } catch (err) {
      console.error("POST 요청 에러:", err.response?.data || err.message);
      setPostError(err.response?.data?.message || "요청 처리 중 에러가 발생했습니다.");
    } finally {
      setIsPosting(false);
    }
  };

  return { responseData, isPosting, postError, postData };
};



//기존
// import { useState } from "react";
// import axios from "axios";

// export const usePost = () => {
//   const [responseData, setResponseData] = useState(null); // data를 responseData로 변경
//   const [isPosting, setIsPosting] = useState(false); // loading을 isPosting으로 변경
//   const [postError, setPostError] = useState(null); // error를 postError로 변경

//   const postData = async (url, body) => {
//     setIsPosting(true); // 로딩 상태 시작
//     setPostError(null); // 에러 초기화
//     try {
//         const response = await axios.post(url, body, {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         console.log("응답 데이터:", response.data); // 응답 확인용 디버깅
//         setResponseData(response.data); // 상태 업데이트
//     } catch (err) {
//         console.error("POST 요청 에러:", err.response?.data || err.message); // 에러 정보 출력
//         setPostError(err.response?.data?.message || "요청 처리 중 에러가 발생했습니다."); // 에러 상태 업데이트
//     } finally {
//         setIsPosting(false); // 로딩 상태 종료
//     }
// };

//   return { responseData, isPosting, postError, postData };
// };
