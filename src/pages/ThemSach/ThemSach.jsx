import React, { useState, useEffect } from 'react';
import '../../styles/PathStyles.css';
import './ThemSach.css';
import themSachApi from '../../services/themSachApi';

function ThemSach() {
    const [step, setStep] = useState(1);
    const [maSachMoi, setMaSachMoi] = useState('');
    const [tenSach, setTenSach] = useState('');
    const [tenTacGia, setTenTacGia] = useState([]); // array of selected author objects
    const [theLoai, setTheLoai] = useState([]); // array of selected genres
    const [maDauSach, setMaDauSach] = useState('');
    const [showCreateDauSach, setShowCreateDauSach] = useState(false);
    const [message, setMessage] = useState('');
    const [nhaXuatBan, setNhaXuatBan] = useState('');
    const [namXuatBan, setNamXuatBan] = useState('');
    const [dauSachTonTai, setDauSachTonTai] = useState(null);

    // Danh sách tác giả và thể loại
    const [allTacGia, setAllTacGia] = useState([]); // array of all author objects
    const [allTheLoai, setAllTheLoai] = useState([]);
    const [newTacGia, setNewTacGia] = useState('');
    const [newTheLoai, setNewTheLoai] = useState('');
    const [showTacGiaDropdown, setShowTacGiaDropdown] = useState(false);
    const [showTheLoaiDropdown, setShowTheLoaiDropdown] = useState(false);
    const [showAddTacGiaInput, setShowAddTacGiaInput] = useState(false); // Trạng thái hiển thị ô nhập tác giả mới
    const [showAddTheLoaiInput, setShowAddTheLoaiInput] = useState(false); // Trạng thái hiển thị ô nhập thể loại mới
    const [showConfirmAddAuthor, setShowConfirmAddAuthor] = useState(false);
    const [showConfirmAddGenre, setShowConfirmAddGenre] = useState(false);

    // Lấy mã sách mới tự động và danh sách tác giả/thể loại
    useEffect(() => {
        async function fetchInit() {
            try {
                const books = await themSachApi.getAllBooks();
                let maxMaSach = 0;
                books.forEach(book => {
                    const num = parseInt((book.MaSach || '').replace(/^S/, ''), 10);
                    if (!isNaN(num) && num > maxMaSach) maxMaSach = num;
                });
                setMaSachMoi('S' + (maxMaSach + 1).toString().padStart(3, '0'));

                // Lấy danh sách tác giả trực tiếp từ bảng tác giả
                const authors = await themSachApi.getAllAuthors();
                if (Array.isArray(authors)) {
                    setAllTacGia(authors);
                } else {
                    setAllTacGia([]);
                    console.error('Authors data is not an array:', authors);
                }

                // Fetch genres directly from theloai table
                const genres = await themSachApi.getAllGenres();
                if (Array.isArray(genres)) {
                    setAllTheLoai(genres);
                } else {
                    setAllTheLoai([]);
                    console.error('Genres data is not an array:', genres);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Có lỗi khi tải dữ liệu');
            }
        }
        fetchInit();
    }, []);

    // Xử lý chọn nhiều tác giả/thể loại
    const handleTacGiaChange = (e) => {
        const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setTenTacGia(options);
    };
    const handleTheLoaiChange = (e) => {
        const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setTheLoai(options);
    };

    // Thêm tác giả mới vào danh sách
    const handleAddTacGia = () => {
        const value = newTacGia.trim();
        if (value && !allTacGia.includes(value)) {
            setAllTacGia([...allTacGia, value]);
            setTenTacGia([...tenTacGia, value]);
            setNewTacGia('');
        }
    };
    // Thêm thể loại mới vào danh sách
    const handleAddTheLoai = () => {
        const value = newTheLoai.trim();
        if (value && !allTheLoai.includes(value)) {
            setAllTheLoai([...allTheLoai, value]);
            setTheLoai([...theLoai, value]);
            setNewTheLoai('');
        }
    };

    // Bước 1: Nhập thông tin cơ bản
    const handleNext = async () => {
        if (!tenSach || tenTacGia.length === 0 || theLoai.length === 0) {
            setMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        setMessage('');

        // Kiểm tra đầu sách đã tồn tại chưa
        const dauSachList = await themSachApi.getAllDauSach();
        const found = dauSachList.find(ds =>
            ds.TenSach.trim().toLowerCase() === tenSach.trim().toLowerCase() &&
            // So sánh tác giả: chuyển cả hai mảng về dạng tên và so sánh
            ds.TenTacGia.sort().join(',').toLowerCase() ===
            tenTacGia.map(tg => tg.TenTG).sort().join(',').toLowerCase() &&
            // So sánh thể loại
            ds.TenTheLoai.toLowerCase() === theLoai[0].TenTheLoai.toLowerCase()
        );

        if (found) {
            setMaDauSach(found.MaDauSach);
            setDauSachTonTai(found);
            setStep(2);
        } else {
            setShowCreateDauSach(true);
        }
    };

    // Thêm đầu sách mới
    const handleAddDauSach = async () => {
        try {
            const newDauSach = {
                TenSach: tenSach,
                TenTacGia: tenTacGia, // Mảng các object tác giả đã chọn
                TheLoai: theLoai // Mảng các object thể loại đã chọn
            };
            const result = await themSachApi.addDauSach(newDauSach);
            setMaDauSach(result.MaDauSach);
            setShowCreateDauSach(false);
            setMessage('Đã thêm đầu sách mới thành công!');
            setStep(2);
        } catch (error) {
            console.error('Error adding dau sach:', error);
            setMessage('Có lỗi khi thêm đầu sách!');
        }
    };

    // Bước 2: Nhập NXB và năm XB, thêm sách mới
    const handleAddBook = async () => {
        if (!nhaXuatBan || !namXuatBan) {
            setMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        setMessage('');
        const newBook = {
            MaSach: maSachMoi,
            MaDauSach: maDauSach,
            TenDauSach: tenSach,
            NXB: nhaXuatBan,
            NamXB: namXuatBan,
            SLTon: 0
        };
        await themSachApi.addBook(newBook);
        setMessage('Sách mới đã được thêm!');
        // Reset form hoặc chuyển hướng nếu muốn
    };

    const handleCancelCreateDauSach = () => {
        setShowCreateDauSach(false);
    };

    // Add new ref for click outside handling
    const dropdownRef = React.useRef(null);
    // Add new ref for modal
    const modalRef = React.useRef(null);
    const genreDropdownRef = React.useRef(null);

    // Modify useEffect to handle dropdown clicks
    useEffect(() => {
        function handleClickOutside(event) {
            // Check if click is outside the dropdown container
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTacGiaDropdown(false);
            }
            // Keep existing modal click handler
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

    // Modify the success handler for adding author
    const handleAddAuthorSuccess = async (newAuthorName) => {
        try {
            const newAuthor = await themSachApi.addAuthor(newAuthorName);
            setAllTacGia([...allTacGia, newAuthor]);
            setTenTacGia([...tenTacGia, newAuthor]);
            setNewTacGia('');
            setShowConfirmAddAuthor(false);
            setShowAddTacGiaInput(false);
            setMessage(`Đã thêm tác giả "${newAuthor.TenTG}" thành công!`);
            setShowTacGiaDropdown(true); // Show dropdown after adding

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error adding author:', error);
            setMessage('Có lỗi khi thêm tác giả!');
        }
    };

    // Add success handler for genres
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

            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error adding genre:', error);
            setMessage('Có lỗi khi thêm thể loại!');
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Thêm Sách</h1>
            <div className="content-wrapper">
                {step === 1 && (
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
                                                    onClick={(e) => {
                                                        e.preventDefault();
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
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent click from propagating
                                            setShowTacGiaDropdown(true);
                                        }}
                                    />
                                </div>

                                {showTacGiaDropdown && ( // Change from className conditional to conditional rendering
                                    <div className="dropdown-container-tsm">
                                        {allTacGia
                                            .filter(tg => {
                                                const searchTerm = (newTacGia || '').toLowerCase();
                                                return tg &&
                                                    tg.TenTG &&
                                                    tg.TenTG.toLowerCase().includes(searchTerm) &&
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
                                            onMouseDown={(e) => {
                                                e.preventDefault();
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
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setTheLoai(theLoai.filter((_, i) => i !== index));
                                                    }}
                                                >×</button>
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
                                                return tl &&
                                                    tl.TenTheLoai &&
                                                    tl.TenTheLoai.toLowerCase().includes(searchTerm) &&
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
                        {message && <div style={{ color: 'red', marginTop: 8 }}>{message}</div>}
                        <button className="button-tsm" onClick={handleNext}>Tiếp theo</button>
                    </div>
                )}

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

                {step === 2 && (
                    <div>
                        <div className="form-row-tsm">
                            <label>Nhà Xuất Bản:</label>
                            <input type="text" value={nhaXuatBan} onChange={e => setNhaXuatBan(e.target.value)} />
                        </div>
                        <div className="form-row-tsm">
                            <label>Năm Xuất Bản:</label>
                            <input type="text" value={namXuatBan} onChange={e => setNamXuatBan(e.target.value)} />
                        </div>
                        {message && <div style={{ color: 'red', marginTop: 8 }}>{message}</div>}
                        <button className="button-tsm" onClick={handleAddBook}>Thêm</button>
                        <button className="button-tsm cancel-button-tsm" onClick={() => setStep(1)}>Hủy</button>
                    </div>
                )}

                {/* Modal thêm tác giả mới */}
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

                {/* Modal xác nhận thêm tác giả */}
                {showConfirmAddAuthor && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Xác nhận thêm tác giả</h2>
                            <p>Bạn có chắc muốn thêm tác giả "{newTacGia}" không?</p>
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={async () => {
                                        if (newTacGia.trim() && !allTacGia.includes(newTacGia.trim())) {
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

                {/* Modal thêm thể loại mới */}
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

                {/* Modal xác nhận thêm thể loại */}
                {showConfirmAddGenre && (
                    <div className="modal-overlay-them-sach-tsm">
                        <div className="modal-them-sach-tsm">
                            <h2>Xác nhận thêm thể loại</h2>
                            <p>Bạn có chắc muốn thêm thể loại "{newTheLoai}" không?</p>
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={async () => {
                                        if (newTheLoai.trim() && !allTheLoai.includes(newTheLoai.trim())) {
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
            </div>
        </div>
    );
}

export default ThemSach;