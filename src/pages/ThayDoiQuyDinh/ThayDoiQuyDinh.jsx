import React, { useState, useEffect, useCallback } from "react";
import TableQuyDinh from "./TableQuyDinh";
import ModalEdit from "./ModalEdit";
import thamSoApi from "../../services/thamSoApi";

const ThayDoiQuyDinh = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const getGiaTriForKey = useCallback((item, key) => {
    const values = {
      SLNhapTT: item.SLNhapTT,
      TonTD: item.TonTD,
      NoTD: item.NoTD,
      TonTT: item.TonTT,
      TiLe: item.TiLe,
      SDQD4: item.SDQD4 ? "Đúng" : "Sai",
    };
    return values[key] ?? "Không xác định";
  }, []);

  const formatApiData = useCallback(
    (item) => {
      const rules = {
        SLNhapTT: {
          tenQuyDinh: "Số lượng nhập tối thiểu",
          thamSo: "Số lượng sách",
        },
        TonTD: {
          tenQuyDinh: "Số lượng tồn tối đa để nhập",
          thamSo: "Số lượng tồn",
        },
        NoTD: { tenQuyDinh: "Nợ tối đa của khách hàng", thamSo: "Số tiền nợ" },
        TonTT: {
          tenQuyDinh: "Số lượng tồn tối thiểu sau khi bán",
          thamSo: "Số lượng tồn",
        },
        TiLe: { tenQuyDinh: "Tỷ lệ đơn giá bán", thamSo: "Tỷ lệ (%)" },
        // SDQD4: {
        //   tenQuyDinh: "Số tiền thu không vượt quá nợ",
        //   thamSo: "Điều kiện thu tiền",
        // },
      };

      return Object.keys(rules).map((key) => ({
        tenQuyDinh: rules[key].tenQuyDinh,
        thamSo: rules[key].thamSo,
        giaTri: getGiaTriForKey(item, key),
        key: key,
        [key]: item[key],
        mota: rules[key].tenQuyDinh, // Use tenQuyDinh as description instead of ID
      }));
    },
    [getGiaTriForKey]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await thamSoApi.getThamSo();
        console.log("API Response:", response);

        if (!response || response.length === 0) {
          throw new Error("Không có dữ liệu từ API.");
        }

        const formattedData = formatApiData(response[0]);
        console.log("Formatted Data:", formattedData);
        setData(formattedData);
        // showNotification("Dữ liệu đã được tải thành công!", "success");
      } catch (err) {
        console.error("Lỗi chi tiết:", err.message);
        showNotification(
          `Lỗi khi tải dữ liệu: ${
            err.message.includes("404")
              ? "Không tìm thấy API. Vui lòng kiểm tra endpoint!"
              : err.message.includes("401") || err.message.includes("token")
              ? "Vui lòng đăng nhập hoặc kiểm tra token!"
              : err.message
          }`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formatApiData]);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const validateFormData = (formData, fieldKey) => {
    switch (fieldKey) {
      case "SLNhapTT":
        const slValue = Number(formData.SLNhapTT);
        if (isNaN(slValue) || slValue < 0) {
          return "Số lượng nhập tối thiểu phải là số dương";
        }
        break;
      case "TonTD":
        const tdValue = Number(formData.TonTD);
        if (isNaN(tdValue) || tdValue < 0) {
          return "Số lượng tồn tối đa phải là số dương";
        }
        break;
      case "NoTD":
        const noValue = Number(formData.NoTD);
        if (isNaN(noValue) || noValue < 0) {
          return "Số tiền nợ tối đa phải là số dương";
        }
        break;
      case "TonTT":
        const ttValue = Number(formData.TonTT);
        if (isNaN(ttValue) || ttValue < 0) {
          return "Số lượng tồn tối thiểu phải là số dương";
        }
        break;
      case "TiLe":
        const tiLeValue = Number(formData.TiLe);
        if (isNaN(tiLeValue) || tiLeValue <= 0 || tiLeValue > 100) {
          return "Tỷ lệ phải là số dương và không được vượt quá 100%";
        }
        break;
      case "SDQD4":
        return null; // No validation needed for boolean
      default:
        console.warn(`No validation defined for field: ${fieldKey}`);
        return null;
    }
  };

  const handleSave = async (formData) => {
    try {
      const fieldKey = currentItem.key;
      const validationError = validateFormData(formData, fieldKey);

      if (validationError) {
        setNotification({
          message: `Lỗi: ${validationError}`,
          type: "error",
        });
        return;
      }

      const currentSettings = await thamSoApi.getThamSo();
      const updatedItem = { ...currentSettings[0] };

      // Only update the specific field being modified
      if (fieldKey !== "SDQD4") {
        updatedItem[fieldKey] = formData[fieldKey];
      } else {
        updatedItem.SDQD4 = Boolean(formData.SDQD4);
      }

      await thamSoApi.updateThamSo(updatedItem.id, updatedItem);

      const response = await thamSoApi.getThamSo();
      const formattedData = formatApiData(response[0]);
      setData(formattedData);
      showNotification("Cập nhật quy định thành công!", "success");
    } catch (err) {
      console.error("Lỗi chi tiết khi cập nhật:", err);
      showNotification(
        `Lỗi khi cập nhật quy định: ${
          err.response?.status === 400
            ? "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các giá trị nhập vào!"
            : err.response?.status === 401
            ? "Vui lòng đăng nhập hoặc kiểm tra token!"
            : err.message
        }`,
        "error"
      );
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setShowNotificationModal(true);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Thay đổi quy định</h1>

      <div className="content-wrapper">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : data.length === 0 ? (
          <p>Không có dữ liệu để hiển thị.</p>
        ) : (
          <TableQuyDinh data={data} onEdit={handleEdit} />
        )}
        {isModalOpen && currentItem && (
          <ModalEdit
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
            initialData={currentItem}
          />
        )}
        {showNotificationModal && (
          <div className="modal-overlay-tdqd">
            <div className="notification-modal-tdqd">
              <div className={`notification-content-tdqd ${notification.type}`}>
                <p>{notification.message}</p>
                <button
                  className="close-notification-btn-tdqd"
                  onClick={() => setShowNotificationModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThayDoiQuyDinh;
