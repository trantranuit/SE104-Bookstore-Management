import React from "react";
import "./Notification.css"; // Import CSS riêng cho thông báo

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification-container ${type}`}>
      <p className="notification-message">{message}</p>
      <div className="notification-actions">
        {type === "success" ? (
          <button className="notification-btn success-btn" onClick={onClose}>
            OK
          </button>
        ) : (
          <>
            <button className="notification-btn retry-btn" onClick={onClose}>
              Thử lại
            </button>
            <button className="notification-btn close-btn" onClick={onClose}>
              Đóng
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;