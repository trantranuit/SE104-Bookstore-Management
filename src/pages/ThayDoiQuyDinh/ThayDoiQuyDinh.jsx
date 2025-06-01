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

  const getGiaTriForKey = useCallback((item, key) => {
    const values = {
      SLNhapTT: item.SLNhapTT,
      TonTD: item.TonTD,
      NoTD: parseFloat(item.NoTD).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      TonTT: item.TonTT,
      TiLe: `${(parseFloat(item.TiLe) * 100).toFixed(2)}%`,
      SDQD4: item.SDQD4 ? "Đúng" : "Sai",
    };
    return values[key] || "Không xác định";
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
        SDQD4: {
          tenQuyDinh: "Số tiền thu không vượt quá nợ",
          thamSo: "Điều kiện thu tiền",
        },
      };

      return Object.keys(rules).map((key) => ({
        id: item.id,
        tenQuyDinh: rules[key].tenQuyDinh,
        thamSo: rules[key].thamSo,
        giaTri: getGiaTriForKey(item, key),
        key: key,
        [key]: item[key],
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
        setNotification({
          message: "Dữ liệu đã được tải thành công!",
          type: "success",
        });
      } catch (err) {
        console.error("Lỗi chi tiết:", err.message);
        setNotification({
          message: `Lỗi khi tải dữ liệu: ${
            err.message.includes("404")
              ? "Không tìm thấy API. Vui lòng kiểm tra endpoint!"
              : err.message.includes("401") || err.message.includes("token")
              ? "Vui lòng đăng nhập hoặc kiểm tra token!"
              : err.message
          }`,
          type: "error",
        });
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

  const handleSave = async (formData) => {
    try {
      const updatedItem = {
        id: currentItem.id,
        SLNhapTT: formData.SLNhapTT ?? currentItem.SLNhapTT,
        TonTD: formData.TonTD ?? currentItem.TonTD,
        NoTD: formData.NoTD ?? currentItem.NoTD,
        TonTT: formData.TonTT ?? currentItem.TonTT,
        TiLe: formData.TiLe ?? currentItem.TiLe,
        SDQD4:
          formData.SDQD4 !== undefined ? formData.SDQD4 : currentItem.SDQD4,
      };

      await thamSoApi.updateThamSo(currentItem.id, updatedItem);

      const response = await thamSoApi.getThamSo();
      const formattedData = formatApiData(response[0]);
      setData(formattedData);
      setNotification({
        message: "Cập nhật quy định thành công!",
        type: "success",
      });
    } catch (err) {
      console.error("Lỗi chi tiết khi cập nhật:", err.message);
      setNotification({
        message: `Lỗi khi cập nhật quy định: ${
          err.message.includes("401")
            ? "Vui lòng đăng nhập hoặc kiểm tra token!"
            : err.message
        }`,
        type: "error",
      });
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Thay đổi quy định</h1>
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
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
      </div>
    </div>
  );
};

export default ThayDoiQuyDinh;
