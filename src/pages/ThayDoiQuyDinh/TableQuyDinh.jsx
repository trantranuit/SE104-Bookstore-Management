import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./ThayDoiQuyDinh.css"; // Assuming you have a CSS file for styling

const TableQuyDinh = ({ data, onEdit }) => {
  // Add units mapping
  const getUnit = (index) => {
    switch (index) {
      case 0:
        return "quyển";
      case 1:
        return "quyển";
      case 2:
        return "VNĐ";
      case 3:
        return "quyển";
      case 4:
        return "%";
      // case 5:
      //   return "";
      default:
        return "";
    }
  };

  // Add value display formatter
  const getDisplayValue = (item, index) => {
    if (index === 5) {
      return item.giaTri === "Đúng" ? "Có" : "Không";
    }
    return item.giaTri;
  };

  return (
    <div className="table-container-tdqd">
      <table className="table-tdqd">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tên quy định</th>
            <th>Tham số</th>
            <th>Đơn vị</th>
            <th>Giá trị</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`${item.id}-${index}`}>
              <td>{index + 1}</td>
              <td>{item.tenQuyDinh}</td>
              <td>{item.thamSo}</td>
              <td>{getUnit(index)}</td>
              <td>{getDisplayValue(item, index)}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="edit-btn-tdqd"
                  style={{ cursor: "pointer" }}
                  onClick={() => onEdit(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableQuyDinh;
