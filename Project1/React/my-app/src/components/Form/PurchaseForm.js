import React, { useState } from "react";
import jsPDF from "jspdf";

const PurchaseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    buyer: "",
    seller: "",
    item: "",
    weight: "",
    pricePerKg: "",
    totalPrice: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // 부모 컴포넌트로 데이터 전달
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">구매자</label>
        <input
          type="text"
          name="buyer"
          value={formData.buyer}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">판매자</label>
        <input
          type="text"
          name="seller"
          value={formData.seller}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">품목</label>
        <input
          type="text"
          name="item"
          value={formData.item}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">중량 (kg)</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">단가 (원/kg)</label>
        <input
          type="number"
          name="pricePerKg"
          value={formData.pricePerKg}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">총금액 (원)</label>
        <input
          type="number"
          name="totalPrice"
          value={formData.totalPrice}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">날짜</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        매입확인서 작성
      </button>
    </form>
  );
};

const PurchaseConfirmation = () => {
  const handleGeneratePDF = (formData) => {
    const doc = new jsPDF();
    doc.text("매입확인서", 20, 20);
    doc.text(`구매자: ${formData.buyer}`, 20, 30);
    doc.text(`판매자: ${formData.seller}`, 20, 40);
    doc.text(`품목: ${formData.item}`, 20, 50);
    doc.text(`중량: ${formData.weight}kg`, 20, 60);
    doc.text(`단가: ${formData.pricePerKg}원/kg`, 20, 70);
    doc.text(`총금액: ${formData.totalPrice}원`, 20, 80);
    doc.text(`날짜: ${formData.date}`, 20, 90);
    doc.save("매입확인서.pdf");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">매입확인서</h1>
      <PurchaseForm onSubmit={handleGeneratePDF} />
    </div>
  );
};

export default PurchaseConfirmation;
