// 필요한 라이브러리 및 훅 임포트
import React, { useState } from "react";
import { usePost } from "../../../hooks/usePost"; // 커스텀 POST 훅 임포트
import MergeCustomGrid from "../../Grid/MergeCustomGrid"; // 그리드 컴포넌트 임포트
import {  FaSave } from "react-icons/fa";


function VehicleRegister() {
    // 커스텀 POST 훅에서 필요한 상태와 함수를 가져옴
    const { responseData, isPosting, postError, postData } = usePost();

    // 폼 데이터 상태 초기화
    const [formData, setFormData] = useState({
        brn: "", // 사업자번호
        carNumber: "", // 차량번호
        numberPlate: null, // 번호판 파일
    });

    // 폼 필드 라벨 및 설정
    const labels = [
        { label: "사업자번호", key: "brn", required: false },
        { label: "차량번호", key: "carNumber", required: false },
        { label: "번호판", key: "numberPlate", required: false, type: "file" }, // 파일 입력 필드
    ];


    /**
     * 입력 필드 변경 시 호출되는 함수
     * @param {string} field - 필드의 키 (예: 'brn', 'carNumber', 'numberPlate')
     * @param {any} value - 필드의 새로운 값
     */
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    /**
     * 폼 제출 시 호출되는 함수
     * @param {Event} e - 폼 제출 이벤트
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지

        // 필수 입력값 확인
        for (const field of labels) {
            if (field.required && !formData[field.key]) {
                alert(`${field.label}은(는) 필수 입력값입니다.`);
                return; // 필수 입력값이 없으면 함수 종료
            }
        }

        // FormData 객체 생성 (파일 업로드를 위해 필요)
        const formDataToSend = new FormData();
        for (const field of labels) {
            if (formData[field.key]) {
                // 파일과 텍스트 데이터를 구분하지 않고 추가
                formDataToSend.append(field.key, formData[field.key]);
            }
        }

        // FormData 내용 확인 (디버깅 용도)
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }

        // POST 요청 보내기
        // const url = "http://localhost:3001/upload"; // 파일 업로드 엔드포인트-node.js로 자체확인용
        const url = "http://10.125.121.208:8080/car"; // 파일 업로드 엔드포인트
        try {
            await postData(url, formDataToSend); // POST 요청 수행
            // alert("파일이 성공적으로 업로드되었습니다."); // 성공 메시지 표시
            // 필요 시 추가적인 후처리 로직 작성 가능
        } catch (error) {
            console.error("파일 업로드 실패:", error); // 에러 콘솔 출력
            // alert("파일 업로드에 실패했습니다."); // 실패 메시지 표시
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto p-4 ml-0 mr-0">
            {/* 차량 등록 폼 컨테이너 */}
            <div className="flex flex-col justify-center items-start w-full  rounded-md p-4">
                <h1 className="text-2xl font-bold mb-4">차량 등록</h1>
                <hr className="w-[1450px] border-t-2 border-black mb-4" />
               {/* ////////////////// */}

                <div className="w-[1450px] bg-[#434a4f] text-white py-1 flex justify-start space-x-4">
                    
                    {/* 저장 버튼 */}
                    <button
                        className="flex items-center space-x-2 hover:bg-gray-600 px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        <FaSave className="w-5 h-5" />
                        <span>저장</span>
                    </button>
                  
                </div>

                {/* ////////////////// */}
                {/* 폼 시작 */}
                <form onSubmit={handleSubmit} className="flex justify-center w-auto">
                    <div className="flex justify-center flex-col w-fit items-center overflow-auto">
                        {/* 그리드 컴포넌트 사용 */}
                        <MergeCustomGrid
                            rows={labels.length} // 행 수는 라벨의 길이만큼
                            cols={2} // 두 개의 열 (라벨과 입력 필드)
                            horizontalAlign="left" // 수평 정렬 왼쪽
                            defaultRowSize="32px" // 기본 행 높이
                            colSizes={{ 0: "135px", 1: "465px" }} // 각 열의 너비 설정
                            rowSizes={{ 4: "30px", 5: "30px" }} // 특정 행의 높이 설정 (필요 시)
                            /**
                             * 각 셀의 내용을 정의하는 함수
                             * @param {number} rowIndex - 현재 행의 인덱스
                             * @param {number} colIndex - 현재 열의 인덱스
                             * @returns {JSX.Element|null} - 셀에 렌더링할 JSX 요소
                             */
                            cellContent={(rowIndex, colIndex) => {
                                const { label, key, required, type } = labels[rowIndex]; // 현재 행의 라벨 정보

                                if (colIndex === 0) {
                                    // 첫 번째 열: 라벨 표시
                                    return (
                                        <span>
                                            {required && <span className="text-red-500">*</span>} {/* 필수 입력 시 별표 표시 */}
                                            {label}
                                        </span>
                                    );
                                }

                                if (colIndex === 1) {
                                    // 두 번째 열: 입력 필드 표시
                                    if (type === "file") {
                                        // 파일 입력 필드인 경우
                                        return (
                                            <div className="flex items-center">
                                                {/* 선택된 파일 이름 또는 기본 텍스트 표시 */}
                                                <span className="mr-2 w-[200px] border border-black px-2 py-0 bg-white">
                                                    {formData[key] ? formData[key].name : "선택된 파일 없음"}
                                                </span>
                                                {/* 파일 선택 라벨 */}
                                                <label
                                                    htmlFor={key}
                                                    className="px-4 py-0 bg-gray-300 border border-black rounded cursor-pointer hover:bg-gray-400"
                                                >
                                                    파일 선택
                                                </label>
                                                {/* 실제 파일 입력 필드 (숨김) */}
                                                <input
                                                    id={key}
                                                    type="file"
                                                    name={key} // 파일 입력 필드의 이름
                                                    onChange={(e) => handleInputChange(key, e.target.files[0])} // 파일 선택 시 상태 업데이트
                                                    className="hidden" // 기본 파일 입력 필드 숨김
                                                />
                                            </div>
                                        );
                                    }

                                    // 기본 텍스트 입력 필드인 경우
                                    return (
                                        <input
                                            type="text"
                                            placeholder=""
                                            value={formData[key]}
                                            onChange={(e) => handleInputChange(key, e.target.value)} // 입력 시 상태 업데이트
                                            className="w-[125px] h-full border border-black px-1 py-3 focus:outline-none" // Tailwind CSS 클래스
                                        />
                                    );
                                }

                                return null; // 그 외의 경우 아무 것도 렌더링하지 않음
                            }}
                            /**
                             * 각 셀의 스타일을 정의하는 함수
                             * @param {number} rowIndex - 현재 행의 인덱스
                             * @param {number} colIndex - 현재 열의 인덱스
                             * @returns {object} - 셀에 적용할 스타일 객체
                             */
                            cellStyle={(rowIndex, colIndex) => {
                                if (colIndex === 0) {
                                    // 첫 번째 열의 스타일 (라벨)
                                    return {
                                        backgroundColor: "",
                                        color: "",
                                        fontWeight: "",
                                        border: ""
                                    };
                                }
                                if (colIndex === 1) {
                                    // 두 번째 열의 스타일 (입력 필드)
                                    return {
                                        backgroundColor: "white",
                                        color: "",
                                        fontWeight: "",
                                        border: ""
                                    };
                                }
                                return {}; // 그 외의 경우 기본 스타일
                            }}
                        />
                        {/* 제출 버튼 */}
                        {/* <button
                            type="submit" // 폼 제출 버튼으로 설정
                            className="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            제출하기
                        </button> */}
                    </div>
                </form>

                {/* 제출 상태 표시 */}
                {isPosting && <p className="mt-2">업로드 중...</p>} {/* 업로드 중일 때 표시 */}
                {postError && <p className="mt-2 text-red-500">업로드 실패: {postError}</p>} {/* 업로드 실패 시 에러 메시지 */}
                {responseData && <p className="mt-2 text-green-500">업로드 성공!</p>} {/* 업로드 성공 시 성공 메시지 */}
            </div>

        </div>

    );
}

export default VehicleRegister;
