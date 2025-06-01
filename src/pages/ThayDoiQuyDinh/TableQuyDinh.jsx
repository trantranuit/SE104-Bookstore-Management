import React from "react";

const TableQuyDinh = ({ data, onEdit }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Tên quy định</th>
          <th>Tham số</th>
          <th>Giá trị</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={`${item.id}-${index}`}>
            <td>{item.tenQuyDinh}</td>
            <td>{item.thamSo}</td>
            <td>{item.giaTri}</td>
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
