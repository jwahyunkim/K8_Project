import "./SignUp.css";
import React, { useState, useEffect } from "react";
import { usePost } from "../../../hooks/usePost";
import CustomGrid from "../../Grid/MergeCustomGrid";
import { FaSearch, FaSave, FaTrash } from "react-icons/fa";

function SignUp() {
    // 서버에서 받아온 데이터 (editable 추가)
    const [memberData, setMemberData] = useState([]);
    // 조회 조건 입력 패널 표시 여부
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    // 조회 조건 상태
    const [searchName, setSearchName] = useState("");
    const [searchBRN, setSearchBRN] = useState("");

    // 회원가입용 폼 데이터
    const [formData, setFormData] = useState({
        name: "",
        brn: "",
        userId: "",
        password: "",
        confirmPassword: "",
        postalCode: "",
        address: "",
        detailAddress: "",
        contact: "",
        emailLocal: "",
        emailDomain: ""
    });

    const { responseData, isPosting, postError, postData } = usePost();

    // 전체 회원 조회 (GET 요청)
    const handleFetchMembers = async () => {
        try {
            const response = await fetch("http://localhost:8080/members");
            if (response.ok) {
                const data = await response.json();
                // role이 "vendor"인 회원만 필터링
                const filteredData = data
                    .filter((item) => item.role === "vendor")
                    .map((item) => ({ ...item, editable: false }));
                setMemberData(filteredData);
            } else {
                console.error("회원 조회 실패");
            }
        } catch (error) {
            console.error("회원 조회 에러", error);
        }
    };

    // 컴포넌트 마운트 시 전체 회원 조회
    useEffect(() => {
        handleFetchMembers();
    }, []);

    // 조회 조건에 따른 검색 (GET 요청 후 클라이언트 필터링)
    const handleSearch = async () => {
        try {
            const response = await fetch("http://localhost:8080/members");
            if (response.ok) {
                const data = await response.json();
                // role이 "vendor"인 회원만 필터링
                let filteredData = data.filter((item) => item.role === "vendor");
                if (searchName) {
                    filteredData = filteredData.filter((item) =>
                        item.name.includes(searchName)
                    );
                }
                if (searchBRN) {
                    filteredData = filteredData.filter((item) =>
                        item.brn.includes(searchBRN)
                    );
                }
                filteredData = filteredData.map((item) => ({ ...item, editable: false }));
                setMemberData(filteredData);
            } else {
                console.error("조회 실패");
            }
        } catch (error) {
            console.error("조회 에러", error);
        }
    };

    // 체크된 행 수정 (PUT 요청)
    const handleSave = async () => {
        for (let i = 0; i < memberData.length; i++) {
            const member = memberData[i];
            if (member.editable) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/members/${member.userId}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(member),
                        }
                    );
                    if (!response.ok) {
                        console.error(`회원 ${member.userId} 수정 실패`);
                    } else {
                        console.log(`회원 ${member.userId} 수정 성공`);
                        alert("저장되었습니다.");
                        toggleEditable(i, false);
                    }
                } catch (error) {
                    console.error(`회원 ${member.userId} 수정 에러`, error);
                }
            }
        }
    };

    // 삭제 버튼 눌렀을 때 체크된 행 삭제 (DELETE 요청)
    const handleDelete = async () => {
        let anyDeleted = false;
        for (let i = 0; i < memberData.length; i++) {
            const member = memberData[i];
            if (member.editable) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/members/${member.userId}`,
                        { method: "DELETE" }
                    );
                    if (!response.ok) {
                        console.error(`회원 ${member.userId} 삭제 실패`);
                    } else {
                        console.log(`회원 ${member.userId} 삭제 성공`);
                        anyDeleted = true;
                    }
                } catch (error) {
                    console.error(`회원 ${member.userId} 삭제 에러`, error);
                }
            }
        }
        if (anyDeleted) {
            await handleFetchMembers();
            alert("삭제되었습니다.");
        }
    };

    // 체크박스 토글: 해당 행의 editable 상태 변경
    const toggleEditable = (index, value) => {
        const newData = [...memberData];
        newData[index].editable = value;
        setMemberData(newData);
    };

    // 해당 행의 데이터 변경 (input 변경)
    const handleMemberDataChange = (index, key, newValue) => {
        const newData = [...memberData];
        newData[index][key] = newValue;
        setMemberData(newData);
    };

    // 회원가입 제출 (POST 요청)
    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const field of labels) {
            if (field.required && !formData[field.key]) {
                alert(`${field.label}은(는) 필수 입력값입니다.`);
                return;
            }
        }
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        const emailAddress =
            formData.emailLocal && formData.emailDomain
                ? `${formData.emailLocal}@${formData.emailDomain}`
                : "";
        const url = "http://localhost:8080/members";
        const dataToSend = {
            ...formData,
            emailAddress,
            confirmPassword: undefined,
            emailLocal: undefined,
            emailDomain: undefined,
        };
        console.log("실제 전송 데이터:", dataToSend);
        await postData(url, dataToSend);
        if (postError) {
            console.error("POST 요청 에러:", postError);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // CustomGrid에 들어갈 헤더와 데이터 매핑 (체크박스 열 추가)
    const labels = [
        { label: "", key: "index", required: false },
        { label: "업체명", key: "name", required: false },
        { label: "사업자번호", key: "brn", required: false },
        { label: "아이디", key: "userId", required: false },
        { label: "우편번호", key: "postalCode", required: false },
        { label: "주소", key: "address", required: false },
        { label: "상세주소", key: "detailAddress", required: false },
        { label: "연락처", key: "contact", required: false },
        { label: "이메일", key: "emailAddress", required: false },
        { label: "선택", key: "select", required: false },
    ];

    const totalRows = memberData.length + 1;

    const colSizes = {
        0: "50px",
        1: "100px",
        2: "230px",
        3: "230px",
        4: "100px",
        5: "150px",
        6: "200px",
        7: "140px",
        8: "200px",
        9: "50px",
    };

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto p-4 ml-0 mr-0">
            <div className="fixed left-[426px] top-[0px] flex flex-col justify-center items-start w-[1450px] rounded-md m-4 ">
                <div className="w-auto p-0 rounded-tr-2xl">
                    <h1 className="text-2xl font-bold my-4 ">업체조회</h1>
                    <hr className="w-[1450px] border-t-2 border-black mb-4" />
                </div>
                <div className="w-full bg-[#434a4f] text-white py-1 flex justify-start space-x-4">
                    {/* 조회 버튼 - 검색 조건 패널 토글 */}
                    <button
                        className="flex items-center space-x-2 hover:bg-gray-600 px-4 py-2 rounded"
                        onClick={() => setShowSearchPanel(!showSearchPanel)}
                    >
                        <FaSearch className="w-5 h-5" />
                        <span>조회</span>
                    </button>
                    {/* 저장 버튼 */}
                    <button
                        className="flex items-center space-x-2 hover:bg-gray-600 px-4 py-2 rounded"
                        onClick={handleSave}
                    >
                        <FaSave className="w-5 h-5" />
                        <span>저장</span>
                    </button>
                    {/* 삭제 버튼 */}
                    <button
                        className="flex items-center space-x-2 hover:bg-red-600 px-4 py-2 rounded"
                        onClick={handleDelete}
                    >
                        <FaTrash className="w-5 h-5" />
                        <span>삭제</span>
                    </button>
                </div>
                {/* 조회 조건 입력 패널 */}
                {showSearchPanel && (
                    <div className="w-full bg-[#f0f0f0] p-4 mb-0">
                        <div className="flex items-center space-x-4">
                            <label className="text-black">업체명:</label>
                            <input
                                type="text"
                                placeholder="업체명"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                            <label className="text-black">사업자번호:</label>
                            <input
                                type="text"
                                placeholder="사업자번호"
                                value={searchBRN}
                                onChange={(e) => setSearchBRN(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                조회
                            </button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col items-center ">
                    <div className="flex items-start w-auto h-[805px] overflow-auto ">
                        <CustomGrid
                            rows={totalRows}
                            cols={labels.length}
                            defaultRowSize="32px"
                            colSizes={colSizes}
                            cellContent={(rowIndex, colIndex) => {
                                // 헤더 행
                                if (rowIndex === 0) {
                                    return (
                                        <span>
                                            {labels[colIndex].required && (
                                                <span className="text-red-500">*</span>
                                            )}
                                            {labels[colIndex].label}
                                        </span>
                                    );
                                }
                                // 데이터 행 (배열 인덱스 = rowIndex - 1)
                                const member = memberData[rowIndex - 1];
                                const key = labels[colIndex].key;
                                if (key === "index") {
                                    return <span>{rowIndex}</span>;
                                }
                                // 체크박스 열
                                if (key === "select") {
                                    return (
                                        <input
                                            type="checkbox"
                                            checked={member.editable}
                                            onChange={(e) =>
                                                toggleEditable(rowIndex - 1, e.target.checked)
                                            }
                                        />
                                    );
                                }
                                // 수정 가능하면 input, 아니면 텍스트 표시
                                if (member.editable) {
                                    // 현재 열의 width에서 좌우 패딩(4px씩, 총 8px)을 제외한 크기로 설정
                                    const colWidth = colSizes[colIndex];
                                    return (
                                        <input
                                            type="text"
                                            value={member[key]}
                                            style={{
                                                width: `calc(${colWidth} - 8px)`,
                                                textAlign: "center"
                                            }}
                                            onChange={(e) =>
                                                handleMemberDataChange(rowIndex - 1, key, e.target.value)
                                            }
                                        />
                                    );
                                }
                                return <span>{member[key]}</span>;
                            }}
                            cellStyle={(rowIndex, colIndex) => {
                                if (rowIndex === 0) {
                                    return { fontWeight: "bold", backgroundColor: "#e5e7eb", position: "sticky", top: 0 };
                                }
                                return { backgroundColor: "#F5F5F5" };
                            }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
