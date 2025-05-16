import React from "react";

const TableQuyDinh = ({ data, onEdit }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên quy định</th>
          <th>Tham số</th>
          <th>Tình trạng sử dụng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{item.isActive ? "Đang áp dụng" : "Không áp dụng"}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(item)}>
                ✏️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableQuyDinh;
