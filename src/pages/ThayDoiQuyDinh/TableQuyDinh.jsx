import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

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
              <FontAwesomeIcon
                icon={faEdit}
                className="edit-btn"
                style={{ cursor: "pointer" }}
                onClick={() => onEdit(item)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableQuyDinh;
