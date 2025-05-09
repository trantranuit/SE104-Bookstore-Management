import React, { useState, useEffect } from "react";
import "./NhapSach.css";
import TableNhapSach from "./TableNhapSach";
import ModalNhapSach from "./ModalNhapSach";
import Notification from "./Notification";
import NhapSachData from "./NhapSachData"; // Import the data file

const NhapSach = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState(NhapSachData); // Initialize with the imported data

  const handleEdit = (item) => {
    console.log("Item to edit:", item);
    setCurrentItem(item); // Truyền trực tiếp item không cần format
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (formData) => {
    console.log("Handling save with formData:", formData);

    if (currentItem) {
      // Cập nhật dữ liệu hiện có
      const updatedData = data.map((item) =>
        item.maNhap === formData.maNhap ? { ...item, ...formData } : item
      );

      console.log("Updated data array:", updatedData);

      setData(updatedData);
      setNotification({
        message: "Cập nhật phiếu nhập thành công!",
        type: "success",
      });
    } else {
      // Thêm phiếu nhập mới
      setData([...data, formData]);
      setNotification({
        message: "Thêm phiếu nhập thành công!",
        type: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Add useEffect to verify data updates
  useEffect(() => {
    console.log("Data state updated:", data);
  }, [data]);

  const handleDelete = (maNhap) => {
    console.log("Deleting item with maNhap:", maNhap);
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu nhập này?")) {
      const updatedData = data.filter((item) => item.maNhap !== maNhap);
      console.log("Updated data after delete:", updatedData);
      setData(updatedData);
      setNotification({
        message: "Xóa phiếu nhập sách thành công",
        type: "success",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="page-container">
      <h1>Nhập sách</h1>
      <div className="content-wrapper">
        <div className="table-container">
          <button className="add-button" onClick={handleOpenModal}>
            Thêm phiếu nhập
          </button>
          <TableNhapSach
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {isModalOpen && (
        <ModalNhapSach
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={currentItem}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default NhapSach;
