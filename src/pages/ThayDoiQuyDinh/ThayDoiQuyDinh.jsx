import React, { useState } from "react";
import TableQuyDinh from "./TableQuyDinh";
import ModalEdit from "./ModalEdit";
import QuyDinhData from "./QuyDinhData";

const ThayDoiQuyDinh = () => {
  const [data, setData] = useState(QuyDinhData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleEdit = (item) => {
    console.log("Editing item:", item); // Debug log
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    const updatedData = data.map((item) =>
      item.id === formData.id ? formData : item
    );
    setData(updatedData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Quản lý quy định</h1>
      <div className="content-wrapper">
        <TableQuyDinh data={data} onEdit={handleEdit} />
        {isModalOpen && currentItem && (
          <ModalEdit
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
            initialData={currentItem}
          />
        )}
      </div>
    </div>
  );
};

export default ThayDoiQuyDinh;
