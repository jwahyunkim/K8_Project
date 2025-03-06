import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../hooks/usePost';
import bgimage from '../../assets/images/Login.webp';
import logoimage from '../../assets/images/logo.png';
import { CiUser } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { jwtDecode } from 'jwt-decode';



export default function LogIn() {
  const navigate = useNavigate();
  const { responseData, isPosting, postError, postData } = usePost();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8080/login"; // 로그인 API 엔드포인트

    console.log("전송 데이터:", formData);
    await postData(url, formData);

    if (postError) {
      console.error("POST 요청 에러:", postError);
    }
  };

  // 로그인 성공 후 토큰 저장 및 페이지 이동, 콘솔 로그 추가
  useEffect(() => {
    if (responseData && responseData.token) {
      localStorage.setItem("token", responseData.token);
      console.log("토큰 저장됨:", responseData.token);

      // 토큰 디코딩해서 사용자 역할(role) 확인
      const decoded = jwtDecode(responseData.token);
      console.log("디코딩 결과:", decoded);

      // 역할에 따라 이동할 페이지 결정
      if (decoded.role === 'admin') {
        navigate("/VisitorManagement/sales-overview");
      } else if (decoded.role === 'vendor') {
        navigate("/Vendor/vehicle-register");
      } else {
        navigate("/"); // 다른 역할이면 기본 페이지로 이동
      }
    }
  }, [responseData, navigate]);

  return (
    <div className="flex flex-col justify-center items-center border">
      <div
        className="w-[1900px] h-[950px] bg-cover bg-center"
        style={{
          //  backgroundImage: `url(${bgimage})` 
          backgroundImage: `linear-gradient(to bottom, #3a7bd5, #3a6073)`,
          }}
      ></div>
      <div className="flex w-[1900px] h-[0px] relative">
        <form
          onSubmit={handleSubmit}
          className="fixed top-[150px] left-[775px] w-[350px] h-[400px] flex flex-col justify-start items-center border bg-white bg-opacity-50"

        >
          <div
            className="w-[300px] h-[100px] mt-[50px]"
            style={{
              backgroundImage: `url(${logoimage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain"
            }}
          ></div>

          <div className="relative w-[228px] mt-5">
            <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="아이디 입력"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className="w-full border-b focus:outline-none placeholder:text-gray-400 py-1 pl-10"
            />
          </div>

          <div className="relative w-[228px] mt-3">
            <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full border-b focus:outline-none placeholder:text-gray-400 py-1 pl-10"
            />
          </div>

          <button
            type="submit"
            className="p-1 mt-5 px-[93px] py-[8px] bg-blue-500 text-white rounded"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
