import React, { useState } from "react";
import TableQuyDinh from "./TableQuyDinh";
import ModalEdit from "./ModalEdit";
import QuyDinhData from "./QuyDinhData"; // Import dữ liệu ban đầu

const QuyDinh = () => {
  const [data, setData] = useState(QuyDinhData); // Sử dụng dữ liệu từ QuyDinhData
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Quy định đang chỉnh sửa

  // Mở modal để thêm quy định
  const handleOpenModal = () => {
    setCurrentItem(null); // Không có dữ liệu để chỉnh sửa
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Lưu quy định (thêm mới hoặc chỉnh sửa)
  const handleSave = (formData) => {
    if (currentItem) {
      // Chỉnh sửa quy định
      const updatedData = data.map((item) =>
        item.id === formData.id ? { ...item, ...formData } : item
      );
      setData(updatedData);
    } else {
      // Thêm quy định mới
      setData([...data, { ...formData, id: Date.now() }]); // Tạo ID duy nhất
    }
    setIsModalOpen(false);
  };

  // Xóa quy định
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quy định này?")) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    }
  };

  // Mở modal để chỉnh sửa quy định
  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <h1>Quản lý quy định</h1>
      <button className="add-button" onClick={handleOpenModal}>
        Thêm quy định
      </button>
      <TableQuyDinh data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {isModalOpen && (
        <ModalEdit
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={currentItem}
        />
      )}
    </div>
  );
};

export default QuyDinh;
