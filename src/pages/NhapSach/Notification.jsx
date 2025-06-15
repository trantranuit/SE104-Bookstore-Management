import React from "react";
import "./Notification.css"; // Import CSS riêng cho thông báo

const Notification = ({ message, type, onClose }) => {
  return (
    <div className="notification-container-nons">
      <div className="notification-icon-nons">
      <div className="notification-content-nons">
      <p className="notification-message-nons">{message}</p>
      <div className="notification-actions-nons">
        {type === "success" ? (
          <button className="notification-btn-nons close-btn-nons" onClick={onClose}>
            Đóng
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
      </div>
    </div>
  );
};

export default Notification;