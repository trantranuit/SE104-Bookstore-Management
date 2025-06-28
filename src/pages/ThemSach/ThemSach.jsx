import React, { useState, useEffect, useRef } from "react";
import "../../styles/PathStyles.css";
import "./ThemSach.css";
import themSachApi from "../../services/themSachApi";

function ThemSach() {
  const [, setStep] = useState(1);
  const [maSachMoi, setMaSachMoi] = useState("");
  const [tenSach, setTenSach] = useState("");
  const [tenTacGia, setTenTacGia] = useState([]); // Array of selected author objects { MaTG, TenTG }
  const [theLoai, setTheLoai] = useState([]); // Array of selected genre objects { MaTheLoai, TenTheLoai }
  const [maDauSach, setMaDauSach] = useState("");
  const [showCreateDauSach, setShowCreateDauSach] = useState(false);
  const [message, setMessage] = useState("");
  const [nhaXuatBan, setNhaXuatBan] = useState("");
  const [namXuatBan, setNamXuatBan] = useState("");
  const [showBookForm, setShowBookForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfirmExistingBook, setShowConfirmExistingBook] = useState(false);
  const [showBookExistsError, setShowBookExistsError] = useState(false);
  const [showAddBookSuccess, setShowAddBookSuccess] = useState(false);
  const [existingDauSachData, setExistingDauSachData] = useState(null);

  // Danh sách tác giả và thể loại
  const [allTacGia, setAllTacGia] = useState([]); // Array of all author objects
  const [allTheLoai, setAllTheLoai] = useState([]);
  const [newTacGia, setNewTacGia] = useState("");
  const [newTheLoai, setNewTheLoai] = useState("");
  const [showTacGiaDropdown, setShowTacGiaDropdown] = useState(false);
  const [showTheLoaiDropdown, setShowTheLoaiDropdown] = useState(false);

  // Danh sách nhà xuất bản
  const [allNXB, setAllNXB] = useState([]);
  const [selectedNXB, setSelectedNXB] = useState([]);
  const [newNXB, setNewNXB] = useState("");
  const [showNXBDropdown, setShowNXBDropdown] = useState(false);
  const [showAddNXBInput, setShowAddNXBInput] = useState(false);
  const [showConfirmAddPublisher, setShowConfirmAddPublisher] = useState(false);
  const [showAddTacGiaInput, setShowAddTacGiaInput] = useState(false);
  const [showConfirmAddAuthor, setShowConfirmAddAuthor] = useState(false);
  const [showAddTheLoaiInput, setShowAddTheLoaiInput] = useState(false);
  const [showConfirmAddGenre, setShowConfirmAddGenre] = useState(false);

  // State cho sửa đầu sách/sách
  const [editDauSach, setEditDauSach] = useState({
    maDauSach: "",
    tenSach: "",
    selectedAuthors: [],
    selectedGenres: [],
    nhaXuatBan: "",
    namXuatBan: "",
    maSach: "",
    selectedNXB: [],
  });
  const [showEditDauSach, setShowEditDauSach] = useState(false);
  const [dauSachSearchTerm, setDauSachSearchTerm] = useState("");
  const [isEditingBook, setIsEditingBook] = useState(false);

  // State cho quản lý thể loại
  const [showGenreList, setShowGenreList] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [editGenreName, setEditGenreName] = useState("");
  const [showGenreDeleteConfirm, setShowGenreDeleteConfirm] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);

  // State for authors list management
  const [showAuthorList, setShowAuthorList] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editAuthorName, setEditAuthorName] = useState("");
  const [showAuthorDeleteConfirm, setShowAuthorDeleteConfirm] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  // State for publishers list management
  const [showPublisherList, setShowPublisherList] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [editPublisherName, setEditPublisherName] = useState("");
  const [showPublisherDeleteConfirm, setShowPublisherDeleteConfirm] =
    useState(false);
  const [publisherToDelete, setPublisherToDelete] = useState(null);

  // Thêm tác giả mới
  const handleAddAuthorSuccess = async (newAuthorName) => {
    try {
      const newAuthor = await themSachApi.addAuthor(newAuthorName);
      setAllTacGia([...allTacGia, newAuthor]);
      setTenTacGia([...tenTacGia, newAuthor]);
      setNewTacGia("");
      setShowConfirmAddAuthor(false);
      setShowAddTacGiaInput(false);
      setMessage("Đã thêm tác giả thành công!");
      setShowTacGiaDropdown(true);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding author:", error);
      setMessage(
        "Có lỗi khi thêm tác giả: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Lấy mã sách mới tự động và danh sách tác giả/thể loại
  useEffect(() => {
    async function fetchInit() {
      try {
        const nextBookId = await themSachApi.getNextBookId();
        setMaSachMoi(nextBookId);

        const authors = await themSachApi.getAllAuthors();
        if (Array.isArray(authors)) setAllTacGia(authors);
        else {
          setAllTacGia([]);
          console.error("Authors data is not an array:", authors);
        }

        const genres = await themSachApi.getAllGenres();
        if (Array.isArray(genres)) setAllTheLoai(genres);
        else {
          setAllTheLoai([]);
          console.error("Genres data is not an array:", genres);
        }

        const publishers = await themSachApi.getAllPublishers();
        if (Array.isArray(publishers)) setAllNXB(publishers);
        else {
          setAllNXB([]);
          console.error("Publishers data is not an array:", publishers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage(
          "Có lỗi khi tải dữ liệu: " + (error.message || "Không xác định")
        );
      }
    }
    fetchInit();
  }, []);

  // Thêm thể loại mới
  const handleAddGenreSuccess = async (newGenreName) => {
    try {
      const newGenre = await themSachApi.addGenre(newGenreName);
      setAllTheLoai([...allTheLoai, newGenre]);
      setTheLoai([newGenre]);
      setNewTheLoai("");
      setShowConfirmAddGenre(false);
      setShowAddTheLoaiInput(false);
      setMessage(`Đã thêm thể loại "${newGenre.TenTheLoai}" thành công!`);
      setShowTheLoaiDropdown(true);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding genre:", error);
      setMessage(
        "Có lỗi khi thêm thể loại: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Thêm nhà xuất bản mới
  const handleAddPublisherSuccess = async (newPublisherName) => {
    try {
      const newPublisher = await themSachApi.addPublisher(newPublisherName);
      setAllNXB([...allNXB, newPublisher]);
      setSelectedNXB([newPublisher]);
      setNewNXB("");
      setShowConfirmAddPublisher(false);
      setShowAddNXBInput(false);
      setMessage(`Đã thêm nhà xuất bản "${newPublisher.TenNXB}" thành công!`);
      setShowNXBDropdown(true);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding publisher:", error);
      setMessage(
        "Có lỗi khi thêm nhà xuất bản: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Xử lý gửi form thêm sách
  const handleSubmit = async () => {
    if (
      !tenSach ||
      tenTacGia.length === 0 ||
      theLoai.length === 0 ||
      !nhaXuatBan ||
      !namXuatBan
    ) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const namXB = parseInt(namXuatBan);
    if (isNaN(namXB) || namXB < 1900 || namXB > new Date().getFullYear()) {
      setMessage("Năm xuất bản không hợp lệ!");
      return;
    }

    setMessage("");

    try {
      const dauSachList = await themSachApi.getAllDauSach();
      const existingDauSach = dauSachList.find((ds) => {
        const tenSachMatch =
          ds.TenSach.trim().toLowerCase() === tenSach.trim().toLowerCase();
        const dsTacGia = Array.isArray(ds.TenTacGia)
          ? ds.TenTacGia.map((tg) => tg.toLowerCase())
          : [];
        const selectedTacGia = tenTacGia.map((tg) => tg.TenTG.toLowerCase());
        const tacGiaMatch =
          dsTacGia.length === selectedTacGia.length &&
          dsTacGia.every((tg) => selectedTacGia.includes(tg)) &&
          selectedTacGia.every((tg) => dsTacGia.includes(tg));
        const theLoaiMatch =
          ds.TheLoai.toLowerCase() === theLoai[0].TenTheLoai.toLowerCase();
        return tenSachMatch && tacGiaMatch && theLoaiMatch;
      });

      if (existingDauSach) {
        setExistingDauSachData(existingDauSach);
        setShowConfirmExistingBook(true);
      } else {
        setShowCreateDauSach(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        "Có lỗi xảy ra khi thêm sách: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Thêm đầu sách mới
  const handleAddDauSach = async () => {
    try {
      const dauSachData = {
        TenSach: tenSach,
        TheLoai: theLoai,
        TenTacGia: tenTacGia,
      };
      const dauSachResult = await themSachApi.addDauSach(dauSachData);

      if (dauSachResult && dauSachResult.MaDauSach) {
        setMaDauSach(dauSachResult.MaDauSach);
        setShowCreateDauSach(false);
        setShowBookForm(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        "Có lỗi xảy ra khi thêm đầu sách: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Thêm hàm xử lý lưu sách
  const handleSaveBook = async () => {
    try {
      const namXB = parseInt(namXuatBan);
      if (isNaN(namXB) || namXB < 1900 || namXB > new Date().getFullYear()) {
        setMessage("Năm xuất bản không hợp lệ!");
        return;
      }

      if (!nhaXuatBan || !namXuatBan) {
        setMessage("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const newBook = {
        MaSach: maSachMoi,
        MaDauSach: maDauSach,
        TenSach: tenSach,
        NXB: nhaXuatBan,
        NamXB: namXB,
        SLTon: 0,
      };

      await themSachApi.addBook(newBook);
      setShowBookForm(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        resetForm();
      }, 2000);
    } catch (error) {
      setMessage(
        "Có lỗi xảy ra khi lưu sách: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Reset form sau khi thêm thành công
  const resetForm = async () => {
    setTenSach("");
    setTenTacGia([]);
    setTheLoai([]);
    setNhaXuatBan("");
    setNamXuatBan("");
    setSelectedNXB([]);
    setStep(1);

    try {
      const books = await themSachApi.getAllBooks();
      let maxMaSach = 0;
      books.forEach((book) => {
        const num = parseInt(extractNumericId(book.MaSach, "S"), 10);
        if (!isNaN(num) && num > maxMaSach) maxMaSach = num;
      });
      setMaSachMoi("S" + (maxMaSach + 1).toString().padStart(3, "0"));
    } catch (error) {
      console.error("Error updating MaSach:", error);
    }
  };

  const handleCancelCreateDauSach = () => {
    setShowCreateDauSach(false);
    setMessage("");
  };

  // Xử lý click ngoài dropdown
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const genreDropdownRef = useRef(null);
  const nxbDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setShowTacGiaDropdown(false);
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddTacGiaInput(false);
        setNewTacGia("");
      }
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target)
      )
        setShowTheLoaiDropdown(false);
      if (
        nxbDropdownRef.current &&
        !nxbDropdownRef.current.contains(event.target)
      )
        setShowNXBDropdown(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý tìm kiếm sách hoặc đầu sách
  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      alert("Vui lòng nhập mã sách hoặc mã đầu sách!");
      return;
    }

    try {
      if (searchTerm.startsWith("DS")) {
        const dauSachId = extractNumericId(searchTerm, "DS");
        const dauSach = await themSachApi.getDauSachById(dauSachId);
        if (dauSach) {
          setEditDauSach({
            maDauSach: `DS${dauSachId.padStart(3, "0")}`,
            tenSach: dauSach.TenSach,
            selectedAuthors: Array.isArray(dauSach.TenTacGia)
              ? dauSach.TenTacGia.map((tg) => ({
                  TenTG: tg,
                  MaTG: tg.MaTG || `TG${Math.random().toString().slice(2, 8)}`,
                }))
              : [
                  {
                    TenTG: dauSach.TenTacGia,
                    MaTG: `TG${Math.random().toString().slice(2, 8)}`,
                  },
                ],
            selectedGenres: [
              {
                TenTheLoai: dauSach.TenTheLoai,
                MaTheLoai: `TL${Math.random().toString().slice(2, 8)}`,
              },
            ],
            nhaXuatBan: "",
            namXuatBan: "",
            maSach: "",
            selectedNXB: [],
          });
          setIsEditingBook(false);
          setShowEditDauSach(true);
        } else alert("Không tìm thấy đầu sách!");
      } else if (searchTerm.match(/^S\d{3}$/)) {
        console.log("Searching for book with ID:", searchTerm);
        const book = await themSachApi.getBookById(searchTerm);

        if (!book) {
          alert("Không tìm thấy sách!");
          return;
        }

        const matchingPublisher = allNXB.find((nxb) => nxb.TenNXB === book.NXB);
        const bookInfo = {
          maDauSach: book.MaDauSach,
          tenSach: book.TenDauSach || "Không có tên",
          selectedAuthors: [],
          selectedGenres: [],
          nhaXuatBan: book.NXB || "",
          namXuatBan: book.NamXB || "",
          maSach: book.MaSach,
          selectedNXB: matchingPublisher ? [matchingPublisher] : [],
        };

        try {
          console.log("Fetching DauSach with ID:", book.MaDauSach);
          const dauSach = await themSachApi.getDauSachById(
            extractNumericId(book.MaDauSach, "DS")
          );
          if (dauSach) {
            console.log("DauSach found:", dauSach);
            bookInfo.tenSach = dauSach.TenSach;
            bookInfo.selectedAuthors = Array.isArray(dauSach.TenTacGia)
              ? dauSach.TenTacGia.map((tg) => ({
                  TenTG: tg,
                  MaTG: tg.MaTG || `TG${Math.random().toString().slice(2, 8)}`,
                }))
              : [
                  {
                    TenTG: dauSach.TenTacGia,
                    MaTG: `TG${Math.random().toString().slice(2, 8)}`,
                  },
                ];
            bookInfo.selectedGenres = [
              {
                TenTheLoai: dauSach.TenTheLoai,
                MaTheLoai: `TL${Math.random().toString().slice(2, 8)}`,
              },
            ];
          } else
            console.warn(
              "DauSach not found but continuing with limited book info"
            );
        } catch (innerError) {
          console.error("Error getting DauSach:", innerError);
          alert(
            "Cảnh báo: Đã tìm thấy sách nhưng không thể lấy đầy đủ thông tin đầu sách. Một số thông tin có thể bị thiếu."
          );
        }

        setEditDauSach(bookInfo);
        setIsEditingBook(true);
        setShowEditDauSach(true);
      } else alert("Mã không hợp lệ! Vui lòng nhập DSxxx hoặc Sxxx");
    } catch (error) {
      console.error("Error searching:", error);
      alert("Có lỗi khi tìm kiếm: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleSearchDauSach = () => {
    if (!dauSachSearchTerm.startsWith("DS")) {
      alert("Mã đầu sách phải bắt đầu bằng DS!");
      return;
    }
    handleSearch(dauSachSearchTerm);
  };

  const handleSearchSach = () => {
    if (!dauSachSearchTerm.startsWith("S")) {
      alert("Mã sách phải bắt đầu bằng S!");
      return;
    }
    if (!dauSachSearchTerm.match(/^S\d{3}$/)) {
      alert(
        "Mã sách không hợp lệ! Vui lòng nhập theo định dạng Sxxx (S và 3 số)"
      );
      return;
    }
    handleSearch(dauSachSearchTerm);
  };

  // Cập nhật thông tin đầu sách hoặc sách
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateError, setShowUpdateError] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [isUpdatingDauSach, setIsUpdatingDauSach] = useState(false);

  const handleUpdateDauSach = async () => {
    try {
      if (
        !editDauSach.tenSach ||
        editDauSach.selectedAuthors.length === 0 ||
        editDauSach.selectedGenres.length === 0
      ) {
        setUpdateErrorMessage("Vui lòng điền đầy đủ thông tin!");
        setShowUpdateError(true);
        return;
      }

      if (isEditingBook) {
        const namXB = parseInt(editDauSach.namXuatBan);
        if (isNaN(namXB) || namXB < 1900 || namXB > new Date().getFullYear()) {
          setUpdateErrorMessage("Năm xuất bản không hợp lệ!");
          setShowUpdateError(true);
          return;
        }

        if (!editDauSach.selectedNXB || editDauSach.selectedNXB.length === 0) {
          setUpdateErrorMessage("Vui lòng chọn nhà xuất bản!");
          setShowUpdateError(true);
          return;
        }

        await themSachApi.updateBook({
          MaSach: editDauSach.maSach,
          NXB: editDauSach.selectedNXB[0].TenNXB,
          NamXB: namXB,
        });
        setIsUpdatingDauSach(false);
      } else {
        const updateData = {
          MaDauSach: extractNumericId(editDauSach.maDauSach, "DS"),
          TenSach: editDauSach.tenSach,
          TenTacGia: editDauSach.selectedAuthors.map((author) => author.TenTG),
          TheLoai: editDauSach.selectedGenres[0].TenTheLoai,
        };

        await themSachApi.updateDauSach(updateData);
        setIsUpdatingDauSach(true);
      }

      setShowUpdateSuccess(true);
      setTimeout(() => {
        setShowUpdateSuccess(false);
        setShowEditDauSach(false);
        setIsEditingBook(false);
        setEditDauSach({
          maDauSach: "",
          tenSach: "",
          selectedAuthors: [],
          selectedGenres: [],
          nhaXuatBan: "",
          namXuatBan: "",
          maSach: "",
          selectedNXB: [],
        });
      }, 2000);
    } catch (error) {
      console.error("Error updating:", error);
      setUpdateErrorMessage(error.response?.data?.message || error.message);
      setShowUpdateError(true);
    }
  };

  // Genre handlers
  const handleAddGenreInList = async () => {
    try {
      if (!newTheLoai.trim()) {
        setMessage("Vui lòng nhập tên thể loại!");
        return;
      }
      await handleAddGenreSuccess(newTheLoai);
    } catch (error) {
      console.error("Error adding genre:", error);
      setMessage(
        "Có lỗi khi thêm thể loại: " + (error.message || "Không xác định")
      );
    }
  };

  const handleEditGenre = async () => {
    try {
      if (!editGenreName.trim()) {
        setMessage("Tên thể loại không được để trống!");
        return;
      }
      await themSachApi.updateGenre(
        extractNumericId(editingGenre.MaTheLoai, "TL"),
        editGenreName
      );
      const updatedGenres = allTheLoai.map((genre) =>
        genre.MaTheLoai === editingGenre.MaTheLoai
          ? { ...genre, TenTheLoai: editGenreName }
          : genre
      );
      setAllTheLoai(updatedGenres);
      setEditingGenre(null);
      setEditGenreName("");
      setMessage("Cập nhật thể loại thành công!");
    } catch (error) {
      console.error("Error updating genre:", error);
      setMessage(
        "Có lỗi khi cập nhật thể loại: " + (error.message || "Không xác định")
      );
    }
  };

  const handleDeleteGenre = async () => {
    try {
      await themSachApi.deleteGenre(
        extractNumericId(genreToDelete.MaTheLoai, "TL")
      );
      setAllTheLoai(
        allTheLoai.filter(
          (genre) => genre.MaTheLoai !== genreToDelete.MaTheLoai
        )
      );
      setShowGenreDeleteConfirm(false);
      setGenreToDelete(null);
      setMessage("Xóa thể loại thành công!");
    } catch (error) {
      console.error("Error deleting genre:", error);
      setMessage(
        "Có lỗi khi xóa thể loại: " + (error.message || "Không xác định")
      );
    }
  };

  // Author handlers
  const handleAddAuthorInList = async () => {
    try {
      if (!newTacGia.trim()) {
        setMessage("Vui lòng nhập tên tác giả!");
        return;
      }
      await handleAddAuthorSuccess(newTacGia);
    } catch (error) {
      console.error("Error adding author:", error);
      setMessage(
        "Có lỗi khi thêm tác giả: " + (error.message || "Không xác định")
      );
    }
  };

  const handleEditAuthor = async () => {
    try {
      if (!editAuthorName.trim()) {
        setMessage("Tên tác giả không được để trống!");
        return;
      }
      await themSachApi.updateAuthor(
        extractNumericId(editingAuthor.MaTG, "TG"),
        editAuthorName
      );
      const updatedAuthors = allTacGia.map((author) =>
        author.MaTG === editingAuthor.MaTG
          ? { ...author, TenTG: editAuthorName }
          : author
      );
      setAllTacGia(updatedAuthors);
      setEditingAuthor(null);
      setEditAuthorName("");
      setMessage("Cập nhật tác giả thành công!");
    } catch (error) {
      console.error("Error updating author:", error);
      setMessage(
        "Có lỗi khi cập nhật tác giả: " + (error.message || "Không xác định")
      );
    }
  };

  const handleDeleteAuthor = async () => {
    console.log("Deleting author with ID:", authorToDelete?.MaTG); // Debug
    try {
      await themSachApi.deleteAuthor(
        extractNumericId(authorToDelete.MaTG, "TG")
      );
      setAllTacGia(
        allTacGia.filter((author) => author.MaTG !== authorToDelete.MaTG)
      );
      setShowAuthorDeleteConfirm(false);
      setAuthorToDelete(null);
      setMessage("Xóa tác giả thành công!");
    } catch (error) {
      console.error("Error deleting author:", error);
      setMessage(
        "Có lỗi khi xóa tác giả: " + (error.message || "Không xác định")
      );
    }
  };

  // Publisher handlers
  const handleAddPublisherInList = async () => {
    try {
      if (!newNXB.trim()) {
        setMessage("Vui lòng nhập tên nhà xuất bản!");
        return;
      }
      await handleAddPublisherSuccess(newNXB);
    } catch (error) {
      console.error("Error adding publisher:", error);
      setMessage(
        "Có lỗi khi thêm nhà xuất bản: " + (error.message || "Không xác định")
      );
    }
  };

  const handleEditPublisher = async () => {
    try {
      if (!editPublisherName.trim()) {
        setMessage("Tên nhà xuất bản không được để trống!");
        return;
      }
      await themSachApi.updatePublisher(
        extractNumericId(editingPublisher.MaNXB, "NXB"),
        editPublisherName
      );
      const updatedPublishers = allNXB.map((publisher) =>
        publisher.MaNXB === editingPublisher.MaNXB
          ? { ...publisher, TenNXB: editPublisherName }
          : publisher
      );
      setAllNXB(updatedPublishers);
      setEditingPublisher(null);
      setEditPublisherName("");
      setMessage("Cập nhật nhà xuất bản thành công!");
    } catch (error) {
      console.error("Error updating publisher:", error);
      setMessage(
        "Có lỗi khi cập nhật nhà xuất bản: " +
          (error.message || "Không xác định")
      );
    }
  };

  const handleDeletePublisher = async () => {
    try {
      await themSachApi.deletePublisher(
        extractNumericId(publisherToDelete.MaNXB, "NXB")
      );
      setAllNXB(
        allNXB.filter(
          (publisher) => publisher.MaNXB !== publisherToDelete.MaNXB
        )
      );
      setShowPublisherDeleteConfirm(false);
      setPublisherToDelete(null);
      setMessage("Xóa nhà xuất bản thành công!");
    } catch (error) {
      console.error("Error deleting publisher:", error);
      setMessage(
        "Có lỗi khi xóa nhà xuất bản: " + (error.message || "Không xác định")
      );
    }
  };

  // Handle adding new author with proper state management
  const handleAddNewAuthor = () => {
    if (newTacGia.trim()) {
      setShowConfirmAddAuthor(true);
      setShowAddTacGiaInput(false);
    }
  };

  const handleCancelAddAuthor = () => {
    setShowAddTacGiaInput(false);
    setNewTacGia("");
  };

  const handleConfirmAddAuthor = async () => {
    if (
      newTacGia.trim() &&
      !allTacGia.some(
        (tg) => tg.TenTG.toLowerCase() === newTacGia.trim().toLowerCase()
      )
    ) {
      await handleAddAuthorSuccess(newTacGia.trim());
    }
  };

  const handleAuthorInputChange = (e) => setNewTacGia(e.target.value);

  const handleResetAuthorForm = () => {
    setNewTacGia("");
    setShowAddTacGiaInput(false);
    setShowConfirmAddAuthor(false);
  };

  const handleShowAddAuthorForm = () => {
    setShowTacGiaDropdown(false);
    setShowAddTacGiaInput(true);
  };

  const handleShowConfirmAuthor = () => {
    if (newTacGia.trim()) {
      setShowConfirmAddAuthor(true);
      setShowAddTacGiaInput(false);
    }
  };

  const handleAddAuthorToList = () => {
    if (!newTacGia.trim()) {
      setMessage("Vui lòng nhập tên tác giả!");
      return;
    }

    if (
      !allTacGia.some(
        (tg) => tg.TenTG.toLowerCase() === newTacGia.trim().toLowerCase()
      )
    ) {
      handleAddAuthorSuccess(newTacGia.trim());
    } else setMessage("Tác giả này đã tồn tại!");
  };

  // Helper function to extract numeric ID
  const extractNumericId = (id, prefix) =>
    id.replace(new RegExp(`^${prefix}0*`), "");

  return (
    <div className="page-container">
      <h1 className="page-title">Thêm Sửa Sách</h1>
      <div className="content-wrapper block-container-ts">
        {/* Block 1: Thêm sách mới */}
        <div className="block-ts">
          <h2 className="block-title-ts">Thêm sách mới</h2>
          {!showBookForm && !showSuccessMessage && (
            <div>
              {/* <div className="form-row-tsm">
                { <label>Mã Sách Mới:</label>
                <input type="text" value={maSachMoi} disabled /> }
              </div> */}
              <div className="form-row-tsm">
                <label>Tên sách:</label>
                <input
                  type="text"
                  value={tenSach}
                  onChange={(e) => setTenSach(e.target.value)}
                  placeholder={tenTacGia.length === 0 ? "Nhập tên sách mới" : ""}
                  style={{ backgroundColor: 'white' }}
                />
              </div>
              <div className="form-row-tsm">
                <label>Tên tác giả:</label>
                <div
                  style={{ position: "relative", width: "100%" }}
                  ref={dropdownRef}
                >
                  <div className="authors-input-container-tsm">
                    <div className="selected-authors-tsm">
                      {tenTacGia.map((author, index) => (
                        <span key={index} className="author-tag-tsm">
                          {author.TenTG}
                          <button
                            className="remove-author-chip-tsm"
                            onClick={() =>
                              setTenTacGia(
                                tenTacGia.filter((_, i) => i !== index)
                              )
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newTacGia}
                      onChange={handleAuthorInputChange}
                      placeholder={tenTacGia.length === 0 ? "Chọn tác giả" : ""}
                      className="author-input-tsm"
                      onClick={() => setShowTacGiaDropdown(true)}
                      style={{ backgroundColor: 'white' }}
                    />
                  </div>
                  {showTacGiaDropdown && (
                    <div className="dropdown-container-tsm">
                      {allTacGia
                        .filter((tg) => {
                          const searchTerm = (newTacGia || "").toLowerCase();
                          return (
                            tg?.TenTG?.toLowerCase().includes(searchTerm) &&
                            !tenTacGia.some(
                              (selected) => selected.MaTG === tg.MaTG
                            )
                          );
                        })
                        .map((tg, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item-tsm"
                            onClick={() => {
                              setTenTacGia([...tenTacGia, tg]);
                              setNewTacGia("");
                              setShowTacGiaDropdown(false);
                            }}
                          >
                            {tg.TenTG}
                          </div>
                        ))}
                      <div
                        className="dropdown-add-button-tsm"
                        onClick={() => {
                          setShowTacGiaDropdown(false);
                          setShowAddTacGiaInput(true);
                        }}
                      >
                        + Thêm tác giả mới
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-row-tsm">
                <label>Thể loại:</label>
                <div
                  style={{ position: "relative", width: "100%" }}
                  ref={genreDropdownRef}
                >
                  <div className="authors-input-container-tsm">
                    <div className="selected-authors-tsm">
                      {theLoai.map((genre, index) => (
                        <span key={index} className="author-tag-tsm">
                          {genre.TenTheLoai}
                          <button
                            className="remove-author-chip-tsm"
                            onClick={() =>
                              setTheLoai(theLoai.filter((_, i) => i !== index))
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newTheLoai}
                      onChange={(e) => setNewTheLoai(e.target.value)}
                      placeholder={theLoai.length === 0 ? "Chọn thể loại" : ""}
                      className="author-input-tsm"
                      onClick={() => setShowTheLoaiDropdown(true)}
                      style={{ backgroundColor: 'white' }}
                    />
                  </div>
                  {showTheLoaiDropdown && (
                    <div className="dropdown-container-tsm">
                      {allTheLoai
                        .filter((tl) => {
                          const searchTerm = (newTheLoai || "").toLowerCase();
                          return (
                            tl?.TenTheLoai?.toLowerCase().includes(
                              searchTerm
                            ) &&
                            !theLoai.some(
                              (selected) => selected.MaTheLoai === tl.MaTheLoai
                            )
                          );
                        })
                        .map((tl, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item-tsm"
                            onClick={() => {
                              setTheLoai([tl]);
                              setNewTheLoai("");
                              setShowTheLoaiDropdown(false);
                            }}
                          >
                            {tl.TenTheLoai}
                          </div>
                        ))}
                      <div
                        className="dropdown-add-button-tsm"
                        onClick={() => {
                          setShowTheLoaiDropdown(false);
                          setShowAddTheLoaiInput(true);
                        }}
                      >
                        + Thêm thể loại mới
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-row-tsm">
                <label>Nhà xuất bản:</label>
                <div
                  style={{ position: "relative", width: "100%" }}
                  ref={nxbDropdownRef}
                >
                  <div className="authors-input-container-tsm">
                    <div className="selected-authors-tsm">
                      {selectedNXB.map((pub, index) => (
                        <span key={index} className="author-tag-tsm">
                          {pub.TenNXB}
                          <button
                            className="remove-author-chip-tsm"
                            onClick={() => {
                              setSelectedNXB([]);
                              setNhaXuatBan("");
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newNXB}
                      onChange={(e) => setNewNXB(e.target.value)}
                      placeholder={
                        selectedNXB.length === 0 ? "Chọn nhà xuất bản" : ""
                      }
                      className="author-input-tsm"
                      onClick={() => setShowNXBDropdown(true)}
                      style={{ backgroundColor: 'white' }}
                    />
                  </div>
                  {showNXBDropdown && (
                    <div className="dropdown-container-tsm">
                      {allNXB
                        .filter((nxb) => {
                          const searchTerm = (newNXB || "").toLowerCase();
                          return (
                            nxb?.TenNXB?.toLowerCase().includes(searchTerm) &&
                            !selectedNXB.some(
                              (selected) => selected.MaNXB === nxb.MaNXB
                            )
                          );
                        })
                        .map((nxb, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item-tsm"
                            onClick={() => {
                              setSelectedNXB([nxb]);
                              setNewNXB("");
                              setShowNXBDropdown(false);
                              setNhaXuatBan(nxb.TenNXB);
                            }}
                          >
                            {nxb.TenNXB}
                          </div>
                        ))}
                      <div
                        className="dropdown-add-button-tsm"
                        onClick={() => {
                          setShowNXBDropdown(false);
                          setShowAddNXBInput(true);
                        }}
                      >
                        + Thêm nhà xuất bản mới
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-row-tsm">
                <label>Năm xuất bản:</label>
                <input
                  type="text"
                  value={namXuatBan}
                  onChange={(e) => setNamXuatBan(e.target.value)}
                  placeholder="Nhập năm xuất bản"
                  style={{ backgroundColor: 'white' }}
                />
              </div>
              {message && (
                <div
                  style={{
                    color: message.includes("thành công") ? "green" : "red",
                    marginTop: 8,
                  }}
                >
                  {message}
                </div>
              )}
              <button className="button-tsm" onClick={handleSubmit}>
                Thêm sách
              </button>
            </div>
          )}

          {/* Modal xác nhận thêm đầu sách */}
          {showCreateDauSach && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Thông tin đầu sách mới</h2>
                <div
                  className="modal-them-sach-container-tsm"
                  style={{ marginBottom: "20px" }}
                >
                  <div>Tên sách: {tenSach}</div>
                  <div>
                    Tên tác giả:{" "}
                    {tenTacGia.map((author) => author.TenTG).join(", ")}
                  </div>
                  <div>
                    Thể loại:{" "}
                    {theLoai.map((genre) => genre.TenTheLoai).join(", ")}
                  </div>
                </div>
                <div className="modal-buttons-container-tsm">
                  <button
                    className="adds-button-tsm"
                    onClick={handleAddDauSach}
                  >
                    Thêm
                  </button>
                  <button
                    className="cancel-button-tsm"
                    onClick={handleCancelCreateDauSach}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form nhập thông tin sách mới */}
          {showBookForm && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Thông tin sách mới</h2>
                <div
                  className="modal-them-sach-container-tsm"
                  style={{ marginBottom: "20px" }}
                >
                  <div>Mã sách: {maSachMoi}</div>
                  <div>Tên sách: {tenSach}</div>
                  <div>
                    Tác giả:{" "}
                    {tenTacGia.map((author) => author.TenTG).join(", ")}
                  </div>
                  <div>
                    Thể loại:{" "}
                    {theLoai.map((genre) => genre.TenTheLoai).join(", ")}
                  </div>
                  <div>Nhà xuất bản: {nhaXuatBan}</div>
                  <div>Năm xuất bản: {namXuatBan}</div>
                </div>
                <div className="modal-buttons-container-tsm">
                  <button className="adds-button-tsm" onClick={handleSaveBook}>
                    Thêm
                  </button>
                  <button
                    className="cancel-button-ts"
                    onClick={() => setShowBookForm(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Thông báo thành công */}
          {showSuccessMessage && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="success-modal-tsm">
                <h2>Thêm sách thành công!</h2>
              </div>
            </div>
          )}

          {/* Modal thêm tác giả mới */}
          {showAddTacGiaInput && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm" ref={modalRef}>
                <h2>Thêm tác giả mới</h2>
                <div className="modal-content-tsm">
                  <input
                    type="text"
                    placeholder="Nhập tên tác giả mới"
                    value={newTacGia}
                    onChange={handleAuthorInputChange}
                    className="modal-input-tsm"
                    style={{ backgroundColor: 'white' }}
                    autoFocus
                  />
                </div>
                <div className="modal-buttons-container-tsm">
                  <button
                    className="adds-button-tsm"
                    onClick={handleAddNewAuthor}
                    style={{ marginRight: "10px" }}
                  >
                    Thêm
                  </button>
                  <button
                    className="cancel-button-tsm"
                    onClick={handleCancelAddAuthor}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal xác nhận thêm tác giả */}
          {showConfirmAddAuthor && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Xác nhận thêm tác giả</h2>
                <p>Bạn có chắc muốn thêm tác giả "{newTacGia}" không?</p>
                <div className="modal-buttons-container-tsm">
                  <button
                    className="adds-button-tsm"
                    onClick={handleConfirmAddAuthor}
                    style={{ marginRight: "10px" }}
                  >
                    Có
                  </button>
                  <button
                    className="cancel-button-tsm"
                    onClick={() => {
                      setShowConfirmAddAuthor(false);
                      setShowAddTacGiaInput(true);
                    }}
                  >
                    Không
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal thêm thể loại mới */}
          {showAddTheLoaiInput && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm" ref={modalRef}>
                <h2>Thêm thể loại mới</h2>
                <div className="modal-content-tsm">
                  <input
                    type="text"
                    placeholder="Nhập tên thể loại mới"
                    value={newTheLoai}
                    onChange={(e) => setNewTheLoai(e.target.value)}
                    className="modal-input-tsm"
                    autoFocus
                  />
                </div>
                <div className="modal-buttons-container-tsm">
                  <button
                    onClick={() => {
                      if (newTheLoai.trim()) setShowConfirmAddGenre(true);
                    }}
                    className="adds-button-tsm"
                  >
                    Thêm
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTheLoaiInput(false);
                      setNewTheLoai("");
                    }}
                    className="cancel-button-tsm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal xác nhận thêm thể loại */}
          {showConfirmAddGenre && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Xác nhận thêm thể loại</h2>
                <p>Bạn có chắc muốn thêm thể loại "{newTheLoai}" không?</p>
                <div className="modal-buttons-container-tsm">
                  <button
                    onClick={() => {
                      if (
                        newTheLoai.trim() &&
                        !allTheLoai.some(
                          (tl) =>
                            tl.TenTheLoai.toLowerCase() ===
                            newTheLoai.trim().toLowerCase()
                        )
                      )
                        handleAddGenreSuccess(newTheLoai.trim());
                    }}
                    className="adds-button-tsm"
                    style={{ marginRight: "10px" }}
                  >
                    Có
                  </button>
                  <button
                    onClick={() => setShowConfirmAddGenre(false)}
                    className="cancel-button-tsm"
                  >
                    Không
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal thêm nhà xuất bản mới */}
          {showAddNXBInput && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Thêm nhà xuất bản mới</h2>
                <div className="modal-content-tsm">
                  <input
                    type="text"
                    placeholder="Nhập tên nhà xuất bản mới"
                    value={newNXB}
                    onChange={(e) => setNewNXB(e.target.value)}
                    className="modal-input-tsm"
                    autoFocus
                  />
                </div>
                <div className="modal-buttons-container-tsm">
                  <button
                    onClick={() => {
                      if (newNXB.trim()) setShowConfirmAddPublisher(true);
                    }}
                    className="adds-button-tsm"
                  >
                    Thêm
                  </button>
                  <button
                    onClick={() => {
                      setShowAddNXBInput(false);
                      setNewNXB("");
                    }}
                    className="cancel-button-tsm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal xác nhận thêm nhà xuất bản */}
          {showConfirmAddPublisher && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Xác nhận thêm nhà xuất bản</h2>
                <p>Bạn có chắc muốn thêm nhà xuất bản "{newNXB}" không?</p>
                <div className="modal-buttons-container-tsm">
                  <button
                    onClick={() => {
                      if (
                        newNXB.trim() &&
                        !allNXB.some(
                          (nxb) =>
                            nxb.TenNXB.toLowerCase() ===
                            newNXB.trim().toLowerCase()
                        )
                      )
                        handleAddPublisherSuccess(newNXB.trim());
                    }}
                    className="adds-button-tsm"
                    style={{ marginRight: "10px" }}
                  >
                    Có
                  </button>
                  <button
                    onClick={() => setShowConfirmAddPublisher(false)}
                    className="cancel-button-tsm"
                  >
                    Không
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal xác nhận sách đã tồn tại */}
          {showConfirmExistingBook && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="modal-them-sach-tsm">
                <h2>Thêm sách mới</h2>
                <p>
                  Đầu sách đã tồn tại, bạn có muốn thêm sách mới với đầu sách
                  này không?
                </p>
                <div className="modal-buttons-container-tsm">
                  <button
                    className="adds-button-tsm"
                    onClick={async () => {
                      setShowConfirmExistingBook(false);
                      setShowBookForm(true);
                      setMaDauSach(existingDauSachData.MaDauSach);
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Có
                  </button>
                  <button
                    className="cancel-button-tsm"
                    onClick={() => setShowConfirmExistingBook(false)}
                  >
                    Không
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Thông báo thêm sách thành công */}
          {showAddBookSuccess && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="success-modal-tsm">
                <div className="success-icon">✓</div>
                <h2>Thêm sách thành công!</h2>
                <p>Sách đã được thêm vào đầu sách hiện có.</p>
              </div>
            </div>
          )}

          {/* Thông báo lỗi sách đã tồn tại */}
          {showBookExistsError && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="error-modal-tsm">
                <h2>Lỗi!</h2>
                <p>Sách với thông tin này đã tồn tại. Vui lòng kiểm tra lại!</p>
                <button
                  className="close-error-modal-tsm"
                  onClick={() => setShowBookExistsError(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {/* Thông báo cập nhật thành công */}
          {showUpdateSuccess && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="success-modal-tsm">
                <div className="success-icon">✓</div>
                <h2>Cập Nnật thành công!</h2>
                <p>
                  {isUpdatingDauSach ? "Thông tin đầu sách" : "Thông tin sách"}{" "}
                  đã được cập nhật.
                </p>
                <button
                  className="close-button-tsm"
                  onClick={() => setShowUpdateSuccess(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {/* Thông báo lỗi khi cập nhật */}
          {showUpdateError && (
            <div className="modal-overlay-them-sach-tsm">
              <div className="error-modal-tsm">
                <h2>Lỗi!</h2>
                <p>{updateErrorMessage}</p>
                <button
                  className="close-button-tsm"
                  onClick={() => setShowUpdateError(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Block 2: Sửa Thông Tin Đầu Sách */}
        <div className="block-ts">
          <h2 className="block-title-ts">Sửa thông tin sách - đầu sách</h2>
          <div className="search-block-ts">
            <input
              type="text"
              placeholder="Nhập mã đầu sách (DSxxx) hoặc mã sách (Sxxx)..."
              value={dauSachSearchTerm}
              onChange={(e) =>
                setDauSachSearchTerm(e.target.value.toUpperCase())
              }
              className="search-input-ts"
            />
            <button
              className="search-button-ts"
              onClick={handleSearchDauSach}
              style={{ marginRight: "10px" }}
            >
              Tìm đầu sách
            </button>
            <button className="search-button-ts" onClick={handleSearchSach}>
              Tìm sách
            </button>
          </div>

          {showEditDauSach && (
            <div className="edit-form-ts">
              <h2 style={{marginBottom: '1.5rem'}}>
                {isEditingBook
                  ? "Sửa thông tin sách"
                  : "Sửa thông tin đầu sách"}
              </h2>
              <div className="form-row-tsm">
                <label>Mã đầu sách:</label>
                <input type="text" value={editDauSach.maDauSach} disabled />
              </div>
              {isEditingBook && (
                <div className="form-row-tsm">
                  <label>Mã sách:</label>
                  <input type="text" value={editDauSach.maSach} disabled />
                </div>
              )}
              <div className="form-row-tsm">
                <label>Tên sách:</label>
                <input
                
                  type="text"
                  value={editDauSach.tenSach}
                  onChange={(e) =>
                    setEditDauSach({ ...editDauSach, tenSach: e.target.value })
                  }
                  disabled={isEditingBook}
                />
              </div>
              <div className="form-row-tsm">
                <label>Tác giả:</label>
                <div
                  style={{ position: "relative", width: "100%" }}
                  ref={dropdownRef}
                >
                  <div className="authors-input-container-tsm">
                    <div className="selected-authors-tsm">
                      {editDauSach.selectedAuthors.map((author, index) => (
                        <span key={index} className="author-tag-tsm">
                          {author.TenTG}
                          <button
                            className="remove-author-chip-tsm"
                            onClick={() => {
                              if (!isEditingBook)
                                setEditDauSach({
                                  ...editDauSach,
                                  selectedAuthors:
                                    editDauSach.selectedAuthors.filter(
                                      (_, i) => i !== index
                                    ),
                                });
                            }}
                            disabled={isEditingBook}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                  
                      type="text"
                      value={newTacGia}
                      onChange={handleAuthorInputChange}
                      placeholder={
                        editDauSach.selectedAuthors.length === 0
                          ? "Chọn tác giả"
                          : ""
                      }
                      className="author-input-tsm"
                      onClick={() =>
                        !isEditingBook && setShowTacGiaDropdown(true)
                      }
                      disabled={isEditingBook}
                    />
                    {showTacGiaDropdown && !isEditingBook && (
                      <div className="dropdown-container-tsm">
                        {allTacGia
                          .filter((tg) => {
                            const searchTerm = (newTacGia || "").toLowerCase();
                            return (
                              tg?.TenTG?.toLowerCase().includes(searchTerm) &&
                              !editDauSach.selectedAuthors.some(
                                (selected) => selected.MaTG === tg.MaTG
                              )
                            );
                          })
                          .map((tg, idx) => (
                            <div
                              key={idx}
                              className="dropdown-item-tsm"
                              onClick={() => {
                                setEditDauSach({
                                  ...editDauSach,
                                  selectedAuthors: [
                                    ...editDauSach.selectedAuthors,
                                    tg,
                                  ],
                                });
                                setNewTacGia("");
                                setShowTacGiaDropdown(false);
                              }}
                            >
                              {tg.TenTG}
                            </div>
                          ))}
                        <div
                          className="dropdown-add-button-tsm"
                          onClick={() => {
                            setShowTacGiaDropdown(false);
                            setShowAddTacGiaInput(true);
                          }}
                        >
                          + Thêm tác giả mới
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row-tsm">
                <label>Thể loại:</label>
                <div
                  style={{ position: "relative", width: "100%" }}
                  ref={genreDropdownRef}
                >
                  <div className="authors-input-container-tsm">
                    <div className="selected-authors-tsm">
                      {editDauSach.selectedGenres.map((genre, index) => (
                        <span key={index} className="author-tag-tsm">
                          {genre.TenTheLoai}
                          <button
                            className="remove-author-chip-tsm"
                            onClick={() => {
                              if (!isEditingBook)
                                setEditDauSach({
                                  ...editDauSach,
                                  selectedGenres:
                                    editDauSach.selectedGenres.filter(
                                      (_, i) => i !== index
                                    ),
                                });
                            }}
                            disabled={isEditingBook}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      
                      type="text"
                      value={newTheLoai}
                      onChange={(e) => setNewTheLoai(e.target.value)}
                      placeholder={
                        editDauSach.selectedGenres.length === 0
                          ? "Chọn thể loại"
                          : ""
                      }
                      className="author-input-tsm"
                      onClick={() =>
                        !isEditingBook && setShowTheLoaiDropdown(true)
                      }
                      disabled={isEditingBook}
                    />
                    {showTheLoaiDropdown && !isEditingBook && (
                      <div className="dropdown-container-tsm">
                        {allTheLoai
                          .filter((tl) => {
                            const searchTerm = (newTheLoai || "").toLowerCase();
                            return (
                              tl?.TenTheLoai?.toLowerCase().includes(
                                searchTerm
                              ) &&
                              !editDauSach.selectedGenres.some(
                                (selected) =>
                                  selected.MaTheLoai === tl.MaTheLoai
                              )
                            );
                          })
                          .map((tl, idx) => (
                            <div
                              key={idx}
                              className="dropdown-item-tsm"
                              onClick={() => {
                                setEditDauSach({
                                  ...editDauSach,
                                  selectedGenres: [tl],
                                });
                                setNewTheLoai("");
                                setShowTheLoaiDropdown(false);
                              }}
                            >
                              {tl.TenTheLoai}
                            </div>
                          ))}
                        <div
                          className="dropdown-add-button-tsm"
                          onClick={() => {
                            setShowTheLoaiDropdown(false);
                            setShowAddTheLoaiInput(true);
                          }}
                        >
                          + Thêm thể loại mới
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row-tsm">
                <label>Nhà xuất bản:</label>
                <div
                  style={{ position: "relative", width: "100%" }}
                  ref={nxbDropdownRef}
                >
                  <div className="authors-input-container-tsm">
                    <div className="selected-authors-tsm">
                      {editDauSach.selectedNXB.map((pub, index) => (
                        <span key={index} className="author-tag-tsm">
                          {pub.TenNXB}
                          <button
                            className="remove-author-chip-tsm"
                            onClick={() => {
                              setEditDauSach({
                                ...editDauSach,
                                selectedNXB: [],
                                nhaXuatBan: "",
                              });
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                    style={{ backgroundColor: 'white' }}
                      type="text"
                      value={newNXB}
                      onChange={(e) => setNewNXB(e.target.value)}
                    
                      className="author-input-tsm"
                      onClick={() => setShowNXBDropdown(true)}
                      disabled={!isEditingBook}
                      />
                  </div>
                  {showNXBDropdown && isEditingBook && (
                    <div className="dropdown-container-tsm">
                      {allNXB
                        .filter((nxb) => {
                          const searchTerm = (newNXB || "").toLowerCase();
                          return (
                            nxb?.TenNXB?.toLowerCase().includes(searchTerm) &&
                            !editDauSach.selectedNXB.some(
                              (selected) => selected.MaNXB === nxb.MaNXB
                            )
                          );
                        })
                        .map((nxb, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item-tsm"
                            onClick={() => {
                              setEditDauSach({
                                ...editDauSach,
                                selectedNXB: [nxb],
                                nhaXuatBan: nxb.TenNXB,
                              });
                              setNewNXB("");
                              setShowNXBDropdown(false);
                            }}
                          >
                            {nxb.TenNXB}
                          </div>
                        ))}
                      <div
                        className="dropdown-add-button-tsm"
                        onClick={() => {
                          setShowNXBDropdown(false);
                          setShowAddNXBInput(true);
                        }}
                      >
                        + Thêm nhà xuất bản mới
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-row-tsm">
                <label>Năm xuất bản:</label>
                <input
                style={{ backgroundColor: 'white' }}
                  type="text"
                  value={editDauSach.namXuatBan}
                  onChange={(e) =>
                    setEditDauSach({
                      ...editDauSach,
                      namXuatBan: e.target.value,
                    })
                  }
                  disabled={!isEditingBook}
                />
              </div>
              <div className="button-container-ts">
                <button
                  className="save-button-ts"
                  onClick={handleUpdateDauSach}
                >
                  Lưu thay đổi
                </button>
                <button
                  className="cancel-button-ts"
                  onClick={() => {
                    setShowEditDauSach(false);
                    setIsEditingBook(false);
                    setEditDauSach({
                      maDauSach: "",
                      tenSach: "",
                      selectedAuthors: [],
                      selectedGenres: [],
                      nhaXuatBan: "",
                      namXuatBan: "",
                      maSach: "",
                      selectedNXB: [],
                    });
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Block Quản lý danh mục */}
        <div className="block-ts">
          <div className="block-title-ts">Quản lý danh mục</div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="search-button-ts"
              onClick={() => setShowGenreList(true)}
            >
              Danh sách thể loại
            </button>
            <button
              className="search-button-ts"
              onClick={() => setShowAuthorList(true)}
            >
              Danh sách tác giả
            </button>
            <button
              className="search-button-ts"
              onClick={() => setShowPublisherList(true)}
            >
              Danh sách nhà xuất bản
            </button>
          </div>
        </div>

        {/* Modal danh sách thể loại */}
        {showGenreList && (
          <div className="modal-overlay-them-sach-tsm">
            <div className="modal-them-sach-tsm" style={{ width: "600px" }}>
              <h2>Danh sách thể loại</h2>
              <div className="add-form-container-tsm">
                <input
                  type="text"
                  value={newTheLoai}
                  onChange={(e) => setNewTheLoai(e.target.value)}
                  placeholder="Nhập tên thể loại mới"
                  className="form-input-tsm"
                  style={{ width: "90%", padding: "10px" }}
                />
                <button
                  className="adds-button-tsm"
                  onClick={handleAddGenreInList}
                >
                  Thêm
                </button>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {allTheLoai.map((genre) => (
                  <div
                    key={genre.MaTheLoai}
                    className="form-input-tsm"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {editingGenre?.MaTheLoai === genre.MaTheLoai ? (
                      <input
                        type="text"
                        value={editGenreName}
                        onChange={(e) => setEditGenreName(e.target.value)}
                        className="form-input-tsm"
                        style={{
                          width: "50%",
                          padding: "10px",
                          border: "0.5px solid #ccc",
                        }}
                      />
                    ) : (
                      <span>{genre.TenTheLoai}</span>
                    )}
                    <div>
                      {editingGenre?.MaTheLoai === genre.MaTheLoai ? (
                        <>
                          <button
                            className="adds-button-tsm"
                            onClick={handleEditGenre}
                          >
                            Lưu
                          </button>
                          <button
                            className="cancel-button-tsm"
                            onClick={() => {
                              setEditingGenre(null);
                              setEditGenreName("");
                            }}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="adds-button-tsm"
                            onClick={() => {
                              setEditingGenre(genre);
                              setEditGenreName(genre.TenTheLoai);
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="cancel-button-tsm"
                            onClick={() => {
                              setGenreToDelete(genre);
                              setShowGenreDeleteConfirm(true);
                            }}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {message && <div className="message-tsm">{message}</div>}
              <button
                className="close-button-tsm"
                onClick={() => setShowGenreList(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa thể loại */}
        {showGenreDeleteConfirm && (
          <div className="modal-overlay-them-sach-tsm">
            <div className="modal-them-sach-tsm">
              <h2>Xác nhận xóa</h2>
              <p>
                Bạn có chắc chắn muốn xóa thể loại "{genreToDelete?.TenTheLoai}
                "?
              </p>
              <div className="modal-buttons-container-tsm">
                <button className="adds-button-tsm" onClick={handleDeleteGenre}>
                  Xóa
                </button>
                <button
                  className="cancel-button-tsm"
                  onClick={() => {
                    setShowGenreDeleteConfirm(false);
                    setGenreToDelete(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal danh sách tác giả */}
        {showAuthorList && (
          <div className="modal-overlay-them-sach-tsm">
            <div className="modal-them-sach-tsm" style={{ width: "600px" }}>
              <h2>Danh sách tác giả</h2>
              <div className="add-form-container-tsm">
                <input
                  type="text"
                  value={newTacGia}
                  onChange={handleAuthorInputChange}
                  placeholder="Nhập tên tác giả mới"
                  className="form-input-tsm"
                  style={{ width: "90%", padding: "10px" }}
                />
                <button
                  className="adds-button-tsm"
                  onClick={handleAddAuthorInList}
                >
                  Thêm
                </button>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {allTacGia.map((author) => (
                  <div
                    key={author.MaTG}
                    className="form-input-tsm"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {editingAuthor?.MaTG === author.MaTG ? (
                      <input
                        type="text"
                        value={editAuthorName}
                        onChange={(e) => setEditAuthorName(e.target.value)}
                        className="form-input-tsm"
                        style={{
                          width: "50%",
                          padding: "10px",
                          border: "0.5px solid #ccc",
                        }}
                      />
                    ) : (
                      <span>{author.TenTG}</span>
                    )}
                    <div>
                      {editingAuthor?.MaTG === author.MaTG ? (
                        <>
                          <button
                            className="adds-button-tsm"
                            onClick={handleEditAuthor}
                          >
                            Lưu
                          </button>
                          <button
                            className="cancel-button-tsm"
                            onClick={() => {
                              setEditingAuthor(null);
                              setEditAuthorName("");
                            }}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="adds-button-tsm"
                            onClick={() => {
                              setEditingAuthor(author);
                              setEditAuthorName(author.TenTG);
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="cancel-button-tsm"
                            onClick={() => {
                              setAuthorToDelete(author);
                              setShowAuthorDeleteConfirm(true);
                            }}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {message && <div className="message-tsm">{message}</div>}
              <button
                className="close-button-tsm"
                onClick={() => setShowAuthorList(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa tác giả */}
        {showAuthorDeleteConfirm && (
          <div className="modal-overlay-them-sach-tsm">
            <div className="modal-them-sach-tsm">
              <h2>Xác nhận xóa</h2>
              <p>
                Bạn có chắc chắn muốn xóa tác giả "{authorToDelete?.TenTG}"?
              </p>
              <div className="modal-buttons-container-tsm">
                <button
                  className="adds-button-tsm"
                  onClick={handleDeleteAuthor}
                >
                  Xóa
                </button>
                <button
                  className="cancel-button-tsm"
                  onClick={() => {
                    setShowAuthorDeleteConfirm(false);
                    setAuthorToDelete(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal danh sách nhà xuất bản */}
        {showPublisherList && (
          <div className="modal-overlay-them-sach-tsm">
            <div className="modal-them-sach-tsm" style={{ width: "600px" }}>
              <h2>Danh sách nhà xuất bản</h2>
              <div className="add-form-container-tsm">
                <input
                  type="text"
                  value={newNXB}
                  onChange={(e) => setNewNXB(e.target.value)}
                  placeholder="Nhập tên nhà xuất bản mới"
                  className="form-input-tsm"
                  style={{ width: "90%", padding: "10px" }}
                />
                <button
                  className="adds-button-tsm"
                  onClick={handleAddPublisherInList}
                >
                  Thêm
                </button>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {allNXB.map((publisher) => (
                  <div
                    key={publisher.MaNXB}
                    className="form-input-tsm"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {editingPublisher?.MaNXB === publisher.MaNXB ? (
                      <input
                        type="text"
                        value={editPublisherName}
                        onChange={(e) => setEditPublisherName(e.target.value)}
                        className="form-input-tsm"
                        style={{
                          width: "50%",
                          padding: "10px",
                          border: "0.5px solid #ccc",
                        }}
                      />
                    ) : (
                      <span>{publisher.TenNXB}</span>
                    )}
                    <div>
                      {editingPublisher?.MaNXB === publisher.MaNXB ? (
                        <>
                          <button
                            className="adds-button-tsm"
                            onClick={handleEditPublisher}
                          >
                            Lưu
                          </button>
                          <button
                            className="cancel-button-tsm"
                            onClick={() => {
                              setEditingPublisher(null);
                              setEditPublisherName("");
                            }}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="adds-button-tsm"
                            onClick={() => {
                              setEditingPublisher(publisher);
                              setEditPublisherName(publisher.TenNXB);
                            }}
                          >
                            Sửa
                          </button>
                          {/* <button
                            className="cancel-button-tsm"
                            onClick={() => {
                              setPublisherToDelete(publisher);
                              setShowPublisherDeleteConfirm(true);
                            }}
                          >
                            Xóa
                          </button> */}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {message && <div className="message-tsm">{message}</div>}
              <button
                className="close-button-tsm"
                onClick={() => setShowPublisherList(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa nhà xuất bản */}
        {showPublisherDeleteConfirm && (
          <div className="modal-overlay-them-sach-tsm">
            <div className="modal-them-sach-tsm">
              <h2>Xác nhận xóa</h2>
              <p>
                Bạn có chắc chắn muốn xóa nhà xuất bản "
                {publisherToDelete?.TenNXB}"?
              </p>
              <div className="modal-buttons-container-tsm">
                <button
                  className="adds-button-tsm"
                  onClick={handleDeletePublisher}
                >
                  Xóa
                </button>
                <button
                  className="cancel-button-tsm"
                  onClick={() => {
                    setShowPublisherDeleteConfirm(false);
                    setPublisherToDelete(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemSach;
