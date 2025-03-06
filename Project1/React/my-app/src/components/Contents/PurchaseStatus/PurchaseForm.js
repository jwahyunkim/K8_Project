import { useState } from "react";

const PurchaseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    supplier: "",
    items: [{ name: "", quantity: 0, price: 0 }],
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "supplier") {
      setFormData({ ...formData, supplier: value });
    } else {
      const updatedItems = [...formData.items];
      updatedItems[index][name] = value;
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { name: "", quantity: 0, price: 0 }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <label>매입처:</label>
      <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="border p-2" />

      {formData.items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input type="text" name="name" placeholder="품목" value={item.name} onChange={(e) => handleChange(e, index)} />
          <input type="number" name="quantity" placeholder="수량" value={item.quantity} onChange={(e) => handleChange(e, index)} />
          <input type="number" name="price" placeholder="단가" value={item.price} onChange={(e) => handleChange(e, index)} />
        </div>
      ))}

      <button type="button" onClick={addItem}>품목 추가</button>
      <button type="submit">발행하기</button>
    </form>
  );
};

export default PurchaseForm;
