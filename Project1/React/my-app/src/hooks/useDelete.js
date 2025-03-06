import { useState } from "react";
import axios from "axios";

export const useDelete = () => {
  const [deletedData, setDeletedData] = useState(null); // data를 deletedData로 변경
  const [isDeleting, setIsDeleting] = useState(false); // loading을 isDeleting으로 변경
  const [deleteError, setDeleteError] = useState(null); // error를 deleteError로 변경

  const deleteData = async (url) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await axios.delete(url);
      setDeletedData(response.data);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deletedData, isDeleting, deleteError, deleteData };
};
