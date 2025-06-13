import React from "react";
import "./Notification.css"; // Import CSS riêng cho thông báo

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification-container-nons ${type}`}>
      <p className="notification-message-nons">{message}</p>
      <div className="notification-actions-nons">
        {type === "success" ? (
          <button className="notification-btn-nons success-btn-nons" onClick={onClose}>
            OK
          </button>
        ) : (
          <>
            <button className="notification-btn-nons retry-btn-nons" onClick={onClose}>
              Thử lại
            </button>
            <button className="notification-btn-nons close-btn-nons" onClick={onClose}>
              Đóng
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;