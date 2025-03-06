import '../../App.css';
import React, { useState } from "react";
import { usePost } from '../../hooks/usePost';
import CustomGrid from '../../components/Grid/CustomGrid';

function SignUp() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 필수 입력값 확인 로직
        for (const field of labels) {
            if (field.required && !formData[field.key]) {
                alert(`${field.label}은(는) 필수 입력값입니다.`);
                return; // 제출 중단
            }
        }

        // 비밀번호 확인 로직
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return; // 제출 중단
        }
        const emailAddress =
            formData.emailLocal && formData.emailDomain
                ? `${formData.emailLocal}@${formData.emailDomain}`
                : '';

        const url = "http://10.125.121.208:8080/member"; // 프로토콜 추가
        // const url = "http://localhost:8080/member"; // 프로토콜 추가
        const dataToSend = {
            ...formData,
            emailAddress, // 이메일 주소 포함
            confirmPassword: undefined, // confirmPassword 제거
            emailLocal: undefined, // emailLocal 제거
            emailDomain: undefined, // emailDomain 제거
        };

        console.log("실제 전송 데이터:", dataToSend);

        await postData(url, dataToSend);

        if (postError) {
            console.error("POST 요청 에러:", postError);
        }
    };

    const { responseData, isPosting, postError, postData } = usePost();

    const [formData, setFormData] = useState({
        name: "",
        brn: "",
        userId: "",
        password: "",
        confirmPassword: "",
        // birth: "",  //생일
        //gender: "", // 성별 
        postalCode: "",
        address: "",
        detailAddress: "",
        contact: "",
        emailLocal: "", // 추가: 이메일 로컬 파트
        emailDomain: "", // 추가: 이메일 도메인 파트
        // carNumber: "", //차량번호
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const labels = [
        { label: "업체명", key: "name", required: false },
        { label: "사업자번호", key: "brn", required: false },
        { label: "아이디", key: "userId", required: false },
        { label: "비밀번호", key: "password", required: false },
        { label: "비밀번호 확인", key: "confirmPassword", required: false },
        // { label: "생일/성별", key: "birth", required: false },  
        { label: "우편번호", key: "postalCode", required: false },
        { label: "집주소", key: "address", required: false },
        { label: "상세주소", key: "detailAddress", required: false },
        { label: "연락처", key: "contact", required: false },
        { label: "이메일", key: "email", required: false },
        // { label: "차량번호", key: "carNumber", required: false },
    ];

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto p-4">
        {/* 차량 등록 폼 컨테이너 */}
        <div className="flex flex-col justify-center items-start w-full  rounded-md p-4">
            <h1 className="text-2xl font-bold mb-4">업체 등록</h1>
            <hr className="w-full border-t-2 border-black mb-4" />

                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="flex justify-center items-center w-[600px]">
                        <CustomGrid
                            rows={labels.length}
                            cols={2}
                            defaultRowSize="32px"
                            colSizes={{ 0: "135px", 1: "465px" }}
                            cellContent={(rowIndex, colIndex) => {
                                const { label, key, required } = labels[rowIndex];
                                if (colIndex === 0) {
                                    return (
                                        <span>
                                            {required && <span className="text-red-500">*</span>} {label}
                                        </span>
                                    );
                                }
                                if (colIndex === 1) {
                                    if (key === 'password' || key === 'confirmPassword') {
                                        return (
                                            <input
                                                type="password"
                                                placeholder=""
                                                value={formData[key]}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="w-[100px] h-full border border-black px-1 py-3 focus:outline-none"
                                            />
                                        );
                                    }
                                    // 생일/성별 주석처리함 활성화시키려면 label에서 주석 풀어야됨
                                    else if (key === "birth") {  //생일
                                        // 생일/성별 커스터마이징
                                        return (
                                            <div className="flex gap-2">
                                                <input
                                                    type="date"
                                                    value={formData[key]}
                                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                                    className="w-full h-full border border-gray-300 px-[3px] focus:outline-none"
                                                />
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="MALE"
                                                        checked={formData.gender === "MALE"}
                                                        onChange={(e) => handleInputChange("gender", e.target.value)}
                                                        className=""
                                                    />
                                                    남
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="FEMALE"
                                                        checked={formData.gender === "FEMALE"}
                                                        onChange={(e) => handleInputChange("gender", e.target.value)}
                                                        className=""
                                                    />
                                                    여
                                                </label>
                                            </div>
                                        );
                                    } 
                                    else if (key === 'brn') {
                                        return (
                                            <input
                                                type="text"
                                                placeholder=""
                                                value={formData[key]}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="w-[200px] h-full border border-black px-1 py-3 focus:outline-none"
                                            />
                                        );
                                    } else if (key === 'address' || key === 'detailAddress') {
                                        return (
                                            <input
                                                type="text"
                                                placeholder=""
                                                value={formData[key]}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="w-[300px] h-full border border-black px-1 py-3 focus:outline-none"
                                            />
                                        );
                                    } else if (key === 'postalCode') {
                                        return (
                                            <input
                                                type="text"
                                                placeholder=""
                                                value={formData[key]}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="w-[100px] h-full border border-black px-1 py-3 focus:outline-none"
                                            />
                                        );
                                    }

                                    else if (key === "email") {
                                        // 이메일 커스터마이징
                                        return (
                                            <div className="flex justify-start items-center h-full w-full">
                                                <input
                                                    type="text"
                                                    placeholder=""
                                                    value={formData.emailLocal}
                                                    onChange={(e) => handleInputChange("emailLocal", e.target.value)}
                                                    className="w-[100px] h-[26px] border border-black px-[4px] focus:outline-none"
                                                />
                                                <span className="px-1">@</span>
                                                <select
                                                    value={formData.emailDomain}
                                                    onChange={(e) => handleInputChange("emailDomain", e.target.value)}
                                                    className="w-[200px] h-[26px] border border-black  focus:outline-none"
                                                >
                                                    <option value="">도메인 선택</option>
                                                    <option value="gmail.com">gmail.com</option>
                                                    <option value="naver.com">naver.com</option>
                                                    <option value="daum.net">daum.net</option>
                                                </select>
                                            </div>
                                        );
                                    }
                                    // 기본 입력 필드
                                    return (
                                        <input
                                            type="text"
                                            placeholder=""
                                            value={formData[key]}
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                            className="w-[125px] h-full border border-black px-1 py-3 focus:outline-none"
                                        />
                                    );
                                }
                                return null;
                            }}
                            cellStyle={(rowIndex, colIndex) => {
                                if (colIndex === 0) {
                                    return {
                                        backgroundColor: "",
                                        color: "",
                                        fontWeight: "",
                                        border: ""
                                    }
                                }
                                if (colIndex === 1) {
                                    return {
                                        backgroundColor: "white",
                                        color: "",
                                        fontWeight: "",
                                        border: ""
                                    };
                                }
                                return {};
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        제출하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
