import React, { useState, useEffect } from 'react';
import { tatCaSachApi } from '../../services/tatCaSachApi';
import '../../styles/PathStyles.css';
import './TatCaSach.css';

function TatCaSach() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
    const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
    const [isYearModalOpen, setIsYearModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [authorSearchTerm, setAuthorSearchTerm] = useState('');
    const [genreSearchTerm, setGenreSearchTerm] = useState('');
    const [publisherSearchTerm, setPublisherSearchTerm] = useState('');
    const [yearStart, setYearStart] = useState('');
    const [yearEnd, setYearEnd] = useState('');
    const [specificYears, setSpecificYears] = useState('');
    const [stockMin, setStockMin] = useState('');
    const [stockMax, setStockMax] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [specificPrices, setSpecificPrices] = useState('');
    const [tempSelectedYears, setTempSelectedYears] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedStocks, setSelectedStocks] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [yearSearchTerm, setYearSearchTerm] = useState('');
    const [tempSelectedAuthors, setTempSelectedAuthors] = useState([]);
    const [tempSelectedGenres, setTempSelectedGenres] = useState([]);
    const [tempSelectedPublishers, setTempSelectedPublishers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    const [specificStocks, setSpecificStocks] = useState('');
    const [books, setBooks] = useState([]);
    const [allAuthors, setAllAuthors] = useState([]); // Add new state
    const booksPerPage = 10;
    const [pageInput, setPageInput] = useState(currentPage);
    const handlePageInputChange = (e) => {
    let value = e.target.value;
    setPageInput(value);
    };

    const handlePageSubmit = (e) => {
    e.preventDefault();
    let pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    } else {
        setPageInput(currentPage);
    }
    };

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sachList, dauSachList, tacGiaList, theLoaiList, ctNhapSachList, thamSoList, authorsList] = await Promise.all([
                    tatCaSachApi.fetchAllBooks(),
                    tatCaSachApi.fetchAllTitles(),
                    tatCaSachApi.fetchAllAuthors(),
                    tatCaSachApi.fetchAllCategories(),
                    tatCaSachApi.fetchAllCTNhapSach(),
                    tatCaSachApi.fetchThamSo(),
                    tatCaSachApi.getTacGia() // Add new API call
                ]);

                const thamSo = thamSoList[0];

                const booksData = sachList.map(sach => {
                    const dauSach = dauSachList.find(ds => ds.MaDauSach === sach.MaDauSach);
                    let tacGia = dauSach ? (Array.isArray(dauSach.TenTacGia) ? dauSach.TenTacGia.join(', ') : dauSach.TenTacGia) : '';

                    // Remove duplicate declaration of ctNhapSach
                    const latestCtNhapSach = [...ctNhapSachList]
                        .filter(ct => ct.MaSach === sach.MaSach)
                        .sort((a, b) => b.MaPhieuNhap.localeCompare(a.MaPhieuNhap))[0];

                    const giaNhap = latestCtNhapSach ? parseInt(latestCtNhapSach.GiaNhap) : 0;
                    const donGiaBan = thamSo ? Math.round(giaNhap * parseFloat(thamSo.TiLe)) : 0;

                    return {
                        maSach: sach.MaSach,
                        maDauSach: sach.MaDauSach,
                        tenSach: dauSach ? dauSach.TenSach : '',
                        tacGia: tacGia,
                        theLoai: dauSach ? dauSach.TenTheLoai : '',
                        nhaXuatBan: sach.TenNXB,
                        namXuatBan: sach.NamXB,
                        soLuongTon: sach.SLTon,
                        donGiaBan: donGiaBan
                    };
                });
                setBooks(booksData);
                setAllAuthors(authorsList); // Store authors from API
            } catch (error) {
                console.error('Error fetching data:', error);
                setBooks([]);
                alert('Có lỗi khi tải dữ liệu!');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setPageInput(currentPage);
    }, [currentPage]);

    // Replace authors const with filtered API data
    const filteredAuthors = allAuthors
        .filter(author => author?.TenTG?.toLowerCase().includes(authorSearchTerm?.toLowerCase() || ''))
        .sort((a, b) => {
            if (!a || !b) return 0;
            const isSelectedA = tempSelectedAuthors.includes(a.TenTG);
            const isSelectedB = tempSelectedAuthors.includes(b.TenTG);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a.TenTG.localeCompare(b.TenTG);
        });

    const genres = [...new Set(books.map(book => book.theLoai).filter(Boolean))];
    const publishers = [...new Set(books.map(book => book.nhaXuatBan).filter(Boolean))];
    const years = [...new Set(books.map(book => book.namXuatBan).filter(Boolean))];

    const filteredGenres = genres
        .filter(genre => genre.toLowerCase().includes(genreSearchTerm.toLowerCase()))
        .sort((a, b) => {
            const isSelectedA = tempSelectedGenres.includes(a);
            const isSelectedB = tempSelectedGenres.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a.localeCompare(b);
        });

    const filteredPublishers = publishers
        .filter(publisher => publisher.toLowerCase().includes(publisherSearchTerm.toLowerCase()))
        .sort((a, b) => {
            const isSelectedA = tempSelectedPublishers.includes(a);
            const isSelectedB = tempSelectedPublishers.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a.localeCompare(b);
        });

    const filteredYears = years
        .filter(year => year.toString().includes(yearSearchTerm))
        .sort((a, b) => {
            const isSelectedA = tempSelectedYears.includes(a);
            const isSelectedB = tempSelectedYears.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a - b;
        });

    const filteredBooks = books.filter(
        book =>
            (book?.maSach?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
                book?.tenSach?.toLowerCase().includes(searchTerm?.toLowerCase() || '')) &&
            // Changed author filtering to check if any selected author is in book's author list
            (selectedAuthors.length === 0 ||
                selectedAuthors.some(selectedAuthor =>
                    book.tacGia.split(', ').some(author =>
                        author.toLowerCase().includes(selectedAuthor.toLowerCase())
                    )
                )) &&
            (selectedGenres.length === 0 || selectedGenres.includes(book.theLoai)) &&
            (selectedPublishers.length === 0 || selectedPublishers.includes(book.nhaXuatBan)) &&
            (selectedYears.length === 0 || selectedYears.includes(book.namXuatBan)) &&
            (selectedStocks.length === 0 || selectedStocks.includes(book.soLuongTon)) &&
            (selectedPrices.length === 0 || selectedPrices.includes(book.donGiaBan))
    );

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSelection = (item, setTempSelected) => {
        if (Array.isArray(item)) {
            setTempSelected(item);
        } else if (typeof item === 'object') {
            // Handle author object from API
            setTempSelected(prev =>
                prev.includes(item.TenTG) ? prev.filter(i => i !== item.TenTG) : [...prev, item.TenTG]
            );
        } else {
            setTempSelected(prev =>
                prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
            );
        }
    };

    const handlePublisherSelection = (publisher) => {
        setTempSelectedPublishers([publisher]); // Replace array instead of adding/removing
    };

    const applyFilter = (setSelected, tempSelected, setModalOpen) => {
        setSelected(tempSelected);
        setModalOpen(false);
    };

    const cancelFilter = (setTempSelected, setSelected, setModalOpen) => {
        setTempSelected([]);
        setSelected([]);
        setModalOpen(false);
    };

    const applyYearFilter = () => {
        const rangeYears = [];
        if (yearStart && yearEnd) {
            for (let year = parseInt(yearStart); year <= parseInt(yearEnd); year++) {
                rangeYears.push(year);
            }
        }

        const specificYearList = specificYears
            .split(',')
            .map(year => parseInt(year.trim()))
            .filter(year => !isNaN(year));

        const combinedYears = [...new Set([...rangeYears, ...specificYearList])];
        setSelectedYears(combinedYears);
        setIsYearModalOpen(false);
    };

    const cancelYearFilter = () => {
        setYearStart('');
        setYearEnd('');
        setSpecificYears('');
        setSelectedYears([]);
        setIsYearModalOpen(false);
    };

    const applyStockFilter = () => {
        const stockRange = [];
        if (stockMin && stockMax) {
            for (let stock = parseInt(stockMin); stock <= parseInt(stockMax); stock++) {
                stockRange.push(stock);
            }
        }

        const specificStockList = specificStocks
            .split(',')
            .map(stock => parseInt(stock.trim()))
            .filter(stock => !isNaN(stock));

        const combinedStocks = [...new Set([...stockRange, ...specificStockList])];
        setSelectedStocks(combinedStocks);
        setIsStockModalOpen(false);
    };

    const cancelStockFilter = () => {
        setStockMin('');
        setStockMax('');
        setSpecificStocks('');
        setSelectedStocks([]);
        setIsStockModalOpen(false);
    };

    const applyPriceFilter = () => {
        const priceRange = [];
        if (priceMin && priceMax) {
            for (let price = parseInt(priceMin); price <= parseInt(priceMax); price++) {
                priceRange.push(price);
            }
        }

        const specificPriceList = specificPrices
            .split(',')
            .map(price => parseInt(price.trim()))
            .filter(price => !isNaN(price));

        const combinedPrices = [...new Set([...priceRange, ...specificPriceList])];
        setSelectedPrices(combinedPrices);
        setIsPriceModalOpen(false);
    };

    const cancelPriceFilter = () => {
        setPriceMin('');
        setPriceMax('');
        setSpecificPrices('');
        setSelectedPrices([]);
        setIsPriceModalOpen(false);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Tất Cả Sách</h1>
            <div className="content-wrapper">

                {/* Search Bar */}
                <div className="search-filter-block-tcs">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách theo mã hoặc tên sách"
                        className="search-bar-tcs"
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <button
                        className={`filter-button-tcs ${selectedAuthors.length > 0 ? 'active-filter-tcs' : ''}`}
                        onClick={() => setIsAuthorModalOpen(true)}
                    >
                        Lọc theo tác giả
                    </button>
                    <button
                        className={`filter-button-tcs ${selectedGenres.length > 0 ? 'active-filter-tcs' : ''}`}
                        onClick={() => setIsGenreModalOpen(true)}
                    >
                        Lọc theo thể loại
                    </button>                    <button
                        className={`filter-button-tcs ${selectedPublishers.length > 0 ? 'active-filter-tcs' : ''}`}
                        onClick={() => setIsPublisherModalOpen(true)}
                    >
                        Lọc theo nhà xuất bản
                    </button>
                    <button
                        className={`filter-button-tcs ${selectedYears.length > 0 ? 'active-filter-tcs' : ''}`}
                        onClick={() => setIsYearModalOpen(true)}
                    >
                        Lọc theo năm xuất bản
                    </button>
                    <button
                        className={`filter-button-tcs ${selectedStocks.length > 0 ? 'active-filter-tcs' : ''}`}
                        onClick={() => setIsStockModalOpen(true)}
                    >
                        Lọc theo số lượng tồn
                    </button>
                    <button
                        className={`filter-button-tcs ${selectedPrices.length > 0 ? 'active-filter-tcs' : ''}`}
                        onClick={() => setIsPriceModalOpen(true)}
                    >
                        Lọc theo đơn giá bán
                    </button>
                </div>

                {/* Author Modal */}
                {isAuthorModalOpen && (
                    <div className="modal-overlay-tcs">
                        <div className="modal-new-tcs">
                            <h2 className="modal-title-new-tcs">Lọc theo tác giả</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tác giả"
                                className="author-search-bar-tcs"
                                value={authorSearchTerm}
                                onChange={e => setAuthorSearchTerm(e.target.value)}
                            />
                            <div className="author-list-tcs">
                                {filteredAuthors.map(author => (
                                    <div
                                        key={author.MaTG}
                                        className={`author-item-tcs ${tempSelectedAuthors.includes(author.TenTG) ? 'selected-tcs' : ''}`}
                                        onClick={() => handleSelection(author, setTempSelectedAuthors)}
                                    >
                                        {author.TenTG}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-buttons-tcs">
                                <button
                                    className="apply-button-tcs"
                                    onClick={() => applyFilter(setSelectedAuthors, tempSelectedAuthors, setIsAuthorModalOpen)}
                                >
                                    Áp Dụng
                                </button>
                                <button
                                    className="cancel-button-new-tcs"
                                    onClick={() => cancelFilter(setTempSelectedAuthors, setSelectedAuthors, setIsAuthorModalOpen)}
                                >
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new-tcs"
                                    onClick={() => setIsAuthorModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Genre Modal */}
                {isGenreModalOpen && (
                    <div className="modal-overlay-tcs">
                        <div className="modal-new-tcs">
                            <h2 className="modal-title-new-tcs">Lọc theo thể loại</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm thể loại"
                                className="author-search-bar-tcs"
                                value={genreSearchTerm}
                                onChange={e => setGenreSearchTerm(e.target.value)}
                            />
                            <div className="author-list-tcs">
                                {filteredGenres.map(genre => (
                                    <div
                                        key={genre}
                                        className={`author-item-tcs ${tempSelectedGenres.includes(genre) ? 'selected-tcs' : ''}`}
                                        onClick={() => handleSelection(genre, setTempSelectedGenres)}
                                    >
                                        {genre}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-buttons-tcs">
                                <button
                                    className="apply-button-tcs"
                                    onClick={() => applyFilter(setSelectedGenres, tempSelectedGenres, setIsGenreModalOpen)}
                                >
                                    Áp Dụng
                                </button>
                                <button
                                    className="cancel-button-new-tcs"
                                    onClick={() => cancelFilter(setTempSelectedGenres, setSelectedGenres, setIsGenreModalOpen)}
                                >
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new-tcs"
                                    onClick={() => setIsGenreModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Publisher Modal */}
                {isPublisherModalOpen && (
                    <div className="modal-overlay-tcs">
                        <div className="modal-new-tcs">
                            <h2 className="modal-title-new-tcs">Lọc theo nhà xuất bản</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhà xuất bản"
                                className="author-search-bar-tcs"
                                value={publisherSearchTerm}
                                onChange={e => setPublisherSearchTerm(e.target.value)}
                            />
                            <div className="author-list-tcs">
                                {filteredPublishers.map(publisher => (
                                    <div
                                        key={publisher}
                                        className={`author-item-tcs ${tempSelectedPublishers[0] === publisher ? 'selected-tcs' : ''}`}
                                        onClick={() => handlePublisherSelection(publisher)}
                                    >
                                        {publisher}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-buttons-tcs">
                                <button
                                    className="apply-button-tcs"
                                    onClick={() => applyFilter(setSelectedPublishers, tempSelectedPublishers, setIsPublisherModalOpen)}
                                >
                                    Áp Dụng
                                </button>
                                <button
                                    className="cancel-button-new-tcs"
                                    onClick={() => cancelFilter(setTempSelectedPublishers, setSelectedPublishers, setIsPublisherModalOpen)}
                                >
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new-tcs"
                                    onClick={() => setIsPublisherModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Year Modal */}
                {isYearModalOpen && (
                    <div className="modal-overlay-tcs">
                        <div className="modal-new-tcs">
                            <h2 className="modal-title-new-tcs">Lọc theo năm xuất bản</h2>
                            <div className="year-filter-inputs-tcs">
                                <h3>Nhập khoảng năm:</h3>
                                <div className="year-range-inputs-tcs">
                                    <input
                                        type="number"
                                        placeholder="Năm bắt đầu"
                                        value={yearStart}
                                        onChange={e => setYearStart(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Năm kết thúc"
                                        value={yearEnd}
                                        onChange={e => setYearEnd(e.target.value)}
                                    />
                                </div>
                                <h3>Nhập từng năm riêng lẻ:</h3>
                                <input
                                    type="text"
                                    placeholder="Các năm cách nhau bởi dấu phẩy"
                                    value={specificYears}
                                    onChange={e => setSpecificYears(e.target.value)}
                                />
                            </div>
                            <div className="modal-buttons-tcs">
                                <button className="apply-button-tcs" onClick={applyYearFilter}>
                                    Áp Dụng
                                </button>
                                <button className="cancel-button-new-tcs" onClick={cancelYearFilter}>
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new-tcs"
                                    onClick={() => setIsYearModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Modal */}
                {isStockModalOpen && (
                    <div className="modal-overlay-tcs">
                        <div className="modal-new-tcs">
                            <h2 className="modal-title-new-tcs">Lọc theo số lượng tồn</h2>
                            <div className="year-filter-inputs-tcs">
                                <h3>Nhập khoảng số lượng:</h3>
                                <div className="year-range-inputs-tcs">
                                    <input
                                        type="number"
                                        placeholder="Số lượng tối thiểu"
                                        value={stockMin}
                                        onChange={e => setStockMin(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Số lượng tối đa"
                                        value={stockMax}
                                        onChange={e => setStockMax(e.target.value)}
                                    />
                                </div>
                                <h3>Nhập từng số lượng riêng lẻ:</h3>
                                <input
                                    type="text"
                                    placeholder="Các số lượng cách nhau bởi dấu phẩy"
                                    value={specificStocks}
                                    onChange={e => setSpecificStocks(e.target.value)}
                                />
                            </div>
                            <div className="modal-buttons-tcs">
                                <button className="apply-button-tcs" onClick={applyStockFilter}>
                                    Áp Dụng
                                </button>
                                <button className="cancel-button-new-tcs" onClick={cancelStockFilter}>
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new-tcs"
                                    onClick={() => setIsStockModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Modal */}
                {isPriceModalOpen && (
                    <div className="modal-overlay-tcs">
                        <div className="modal-new-tcs">
                            <h2 className="modal-title-new-tcs">Lọc theo đơn giá bán</h2>
                            <div className="price-filter-inputs-tcs">
                                <h3>Nhập khoảng giá:</h3>
                                <div className="price-range-inputs-tcs">
                                    <input
                                        type="number"
                                        placeholder="Giá tối thiểu"
                                        value={priceMin}
                                        onChange={e => setPriceMin(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá tối đa"
                                        value={priceMax}
                                        onChange={e => setPriceMax(e.target.value)}
                                    />
                                </div>
                                <h3>Nhập từng giá riêng lẻ:</h3>
                                <input
                                    type="text"
                                    placeholder="Các giá cách nhau bởi dấu phẩy"
                                    value={specificPrices}
                                    onChange={e => setSpecificPrices(e.target.value)}
                                />
                            </div>
                            <div className="modal-buttons-tcs">
                                <button className="apply-button-tcs" onClick={applyPriceFilter}>
                                    Áp Dụng
                                </button>
                                <button className="cancel-button-new-tcs" onClick={cancelPriceFilter}>
                                    Hủy Áp Dụng
                                </button>
                                <button className="close-button-new-tcs" onClick={() => setIsPriceModalOpen(false)}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table of Books */}
                <div className="book-table-block-container-tcs">
                    <div className="book-table-block-tcs">
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Mã sách</th>
                                    <th>Mã đầu sách</th>
                                    <th>Tên sách</th>
                                    <th>Tác giả</th>
                                    <th>Thể loại</th>
                                    <th>NămXB</th>
                                    <th>Nhà xuất bản</th>
                                    <th>Tồn</th>
                                    <th>Đơn giá bán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBooks.map((book, index) => (
                                    <tr key={book.maSach}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{book.maSach}</td>
                                        <td>{book.maDauSach}</td>
                                        <td>{book.tenSach}</td>
                                        <td>{book.tacGia}</td>
                                        <td>{book.theLoai}</td>
                                        <td>{book.namXuatBan}</td>
                                        <td>{book.nhaXuatBan}</td>
                                        <td>{book.soLuongTon}</td>
                                        <td>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(book.donGiaBan).replace('₫', 'VNĐ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Buttons */}
                    <div className="pagination-buttons-tcs">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-buttons-tcs-button">
                            ←
                        </button>
                        <form onSubmit={handlePageSubmit} className="nhap-sach-page-input-form">
                            <span>Trang </span>
                            <input
                                type="number"
                                value={pageInput}
                                onChange={handlePageInputChange}
                                min="1"
                                max={totalPages}
                                className="nhap-sach-page-input"
                            />
                            <span>/{Math.max(1, totalPages)}</span>
                        </form>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-buttons-tcs-button">
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TatCaSach;