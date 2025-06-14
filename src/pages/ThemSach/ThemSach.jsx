import React, { useState, useEffect } from 'react';
import '../../styles/PathStyles.css';
import './ThemSach.css';
import themSachApi from '../../services/themSachApi';

function ThemSach() {
    // Removed unused state
    const [, setStep] = useState(1);
    const [maSachMoi, setMaSachMoi] = useState('');
    const [tenSach, setTenSach] = useState('');
    const [tenTacGia, setTenTacGia] = useState([]); // Array of selected author objects { MaTG, TenTG }
    const [theLoai, setTheLoai] = useState([]); // Array of selected genre objects { MaTheLoai, TenTheLoai }
    const [maDauSach, setMaDauSach] = useState('');
    const [showCreateDauSach, setShowCreateDauSach] = useState(false);
    const [message, setMessage] = useState('');
    const [nhaXuatBan, setNhaXuatBan] = useState('');
    const [namXuatBan, setNamXuatBan] = useState('');
    const [showBookForm, setShowBookForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Danh sách tác giả và thể loại
    const [allTacGia, setAllTacGia] = useState([]); // Array of all author objects
    const [allTheLoai, setAllTheLoai] = useState([]);
    const [newTacGia, setNewTacGia] = useState('');
    const [newTheLoai, setNewTheLoai] = useState('');
    const [showTacGiaDropdown, setShowTacGiaDropdown] = useState(false);
    const [showTheLoaiDropdown, setShowTheLoaiDropdown] = useState(false);
    const [showAddTacGiaInput, setShowAddTacGiaInput] = useState(false);
    const [showAddTheLoaiInput, setShowAddTheLoaiInput] = useState(false);
    const [showConfirmAddAuthor, setShowConfirmAddAuthor] = useState(false);
    const [showConfirmAddGenre, setShowConfirmAddGenre] = useState(false);

    // Danh sách nhà xuất bản
    const [allNXB, setAllNXB] = useState([]);
    const [selectedNXB, setSelectedNXB] = useState([]);
    const [newNXB, setNewNXB] = useState('');
    const [showNXBDropdown, setShowNXBDropdown] = useState(false);
    const [showAddNXBInput, setShowAddNXBInput] = useState(false);
    const [showConfirmAddPublisher, setShowConfirmAddPublisher] = useState(false);

    // Lấy mã sách mới tự động và danh sách tác giả/thể loại
    useEffect(() => {
        async function fetchInit() {
            try {
                // Get next book ID
                const nextBookId = await themSachApi.getNextBookId();
                setMaSachMoi(nextBookId);

                // Lấy danh sách tác giả
                const authors = await themSachApi.getAllAuthors();
                if (Array.isArray(authors)) {
                    setAllTacGia(authors);
                } else {
                    setAllTacGia([]);
                    console.error('Authors data is not an array:', authors);
                }

                // Lấy danh sách thể loại
                const genres = await themSachApi.getAllGenres();
                if (Array.isArray(genres)) {
                    setAllTheLoai(genres);
                } else {
                    setAllTheLoai([]);
                    console.error('Genres data is not an array:', genres);
                }

                // Lấy danh sách nhà xuất bản
                const publishers = await themSachApi.getAllPublishers();
                if (Array.isArray(publishers)) {
                    setAllNXB(publishers);
                } else {
                    setAllNXB([]);
                    console.error('Publishers data is not an array:', publishers);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Có lỗi khi tải dữ liệu: ' + (error.message || 'Không xác định'));
            }
        }
        fetchInit();
    }, []);

    // Thêm tác giả mới
    const handleAddAuthorSuccess = async (newAuthorName) => {
        try {
            const newAuthor = await themSachApi.addAuthor(newAuthorName);
            setAllTacGia([...allTacGia, newAuthor]);
            setTenTacGia([...tenTacGia, newAuthor]);
            setNewTacGia('');
            setShowConfirmAddAuthor(false);
            setShowAddTacGiaInput(false);
            setMessage(`Đã thêm tác giả "${newAuthor.TenTG}" thành công!`);
            setShowTacGiaDropdown(true);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error adding author:', error);
            setMessage('Có lỗi khi thêm tác giả: ' + (error.response?.data?.message || error.message));
        }
    };

    // Thêm thể loại mới
    const handleAddGenreSuccess = async (newGenreName) => {
        try {
            const newGenre = await themSachApi.addGenre(newGenreName);
            setAllTheLoai([...allTheLoai, newGenre]);
            setTheLoai([...theLoai, newGenre]);
            setNewTheLoai('');
            setShowConfirmAddGenre(false);
            setShowAddTheLoaiInput(false);
            setMessage(`Đã thêm thể loại "${newGenre.TenTheLoai}" thành công!`);
            setShowTheLoaiDropdown(true);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error adding genre:', error);
            setMessage('Có lỗi khi thêm thể loại: ' + (error.response?.data?.message || error.message));
        }
    };

    // Thêm nhà xuất bản mới
    const handleAddPublisherSuccess = async (newPublisherName) => {
        try {
            const newPublisher = await themSachApi.addPublisher(newPublisherName);
            setAllNXB([...allNXB, newPublisher]);
            setSelectedNXB([newPublisher]);
            setNewNXB('');
            setShowConfirmAddPublisher(false);
            setShowAddNXBInput(false);
            setMessage(`Đã thêm nhà xuất bản "${newPublisher.TenNXB}" thành công!`);
            setShowNXBDropdown(true);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error adding publisher:', error);
            setMessage('Có lỗi khi thêm nhà xuất bản: ' + (error.response?.data?.message || error.message));
        }
    };

    // Xử lý gửi form
    const handleSubmit = async () => {
        if (!tenSach || tenTacGia.length === 0 || theLoai.length === 0 || !nhaXuatBan || !namXuatBan) {
            setMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Validate năm xuất bản
        const namXB = parseInt(namXuatBan);
        if (isNaN(namXB) || namXB < 1900 || namXB > new Date().getFullYear()) {
            setMessage('Năm xuất bản không hợp lệ!');
            return;
        }

        setMessage('');

        try {
            // Kiểm tra đầu sách tồn tại
            const dauSachList = await themSachApi.getAllDauSach();
            const existingDauSach = dauSachList.find(ds => {
                const tenSachMatch = ds.TenSach.trim().toLowerCase() === tenSach.trim().toLowerCase();
                const dsTacGia = Array.isArray(ds.TenTacGia) ? ds.TenTacGia.map(tg => tg.toLowerCase()) : [];
                const selectedTacGia = tenTacGia.map(tg => tg.TenTG.toLowerCase());
                const tacGiaMatch = dsTacGia.length === selectedTacGia.length &&
                    dsTacGia.every(tg => selectedTacGia.includes(tg)) &&
                    selectedTacGia.every(tg => dsTacGia.includes(tg));
                const theLoaiMatch = ds.TheLoai.toLowerCase() === theLoai[0].TenTheLoai.toLowerCase();
                return tenSachMatch && tacGiaMatch && theLoaiMatch;
            });

            if (existingDauSach) {
                // Thêm sách mới với đầu sách đã tồn tại
                const newBook = {
                    MaSach: maSachMoi,
                    MaDauSach: existingDauSach.MaDauSach,
                    TenSach: tenSach,
                    NXB: nhaXuatBan,
                    NamXB: namXB,
                    SLTon: 0
                };

                await themSachApi.addBook(newBook);
                setMessage('Sách mới đã được thêm thành công!');
                resetForm();
            } else {
                // Hiện modal để xác nhận tạo đầu sách mới
                setShowCreateDauSach(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Có lỗi xảy ra khi thêm sách: ' + (error.response?.data?.message || error.message));
        }
    };

    // Thêm đầu sách mới
    const handleAddDauSach = async () => {
        try {
            const dauSachData = {
                TenSach: tenSach,
                TheLoai: theLoai,
                TenTacGia: tenTacGia
            };
            const dauSachResult = await themSachApi.addDauSach(dauSachData);

            if (dauSachResult && dauSachResult.MaDauSach) {
                setMaDauSach(dauSachResult.MaDauSach);
                setShowCreateDauSach(false);
                setMessage('Đã thêm đầu sách mới thành công!');
                setShowBookForm(true); // Show form nhập thông tin sách
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Có lỗi xảy ra khi thêm đầu sách: ' + (error.response?.data?.message || error.message));
        }
    };

    // Thêm hàm xử lý lưu sách
    const handleSaveBook = async () => {
        try {
            const namXB = parseInt(namXuatBan);
            if (isNaN(namXB) || namXB < 1900 || namXB > new Date().getFullYear()) {
                setMessage('Năm xuất bản không hợp lệ!');
                return;
            }

            if (!nhaXuatBan || !namXuatBan) {
                setMessage('Vui lòng nhập đầy đủ thông tin!');
                return;
            }

            const newBook = {
                MaSach: maSachMoi,
                MaDauSach: maDauSach,
                TenSach: tenSach,
                NXB: nhaXuatBan,
                NamXB: namXB,
                SLTon: 0
            };

            await themSachApi.addBook(newBook);
            setShowBookForm(false);
            setShowSuccessMessage(true);

            // Reset form sau 2 giây
            setTimeout(() => {
                setShowSuccessMessage(false);
                resetForm();
            }, 2000);
        } catch (error) {
            setMessage('Có lỗi xảy ra khi lưu sách: ' + (error.response?.data?.message || error.message));
        }
    };

    // Reset form sau khi thêm thành công
    const resetForm = async () => {
        setTenSach('');
        setTenTacGia([]);
        setTheLoai([]);
        setNhaXuatBan('');
        setNamXuatBan('');
        setStep(1);

        // Cập nhật mã sách mới
        try {
            const books = await themSachApi.getAllBooks();
            let maxMaSach = 0;
            books.forEach(book => {
                const num = parseInt(book.MaSach.replace('S', ''), 10);
                if (!isNaN(num) && num > maxMaSach) maxMaSach = num;
            });
            setMaSachMoi('S' + (maxMaSach + 1).toString().padStart(3, '0'));
        } catch (error) {
            console.error('Error updating MaSach:', error);
        }
    };

    const handleCancelCreateDauSach = () => {
        setShowCreateDauSach(false);
        setMessage('');
    };

    // Xử lý click ngoài dropdown
    const dropdownRef = React.useRef(null);
    const modalRef = React.useRef(null);
    const genreDropdownRef = React.useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTacGiaDropdown(false);
            }
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowAddTacGiaInput(false);
                setNewTacGia('');
            }
            if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
                setShowTheLoaiDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="page-container">
            <h1 className="page-title">Thêm Sách</h1>
            <div className="content-wrapper">
                {/* Form nhập thông tin đầu sách */}
                {!showBookForm && !showSuccessMessage && (
                    <div>
                        <div className="form-row-tsm">
                            <label>Mã Sách Mới:</label>
                            <input type="text" value={maSachMoi} disabled />
                        </div>
                        <div className="form-row-tsm">
                            <label>Tên Sách:</label>
                            <input type="text" value={tenSach} onChange={e => setTenSach(e.target.value)} />
                        </div>
                        <div className="form-row-tsm">
                            <label>Tên Tác Giả:</label>
                            <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
                                <div className="authors-input-container-tsm">
                                    <div className="selected-authors-tsm">
                                        {tenTacGia.map((author, index) => (
                                            <span key={index} className="author-tag-tsm">
                                                {author.TenTG}
                                                <button
                                                    className="remove-author-chip-tsm"
                                                    onClick={() => {
                                                        setTenTacGia(tenTacGia.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={newTacGia}
                                        onChange={(e) => setNewTacGia(e.target.value)}
                                        placeholder={tenTacGia.length === 0 ? "Chọn tác giả" : ""}
                                        className="author-input-tsm"
                                        onClick={() => setShowTacGiaDropdown(true)}
                                    />
                                </div>
                                {showTacGiaDropdown && (
                                    <div className="dropdown-container-tsm">
                                        {allTacGia
                                            .filter(tg => {
                                                const searchTerm = (newTacGia || '').toLowerCase();
                                                return tg?.TenTG?.toLowerCase().includes(searchTerm) &&
                                                    !tenTacGia.some(selected => selected.MaTG === tg.MaTG);
                                            })
                                            .map((tg, idx) => (
                                                <div
                                                    key={idx}
                                                    className="dropdown-item-tsm"
                                                    onMouseDown={() => {
                                                        setTenTacGia([...tenTacGia, tg]);
                                                        setNewTacGia('');
                                                        setShowTacGiaDropdown(false);
                                                    }}
                                                >
                                                    {tg.TenTG}
                                                </div>
                                            ))}
                                        <div
                                            className="dropdown-add-button-tsm"
                                            onMouseDown={() => {
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
                            <label>Thể Loại:</label>
                            <div style={{ position: 'relative', width: '100%' }} ref={genreDropdownRef}>
                                <div className="authors-input-container-tsm">
                                    <div className="selected-authors-tsm">
                                        {theLoai.map((genre, index) => (
                                            <span key={index} className="author-tag-tsm">
                                                {genre.TenTheLoai}
                                                <button
                                                    className="remove-author-chip-tsm"
                                                    onClick={() => {
                                                        setTheLoai(theLoai.filter((_, i) => i !== index));
                                                    }}
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
                                    />
                                </div>
                                {showTheLoaiDropdown && (
                                    <div className="dropdown-container-tsm">
                                        {allTheLoai
                                            .filter(tl => {
                                                const searchTerm = (newTheLoai || '').toLowerCase();
                                                return tl?.TenTheLoai?.toLowerCase().includes(searchTerm) &&
                                                    !theLoai.some(selected => selected.MaTheLoai === tl.MaTheLoai);
                                            })
                                            .map((tl, idx) => (
                                                <div
                                                    key={idx}
                                                    className="dropdown-item-tsm"
                                                    onMouseDown={() => {
                                                        setTheLoai([...theLoai, tl]);
                                                        setNewTheLoai('');
                                                        setShowTheLoaiDropdown(false);
                                                    }}
                                                >
                                                    {tl.TenTheLoai}
                                                </div>
                                            ))}
                                        <div
                                            className="dropdown-add-button-tsm"
                                            onMouseDown={() => {
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
                            <label>Nhà Xuất Bản:</label>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <div className="authors-input-container-tsm">
                                    <div className="selected-authors-tsm">
                                        {selectedNXB.map((pub, index) => (
                                            <span key={index} className="author-tag-tsm">
                                                {pub.TenNXB}
                                                <button
                                                    className="remove-author-chip-tsm"
                                                    onClick={() => setSelectedNXB([])}
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
                                        placeholder={selectedNXB.length === 0 ? "Chọn nhà xuất bản" : ""}
                                        className="author-input-tsm"
                                        onClick={() => setShowNXBDropdown(true)}
                                    />
                                </div>
                                {showNXBDropdown && (
                                    <div className="dropdown-container-tsm">
                                        {allNXB
                                            .filter(nxb => {
                                                const searchTerm = (newNXB || '').toLowerCase();
                                                return nxb?.TenNXB?.toLowerCase().includes(searchTerm) &&
                                                    !selectedNXB.some(selected => selected.MaNXB === nxb.MaNXB);
                                            })
                                            .map((nxb, idx) => (
                                                <div
                                                    key={idx}
                                                    className="dropdown-item-tsm"
                                                    onMouseDown={() => {
                                                        setSelectedNXB([nxb]);
                                                        setNewNXB('');
                                                        setShowNXBDropdown(false);
                                                        setNhaXuatBan(nxb.TenNXB);
                                                    }}
                                                >
                                                    {nxb.TenNXB}
                                                </div>
                                            ))}
                                        <div
                                            className="dropdown-add-button-tsm"
                                            onMouseDown={() => {
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
                            <label>Năm Xuất Bản:</label>
                            <input
                                type="text"
                                value={namXuatBan}
                                onChange={e => setNamXuatBan(e.target.value)}
                                placeholder="Nhập năm xuất bản"
                            />
                        </div>
                        {message && (
                            <div style={{
                                color: message.includes('thành công') ? 'green' : 'red',
                                marginTop: 8
                            }}>
                                {message}
                            </div>
                        )}
                        <button className="button-tsm" onClick={handleSubmit}>Thêm Sách</button>
                    </div>
                )}

                {/* Modal xác nhận thêm đầu sách */}
                {showCreateDauSach && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Thông Tin Đầu Sách Mới</h2>
                            <div>Tên Sách: {tenSach}</div>
                            <div>Tên Tác Giả: {tenTacGia.map(author => author.TenTG).join(', ')}</div>
                            <div>Thể Loại: {theLoai.map(genre => genre.TenTheLoai).join(', ')}</div>
                            <div className="modal-buttons-container-tsm">
                                <button className="button-tsm" onClick={handleAddDauSach}>Thêm</button>
                                <button className="button-tsm cancel-button-tsm" onClick={handleCancelCreateDauSach}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form nhập thông tin sách mới */}
                {showBookForm && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Thông Tin Sách Mới</h2>
                            <div className="form-row-tsm">
                                <label>Mã Sách:</label>
                                <input type="text" value={maSachMoi} disabled />
                            </div>
                            <div className="form-row-tsm">
                                <label>Tên Sách:</label>
                                <input type="text" value={tenSach} disabled />
                            </div>
                            <div className="form-row-tsm">
                                <label>Nhà Xuất Bản:</label>
                                <input
                                    type="text"
                                    value={nhaXuatBan}
                                    onChange={e => setNhaXuatBan(e.target.value)}
                                    placeholder="Nhập tên nhà xuất bản"
                                />
                            </div>
                            <div className="form-row-tsm">
                                <label>Năm Xuất Bản:</label>
                                <input
                                    type="text"
                                    value={namXuatBan}
                                    onChange={e => setNamXuatBan(e.target.value)}
                                    placeholder="Nhập năm xuất bản"
                                />
                            </div>
                            {message && <div className="message-tsm">{message}</div>}
                            <div className="modal-buttons-container-tsm">
                                <button className="button-tsm" onClick={handleSaveBook}>Lưu</button>
                                <button className="button-tsm cancel-button-tsm" onClick={() => setShowBookForm(false)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Thông báo thành công */}
                {showSuccessMessage && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="success-modal-tsm">
                            <div className="success-icon">✓</div>
                            <h2>Thêm Sách Thành Công!</h2>
                        </div>
                    </div>
                )}

                {showAddTacGiaInput && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm" ref={modalRef}>
                            <h2>Thêm Tác Giả Mới</h2>
                            <div className="modal-content-tsm">
                                <input
                                    type="text"
                                    placeholder="Nhập tên tác giả mới"
                                    value={newTacGia}
                                    onChange={e => setNewTacGia(e.target.value)}
                                    className="modal-input-tsm"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-buttons-container-tsm">
                                <button
                                    onClick={() => {
                                        if (newTacGia.trim()) {
                                            setShowConfirmAddAuthor(true);
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Thêm
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddTacGiaInput(false);
                                        setNewTacGia('');
                                    }}
                                    className="cancel-button-tsm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmAddAuthor && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Xác nhận thêm tác giả</h2>
                            <p>Bạn có chắc muốn thêm tác giả "{newTacGia}" không?</p>
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={() => {
                                        if (newTacGia.trim() && !allTacGia.some(tg => tg.TenTG.toLowerCase() === newTacGia.trim().toLowerCase())) {
                                            handleAddAuthorSuccess(newTacGia.trim());
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Có
                                </button>
                                <button
                                    onClick={() => setShowConfirmAddAuthor(false)}
                                    style={{ background: '#6c757d' }}
                                >
                                    Không
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddTheLoaiInput && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm" ref={modalRef}>
                            <h2>Thêm Thể Loại Mới</h2>
                            <div className="modal-content-tsm">
                                <input
                                    type="text"
                                    placeholder="Nhập tên thể loại mới"
                                    value={newTheLoai}
                                    onChange={e => setNewTheLoai(e.target.value)}
                                    className="modal-input-tsm"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-buttons-container-tsm">
                                <button
                                    onClick={() => {
                                        if (newTheLoai.trim()) {
                                            setShowConfirmAddGenre(true);
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Thêm
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddTheLoaiInput(false);
                                        setNewTheLoai('');
                                    }}
                                    className="cancel-button-tsm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmAddGenre && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Xác nhận thêm thể loại</h2>
                            <p>Bạn có chắc muốn thêm thể loại "{newTheLoai}" không?</p>
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={() => {
                                        if (newTheLoai.trim() && !allTheLoai.some(tl => tl.TenTheLoai.toLowerCase() === newTheLoai.trim().toLowerCase())) {
                                            handleAddGenreSuccess(newTheLoai.trim());
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Có
                                </button>
                                <button
                                    onClick={() => setShowConfirmAddGenre(false)}
                                    style={{ background: '#6c757d' }}
                                >
                                    Không
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddNXBInput && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Thêm Nhà Xuất Bản Mới</h2>
                            <div className="modal-content-tsm">
                                <input
                                    type="text"
                                    placeholder="Nhập tên nhà xuất bản mới"
                                    value={newNXB}
                                    onChange={e => setNewNXB(e.target.value)}
                                    className="modal-input-tsm"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-buttons-container-tsm">
                                <button
                                    onClick={() => {
                                        if (newNXB.trim()) {
                                            setShowConfirmAddPublisher(true);
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Thêm
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddNXBInput(false);
                                        setNewNXB('');
                                    }}
                                    className="cancel-button-tsm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmAddPublisher && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Xác nhận thêm nhà xuất bản</h2>
                            <p>Bạn có chắc muốn thêm nhà xuất bản "{newNXB}" không?</p>
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={() => {
                                        if (newNXB.trim() && !allNXB.some(nxb => nxb.TenNXB.toLowerCase() === newNXB.trim().toLowerCase())) {
                                            handleAddPublisherSuccess(newNXB.trim());
                                        }
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Có
                                </button>
                                <button
                                    onClick={() => setShowConfirmAddPublisher(false)}
                                    style={{ background: '#6c757d' }}
                                >
                                    Không
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