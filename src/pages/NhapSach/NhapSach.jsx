import React, { useState, useEffect } from "react";
import "./NhapSach.css";
import TableNhapSach from "./TableNhapSach";
import ModalNhapSach from "./ModalNhapSach";
import ModalChiTietNhapSach from "./ModalChiTietNhapSach";
import ModalEditChiTietNhapSach from "./ModalEditChiTietNhapSach";
import Notification from "./Notification";
import phieuNhapSachApi from "../../services/phieuNhapSachApi";
import userApi from "../../services/userApi";

const normalizeDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return "";
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  const [year, month, day] = dateStr.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const NhapSach = () => {
  const [isModalPhieuNhapOpen, setIsModalPhieuNhapOpen] = useState(false);
  const [isModalChiTietOpen, setIsModalChiTietOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    ngayNhap: "",
    MaNguoiNhap: [],
    maPhieuNhap: [],
  });
  const [nguoiNhapOptions, setNguoiNhapOptions] = useState([]);
  const [phieuNhapOptions, setPhieuNhapOptions] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    MaNguoiNhap: [],
    maPhieuNhap: [],
  });
  const [pendingPhieuNhap, setPendingPhieuNhap] = useState(null); // Lưu thông tin phiếu nhập chờ
  const [pendingChiTiet, setPendingChiTiet] = useState([]); // Lưu danh sách chi tiết chờ
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Update fetchData to get user names
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ctNhapSach, phieuNhap, sachData, dauSachData, nguoiNhapData] =
        await Promise.all([
          phieuNhapSachApi.getCTNhapSach(),
          phieuNhapSachApi.getPhieuNhapSach(),
          phieuNhapSachApi.getSach(),
          phieuNhapSachApi.getDauSach(),
          userApi.getUsersByRole("NguoiNhap"), // Get only NguoiNhap users
        ]);

      // Set nguoi nhap options from users with NguoiNhap role
      const uniqueNguoiNhap = nguoiNhapData.map((user) => user.fullName);
      setNguoiNhapOptions(uniqueNguoiNhap);
      setUsers(nguoiNhapData);

      const uniquePhieuNhap = [
        ...new Set(phieuNhap.map((p) => p.MaPhieuNhap)),
      ].filter(Boolean);

      setPhieuNhapOptions(uniquePhieuNhap);

      const formattedData = ctNhapSach
        .map((item) => {
          const pn = phieuNhap.find((p) => p.MaPhieuNhap === item.MaPhieuNhap);
          if (!pn) return null;

          // Find the user who created this phieu nhap
          const nguoiNhap = pn.NguoiNhap
            ? pn.NguoiNhap.trim()
            : "Không xác định";

          const sach = sachData.find((s) => s.MaSach === item.MaSach);
          if (!sach) return null;
          const dauSach = dauSachData.find(
            (ds) => ds.MaDauSach === sach.MaDauSach
          );
          if (!dauSach) return null;
          const tacGia = dauSach.TenTacGia
            ? dauSach.TenTacGia.join(", ")
            : "Không xác định";
          const numericId = item.MaCT_NhapSach.match(/\d+/)?.[0] || "0";
          return {
            maPhieuNhap: item.MaPhieuNhap,
            ngayNhap: pn.NgayNhap || "01/01/1900",
            MaNguoiNhap: nguoiNhap,
            TenNguoiNhap: nguoiNhap,
            maSach: item.MaSach,
            tenSach: sach.TenDauSach || dauSach.TenSach,
            theLoai: dauSach.TenTheLoai || "Không xác định",
            tacGia: tacGia,
            nhaXuatBan: sach.TenNXB || "Không xác định",
            namXuatBan: sach.NamXB,
            giaNhap: item.GiaNhap,
            soLuong: item.SLNhap,
            maCTNhapSach: numericId,
          };
        })
        .filter((item) => item !== null);

      setData(formattedData);
      setFilteredData(formattedData);
      if (formattedData.length === 0) {
        setNotification({
          message: "Không có dữ liệu để hiển thị!",
          type: "info",
        });
      }
    } catch (err) {
      setNotification({
        message: "Lỗi khi tải dữ liệu: " + err.message,
        type: "error",
      });
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching

    if (!query) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const maSach = String(item.maSach || "");
      const tenSach = String(item.tenSach || "");
      const queryLower = query.toLowerCase();

      // Tách query thành các từ riêng lẻ để tìm kiếm
      const searchWords = queryLower
        .split(" ")
        .filter((word) => word.length > 0);
      const tenSachWords = tenSach.toLowerCase().split(" ");

      // Kiểm tra mã sách
      if (maSach.toLowerCase().startsWith(queryLower)) {
        return true;
      }

      // Kiểm tra từng từ trong tên sách
      return searchWords.every((searchWord) =>
        tenSachWords.some((word) => word.startsWith(searchWord))
      );
    });

    setFilteredData(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, checked, value } = e.target;
    setSelectedFilters((prev) => {
      // Only update the current filter type
      if (name === selectedFilterType) {
        const newValues = checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value);
        return { ...prev, [name]: newValues };
      }
      return prev;
    });
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    let filtered = [...data];
    const newFilters = { ...filters };

    if (
      selectedFilterType === "MaNguoiNhap" &&
      selectedFilters.MaNguoiNhap.length > 0
    ) {
      filtered = filtered.filter((item) =>
        selectedFilters.MaNguoiNhap.some(
          (name) => item.TenNguoiNhap.trim() === name.trim()
        )
      );
      newFilters.MaNguoiNhap = selectedFilters.MaNguoiNhap;
    }

    if (
      selectedFilterType === "maPhieuNhap" &&
      selectedFilters.maPhieuNhap.length > 0
    ) {
      filtered = filtered.filter((item) =>
        selectedFilters.maPhieuNhap.includes(item.maPhieuNhap)
      );
      newFilters.maPhieuNhap = selectedFilters.maPhieuNhap;
    }

    if (selectedFilterType === "ngayNhap" && filters.ngayNhap) {
      const filterDate = normalizeDate(filters.ngayNhap);
      filtered = filtered.filter(
        (item) => normalizeDate(item.ngayNhap) === filterDate
      );
      newFilters.ngayNhap = filters.ngayNhap;
    }

    // Apply existing filters that weren't modified
    if (
      selectedFilterType !== "maPhieuNhap" &&
      filters.maPhieuNhap.length > 0
    ) {
      filtered = filtered.filter((item) =>
        filters.maPhieuNhap.includes(item.maPhieuNhap)
      );
    }
    if (
      selectedFilterType !== "MaNguoiNhap" &&
      filters.MaNguoiNhap.length > 0
    ) {
      filtered = filtered.filter((item) =>
        filters.MaNguoiNhap.includes(item.MaNguoiNhap)
      );
    }
    if (selectedFilterType !== "ngayNhap" && filters.ngayNhap) {
      const filterDate = normalizeDate(filters.ngayNhap);
      filtered = filtered.filter(
        (item) => normalizeDate(item.ngayNhap) === filterDate
      );
    }

    if (filtered.length === 0) {
      let activeFilters = [];
      if (newFilters.maPhieuNhap.length > 0)
        activeFilters.push(`mã phiếu ${newFilters.maPhieuNhap.join(", ")}`);
      if (newFilters.MaNguoiNhap.length > 0)
        activeFilters.push(`người nhập ${newFilters.MaNguoiNhap.join(", ")}`);
      if (newFilters.ngayNhap)
        activeFilters.push(`ngày ${newFilters.ngayNhap}`);

      // setNotification({
      //   message: `Không có chi tiết nào khớp với: ${activeFilters.join(
      //     " và "
      //   )}`,
      //   type: "info",
      // });
    }

    setFilteredData(filtered);
    setFilters(newFilters); // Update with new filters while keeping others
    setIsFilterModalOpen(false);
    setSelectedFilters({ MaNguoiNhap: [], maPhieuNhap: [] }); // Only reset current selections
  };

  const resetFilters = () => {
    setCurrentPage(1); // Reset to first page when resetting filters
    // Reset all filters
    setSelectedFilters({ MaNguoiNhap: [], maPhieuNhap: [] });
    setFilters({ ngayNhap: "", MaNguoiNhap: [], maPhieuNhap: [] });
    setFilteredData(data);
    setNotification(null);
    setIsFilterModalOpen(false);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
    setSelectedFilters({ MaNguoiNhap: [], maPhieuNhap: [] }); // Reset selections when closing
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenModalPhieuNhap = () => {
    setIsModalPhieuNhapOpen(true);
  };

  const handleCloseModalPhieuNhap = () => {
    setIsModalPhieuNhapOpen(false);
  };

  const handleCloseModalChiTiet = () => {
    setIsModalChiTietOpen(false);
    setPendingPhieuNhap(null); // Xóa phiếu chờ
    setPendingChiTiet([]); // Xóa chi tiết chờ
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentItem(null);
  };

  const handleSavePhieuNhap = async (formData) => {
    try {
      if (!formData.MaNguoiNhap) {
        throw new Error("Vui lòng điền đầy đủ thông tin!");
      }

      // Get Vietnam time (UTC+7)
      const now = new Date();
      now.setHours(now.getHours() + 7);
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();
      const formattedNgayNhap = `${day}/${month}/${year}`;

      setPendingPhieuNhap({
        NgayNhap: formattedNgayNhap,
        NguoiNhap_input: parseInt(formData.MaNguoiNhap),
      });

      setIsModalPhieuNhapOpen(false);
      setIsModalChiTietOpen(true);
    } catch (err) {
      setNotification({ message: `Lỗi: ${err.message}`, type: "error" });
    }
  };

  const handleAddChiTiet = async (formData, action, resetForm) => {
    try {
      const newChiTiet = {
        maSach: formData.maSach,
        soLuong: parseInt(formData.soLuong),
        giaNhap: parseInt(formData.giaNhap),
      };

      if (action === "finish") {
        const allChiTiet = [...pendingChiTiet];
        if (formData.maSach) {
          allChiTiet.push(newChiTiet);
        }

        try {
          const phieuNhapResponse = await phieuNhapSachApi.addPhieuNhapSach(
            null,
            pendingPhieuNhap
          );
          const maPhieuNhap = phieuNhapResponse.MaPhieuNhap;

          let successCount = 0;
          let errorMessages = [];

          for (let i = 0; i < allChiTiet.length; i++) {
            const chiTiet = allChiTiet[i];
            try {
              await phieuNhapSachApi.addCTNhapSach(
                maPhieuNhap,
                chiTiet.maSach,
                chiTiet.soLuong,
                chiTiet.giaNhap
              );
              successCount++;
            } catch (error) {
              if (error.response?.data) {
                const errorMessage = Object.values(error.response.data)[0][0];
                errorMessages.push(errorMessage);
              }
            }
          }

          if (errorMessages.length > 0) {
            throw new Error(errorMessages[0]);
          }

          await fetchData();

          // Find the first item with the new maPhieuNhap in filteredData
          const firstNewItemIndex = filteredData.findIndex(
            (item) => item.maPhieuNhap === maPhieuNhap
          );

          if (firstNewItemIndex !== -1) {
            const targetPage = Math.floor(firstNewItemIndex / itemsPerPage) + 1;
            setCurrentPage(targetPage);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else {
            console.warn("Could not find new items in filteredData:", {
              maPhieuNhap,
              filteredDataLength: filteredData.length,
              filteredDataSample: filteredData.slice(-5), // Check last 5 items
            });
            // Fallback to the last page if not found
            const lastPage = Math.ceil(filteredData.length / itemsPerPage);
            setCurrentPage(lastPage > 0 ? lastPage : 1);
          }

          setNotification({
            message: `Đã lưu phiếu nhập ${maPhieuNhap} với ${successCount} chi tiết`,
            type: "success",
          });

          setPendingPhieuNhap(null);
          setPendingChiTiet([]);
          setIsModalChiTietOpen(false);
        } catch (error) {
          throw error;
        }
      } else {
        setPendingChiTiet((prev) => [...prev, newChiTiet]);
        resetForm();
        setNotification({
          message: "Đã thêm chi tiết, tiếp tục nhập chi tiết khác",
          type: "success",
        });
      }
    } catch (err) {
      setNotification({
        message: err.message,
        type: "error",
      });
    }
  };
  const handleEditChiTiet = async (formData) => {
    try {
      const soLuong = parseInt(formData.soLuong);
      const giaNhap = parseInt(formData.giaNhap);
      const maCTNhapSach = parseInt(currentItem.maCTNhapSach);

      await phieuNhapSachApi.updateCTNhapSach(
        maCTNhapSach,
        currentItem.maPhieuNhap,
        currentItem.maSach,
        soLuong,
        giaNhap
      );

      setNotification({
        message: "Cập nhật chi tiết nhập sách thành công!",
        type: "success",
      });
      setIsEditModalOpen(false);
      setCurrentItem(null);
      await fetchData();
    } catch (error) {
      // Extract backend error message if available
      if (error.response?.data) {
        const errorMessage = Object.values(error.response.data)[0][0];
        setNotification({
          message: errorMessage,
          type: "error",
        });
      } else {
        // Fallback for non-backend errors
        setNotification({
          message: error.message,
          type: "error",
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Add these constants and pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Ensure currentPage is valid after filtering
  useEffect(() => {
    if (currentPage > Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredData, currentPage]);

  const handleDeletePending = (index) => {
    setPendingChiTiet((prev) => prev.filter((_, i) => i !== index));
    // setNotification({
    //   message: "Đã xóa chi tiết nhập sách",
    //   type: "success",
    // });
  };

  const handleEditPending = (updatedList) => {
    setPendingChiTiet(updatedList); // Cập nhật state trong NhapSach
  };

  // Add this new function to handle removing individual filters
  const handleRemoveFilter = (filterType, value) => {
    let newFilters = { ...filters };
    let filtered = [...data];

    if (filterType === "maPhieuNhap") {
      newFilters.maPhieuNhap = filters.maPhieuNhap.filter((f) => f !== value);
    } else if (filterType === "MaNguoiNhap") {
      newFilters.MaNguoiNhap = filters.MaNguoiNhap.filter((f) => f !== value);
    } else if (filterType === "ngayNhap") {
      newFilters.ngayNhap = "";
    }

    // Apply remaining filters
    if (newFilters.maPhieuNhap.length > 0) {
      filtered = filtered.filter((item) =>
        newFilters.maPhieuNhap.includes(item.maPhieuNhap)
      );
    }

    if (newFilters.MaNguoiNhap.length > 0) {
      filtered = filtered.filter((item) =>
        newFilters.MaNguoiNhap.some(
          (name) => item.TenNguoiNhap.trim() === name.trim()
        )
      );
    }

    if (newFilters.ngayNhap) {
      const filterDate = normalizeDate(newFilters.ngayNhap);
      filtered = filtered.filter(
        (item) => normalizeDate(item.ngayNhap) === filterDate
      );
    }

    setFilters(newFilters);
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  if (loading) return <div className="page-container">Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Nhập sách</h1>
      <div className="content-wrapper">
        <div className="search-filter-block-ns">
          <input
            type="text"
            placeholder="Tìm kiếm sách theo mã hoặc tên sách..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input-ns"
            autoComplete="off"
          />
          <button
            className={`filter-button-ns ${
              filters.maPhieuNhap.length > 0 ? "active-filter-ns" : ""
            }`}
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("maPhieuNhap");
            }}
          >
            Lọc theo Mã phiếu nhập
          </button>
          <button
            className={`filter-button-ns ${
              filters.ngayNhap ? "active-filter-ns" : ""
            }`}
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("ngayNhap");
            }}
          >
            Lọc theo Ngày nhập
          </button>
          <button
            className={`filter-button-ns ${
              filters.MaNguoiNhap.length > 0 ? "active-filter-ns" : ""
            }`}
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("MaNguoiNhap");
            }}
          >
            Lọc theo Người nhập
          </button>
          <button className="add-button-ns" onClick={handleOpenModalPhieuNhap}>
            + Thêm phiếu nhập
          </button>
        </div>
        {(filters.maPhieuNhap.length > 0 ||
          filters.MaNguoiNhap.length > 0 ||
          filters.ngayNhap) && (
          <div className="active-filters-ns">
            {filters.maPhieuNhap.map((filter) => (
              <div key={filter} className="active-filter-tag-ns">
                Mã PNS: {filter}
                <button
                  className="remove-filter-ns"
                  onClick={() => handleRemoveFilter("maPhieuNhap", filter)}
                >
                  ×
                </button>
              </div>
            ))}
            {filters.MaNguoiNhap.map((filter) => (
              <div key={filter} className="active-filter-tag-ns">
                Người nhập: {filter}
                <button
                  className="remove-filter-ns"
                  onClick={() => handleRemoveFilter("MaNguoiNhap", filter)}
                >
                  ×
                </button>
              </div>
            ))}
            {filters.ngayNhap && (
              <div className="active-filter-tag-ns">
                Ngày: {filters.ngayNhap}
                <button
                  className="remove-filter-ns"
                  onClick={() => handleRemoveFilter("ngayNhap")}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
        {filteredData.length === 0 && !loading ? (
          <div
            className="no-results-message"
            style={{ textAlign: "center", padding: "20px" }}
          >
            Không có chi tiết nào khớp với điều kiện lọc
          </div>
        ) : (
          <TableNhapSach
            data={filteredData}
            onEdit={handleEdit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
        {isFilterModalOpen && (
          <div className="modal-overlay-ns">
            <div className="modal-new-ns">
              <h2 className="modal-title-new-ns">
                {selectedFilterType === "maPhieuNhap" &&
                  "Lọc theo Mã phiếu nhập"}
                {selectedFilterType === "MaNguoiNhap" && "Lọc theo Người nhập"}
                {selectedFilterType === "ngayNhap" && "Lọc theo Ngày nhập"}
              </h2>

              {selectedFilterType === "maPhieuNhap" && (
                <div className="author-list-ns">
                  {phieuNhapOptions.map((option) => (
                    <div
                      key={option}
                      className={`author-item-ns ${
                        selectedFilters.maPhieuNhap.includes(option)
                          ? "selected-ns"
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterChange({
                          target: {
                            name: "maPhieuNhap",
                            value: option,
                            checked:
                              !selectedFilters.maPhieuNhap.includes(option),
                          },
                        })
                      }
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}

              {selectedFilterType === "MaNguoiNhap" && (
                <div className="author-list-ns">
                  {nguoiNhapOptions.map((fullName) => (
                    <div
                      key={fullName}
                      className={`author-item-ns ${
                        selectedFilters.MaNguoiNhap.includes(fullName)
                          ? "selected-ns"
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterChange({
                          target: {
                            name: "MaNguoiNhap",
                            value: fullName,
                            checked:
                              !selectedFilters.MaNguoiNhap.includes(fullName),
                          },
                        })
                      }
                    >
                      {fullName}
                    </div>
                  ))}
                </div>
              )}

              {selectedFilterType === "ngayNhap" && (
                <div className="year-filter-inputs-ns">
                  <input
                    type="date"
                    name="ngayNhap"
                    value={filters.ngayNhap}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        ngayNhap: e.target.value,
                      }));
                    }}
                    placeholder="Chọn ngày nhập"
                  />
                </div>
              )}

              <div className="modal-buttons-ns">
                <button className="apply-button-ns" onClick={applyFilters}>
                  Áp dụng
                </button>
                <button className="cancel-button-new-ns" onClick={resetFilters}>
                  Hủy áp dụng
                </button>
                <button
                  className="close-button-new-ns"
                  onClick={closeFilterModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalPhieuNhapOpen && (
        <ModalNhapSach
          isOpen={isModalPhieuNhapOpen}
          onClose={handleCloseModalPhieuNhap}
          onSave={handleSavePhieuNhap}
        />
      )}
      {isModalChiTietOpen && (
        <ModalChiTietNhapSach
          isOpen={isModalChiTietOpen}
          onClose={handleCloseModalChiTiet}
          onSave={handleAddChiTiet}
          pendingChiTiet={pendingChiTiet}
          onDeletePending={handleDeletePending}
          onEditPending={handleEditPending}
        />
      )}
      {isEditModalOpen && (
        <ModalEditChiTietNhapSach
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleEditChiTiet}
          initialData={currentItem}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default NhapSach;
