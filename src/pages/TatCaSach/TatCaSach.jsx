import React, { useState } from 'react';
import '../../styles/PathStyles.css';
import './TatCaSach.css';
import bookData from './BookData';

function TatCaSach() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
    const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
    const [isYearModalOpen, setIsYearModalOpen] = useState(false); // New modal state for year
    const [isStockModalOpen, setIsStockModalOpen] = useState(false); // New modal state for stock
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false); // New modal state for price
    const [authorSearchTerm, setAuthorSearchTerm] = useState('');
    const [genreSearchTerm, setGenreSearchTerm] = useState('');
    const [publisherSearchTerm, setPublisherSearchTerm] = useState('');
    const [yearStart, setYearStart] = useState(''); // Start year for range
    const [yearEnd, setYearEnd] = useState(''); // End year for range
    const [specificYears, setSpecificYears] = useState(''); // Specific years separated by commas
    const [stockMin, setStockMin] = useState(''); // Minimum stock
    const [stockMax, setStockMax] = useState(''); // Maximum stock
    const [priceMin, setPriceMin] = useState(''); // Minimum price
    const [priceMax, setPriceMax] = useState(''); // Maximum price
    const [specificPrices, setSpecificPrices] = useState(''); // Specific prices separated by commas
    const [tempSelectedYears, setTempSelectedYears] = useState([]); // Temporary selection for year
    const [selectedYears, setSelectedYears] = useState([]); // Final selection for year
    const [selectedStocks, setSelectedStocks] = useState([]); // Final selection for stock
    const [selectedPrices, setSelectedPrices] = useState([]); // Final selection for price
    const [yearSearchTerm, setYearSearchTerm] = useState('');
    const [tempSelectedAuthors, setTempSelectedAuthors] = useState([]); // Define missing variable
    const [tempSelectedGenres, setTempSelectedGenres] = useState([]); // Define missing variable
    const [tempSelectedPublishers, setTempSelectedPublishers] = useState([]); // Define missing variable
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Define missing variable
    const [selectedGenres, setSelectedGenres] = useState([]); // Define missing variable
    const [selectedPublishers, setSelectedPublishers] = useState([]); // Define missing variable
    const [specificStocks, setSpecificStocks] = useState(''); // Specific stock values separated by commas
    const booksPerPage = 10;

    const authors = [...new Set(bookData.map((book) => book.tacGia))];
    const genres = [...new Set(bookData.map((book) => book.theLoai))];
    const publishers = [...new Set(bookData.map((book) => book.nhaXuatBan))];
    const years = [...new Set(bookData.map((book) => book.namXuatBan))]; // Extract unique years

    const filteredAuthors = authors
        .filter((author) => author.toLowerCase().includes(authorSearchTerm.toLowerCase()))
        .sort((a, b) => {
            const isSelectedA = tempSelectedAuthors.includes(a);
            const isSelectedB = tempSelectedAuthors.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a.localeCompare(b);
        });

    const filteredGenres = genres
        .filter((genre) => genre.toLowerCase().includes(genreSearchTerm.toLowerCase()))
        .sort((a, b) => {
            const isSelectedA = tempSelectedGenres.includes(a);
            const isSelectedB = tempSelectedGenres.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a.localeCompare(b);
        });

    const filteredPublishers = publishers
        .filter((publisher) => publisher.toLowerCase().includes(publisherSearchTerm.toLowerCase()))
        .sort((a, b) => {
            const isSelectedA = tempSelectedPublishers.includes(a);
            const isSelectedB = tempSelectedPublishers.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a.localeCompare(b);
        });

    const filteredYears = years
        .filter((year) => year.toString().includes(yearSearchTerm))
        .sort((a, b) => {
            const isSelectedA = tempSelectedYears.includes(a);
            const isSelectedB = tempSelectedYears.includes(b);
            if (isSelectedA && !isSelectedB) return -1;
            if (!isSelectedA && isSelectedB) return 1;
            return a - b; // Sort numerically
        });

    const filteredBooks = bookData.filter(
        (book) =>
            (book.maSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.tenSach.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedAuthors.length === 0 || selectedAuthors.includes(book.tacGia)) &&
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
        setTempSelected((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
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
            .map((year) => parseInt(year.trim()))
            .filter((year) => !isNaN(year));

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
            .map((stock) => parseInt(stock.trim()))
            .filter((stock) => !isNaN(stock));

        const combinedStocks = [...new Set([...stockRange, ...specificStockList])];
        setSelectedStocks(combinedStocks);
        setIsStockModalOpen(false);
    };

    const cancelStockFilter = () => {
        setStockMin('');
        setStockMax('');
        setSpecificStocks(''); // Clear specific stock input
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
            .map((price) => parseInt(price.trim()))
            .filter((price) => !isNaN(price));

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
            <div className="content-container">
                {/* Search Bar */}
                <div className="search-filter-block">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách theo mã hoặc tên sách"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to the first page when searching
                        }}
                    />
                    <button
                        className={`filter-button ${selectedAuthors.length > 0 ? 'active-filter' : ''
                            }`}
                        onClick={() => setIsAuthorModalOpen(true)}
                    >
                        Lọc theo tác giả
                    </button>
                    <button
                        className={`filter-button ${selectedGenres.length > 0 ? 'active-filter' : ''
                            }`}
                        onClick={() => setIsGenreModalOpen(true)}
                    >
                        Lọc theo thể loại
                    </button>
                    <button
                        className={`filter-button ${selectedPublishers.length > 0 ? 'active-filter' : ''
                            }`}
                        onClick={() => setIsPublisherModalOpen(true)}
                    >
                        Lọc theo nhà xuất bản
                    </button>
                    <button
                        className={`filter-button ${selectedYears.length > 0 ? 'active-filter' : ''
                            }`}
                        onClick={() => setIsYearModalOpen(true)}
                    >
                        Lọc theo năm xuất bản
                    </button>
                    <button
                        className={`filter-button ${selectedStocks.length > 0 ? 'active-filter' : ''
                            }`}
                        onClick={() => setIsStockModalOpen(true)}
                    >
                        Lọc theo số lượng tồn
                    </button>
                    <button
                        className={`filter-button ${selectedPrices.length > 0 ? 'active-filter' : ''
                            }`}
                        onClick={() => setIsPriceModalOpen(true)}
                    >
                        Lọc theo đơn giá bán
                    </button>
                </div>

                {/* Author Modal */}
                {isAuthorModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-new">
                            <h2 className="modal-title-new">Lọc theo tác giả</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tác giả"
                                className="author-search-bar"
                                value={authorSearchTerm}
                                onChange={(e) => setAuthorSearchTerm(e.target.value)}
                            />
                            <div className="author-list">
                                {filteredAuthors.map((author) => (
                                    <div
                                        key={author}
                                        className={`author-item ${tempSelectedAuthors.includes(author) ? 'selected' : ''
                                            }`}
                                        onClick={() => handleSelection(author, setTempSelectedAuthors)}
                                    >
                                        {author}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-buttons">
                                <button
                                    className="apply-button"
                                    onClick={() =>
                                        applyFilter(setSelectedAuthors, tempSelectedAuthors, setIsAuthorModalOpen)
                                    }
                                >
                                    Áp Dụng
                                </button>
                                <button
                                    className="cancel-button-new"
                                    onClick={() =>
                                        cancelFilter(setTempSelectedAuthors, setSelectedAuthors, setIsAuthorModalOpen)
                                    }
                                >
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new"
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
                    <div className="modal-overlay">
                        <div className="modal-new">
                            <h2 className="modal-title-new">Lọc theo thể loại</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm thể loại"
                                className="author-search-bar"
                                value={genreSearchTerm}
                                onChange={(e) => setGenreSearchTerm(e.target.value)}
                            />
                            <div className="author-list">
                                {filteredGenres.map((genre) => (
                                    <div
                                        key={genre}
                                        className={`author-item ${tempSelectedGenres.includes(genre) ? 'selected' : ''
                                            }`}
                                        onClick={() => handleSelection(genre, setTempSelectedGenres)}
                                    >
                                        {genre}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-buttons">
                                <button
                                    className="apply-button"
                                    onClick={() =>
                                        applyFilter(setSelectedGenres, tempSelectedGenres, setIsGenreModalOpen)
                                    }
                                >
                                    Áp Dụng
                                </button>
                                <button
                                    className="cancel-button-new"
                                    onClick={() =>
                                        cancelFilter(setTempSelectedGenres, setSelectedGenres, setIsGenreModalOpen)
                                    }
                                >
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new"
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
                    <div className="modal-overlay">
                        <div className="modal-new">
                            <h2 className="modal-title-new">Lọc theo nhà xuất bản</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhà xuất bản"
                                className="author-search-bar"
                                value={publisherSearchTerm}
                                onChange={(e) => setPublisherSearchTerm(e.target.value)}
                            />
                            <div className="author-list">
                                {filteredPublishers.map((publisher) => (
                                    <div
                                        key={publisher}
                                        className={`author-item ${tempSelectedPublishers.includes(publisher) ? 'selected' : ''
                                            }`}
                                        onClick={() => handleSelection(publisher, setTempSelectedPublishers)}
                                    >
                                        {publisher}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-buttons">
                                <button
                                    className="apply-button"
                                    onClick={() =>
                                        applyFilter(setSelectedPublishers, tempSelectedPublishers, setIsPublisherModalOpen)
                                    }
                                >
                                    Áp Dụng
                                </button>
                                <button
                                    className="cancel-button-new"
                                    onClick={() =>
                                        cancelFilter(setTempSelectedPublishers, setSelectedPublishers, setIsPublisherModalOpen)
                                    }
                                >
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new"
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
                    <div className="modal-overlay">
                        <div className="modal-new">
                            <h2 className="modal-title-new">Lọc theo năm xuất bản</h2>
                            <div className="year-filter-inputs">
                                <h3>Nhập khoảng năm:</h3>
                                <div className="year-range-inputs">
                                    <input
                                        type="number"
                                        placeholder="Năm bắt đầu"
                                        value={yearStart}
                                        onChange={(e) => setYearStart(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Năm kết thúc"
                                        value={yearEnd}
                                        onChange={(e) => setYearEnd(e.target.value)}
                                    />
                                </div>
                                <h3>Nhập từng năm riêng lẻ:</h3>
                                <input
                                    type="text"
                                    placeholder="Các năm cách nhau bởi dấu phẩy"
                                    value={specificYears}
                                    onChange={(e) => setSpecificYears(e.target.value)}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button className="apply-button" onClick={applyYearFilter}>
                                    Áp Dụng
                                </button>
                                <button className="cancel-button-new" onClick={cancelYearFilter}>
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new"
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
                    <div className="modal-overlay">
                        <div className="modal-new">
                            <h2 className="modal-title-new">Lọc theo số lượng tồn</h2>
                            <div className="year-filter-inputs">
                                <h3>Nhập khoảng số lượng:</h3>
                                <div className="year-range-inputs">
                                    <input
                                        type="number"
                                        placeholder="Số lượng tối thiểu"
                                        value={stockMin}
                                        onChange={(e) => setStockMin(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Số lượng tối đa"
                                        value={stockMax}
                                        onChange={(e) => setStockMax(e.target.value)}
                                    />
                                </div>
                                <h3>Nhập từng số lượng riêng lẻ:</h3>
                                <input
                                    type="text"
                                    placeholder="Các số lượng cách nhau bởi dấu phẩy"
                                    value={specificStocks}
                                    onChange={(e) => setSpecificStocks(e.target.value)}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button className="apply-button" onClick={applyStockFilter}>
                                    Áp Dụng
                                </button>
                                <button className="cancel-button-new" onClick={cancelStockFilter}>
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new"
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
                    <div className="modal-overlay">
                        <div className="modal-new">
                            <h2 className="modal-title-new">Lọc theo đơn giá bán</h2>
                            <div className="price-filter-inputs">
                                <h3>Nhập khoảng giá:</h3>
                                <div className="price-range-inputs">
                                    <input
                                        type="number"
                                        placeholder="Giá tối thiểu"
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá tối đa"
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(e.target.value)}
                                    />
                                </div>
                                <h3>Nhập từng giá riêng lẻ:</h3>
                                <input
                                    type="text"
                                    placeholder="Các giá cách nhau bởi dấu phẩy"
                                    value={specificPrices}
                                    onChange={(e) => setSpecificPrices(e.target.value)}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button className="apply-button" onClick={applyPriceFilter}>
                                    Áp Dụng
                                </button>
                                <button className="cancel-button-new" onClick={cancelPriceFilter}>
                                    Hủy Áp Dụng
                                </button>
                                <button
                                    className="close-button-new"
                                    onClick={() => setIsPriceModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table of Books */}
                <div className="book-table-block">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Mã</th>
                                <th>Tên sách</th>
                                <th>Tác giả</th>
                                <th>Thể loại</th>
                                <th>NămXB</th>
                                <th>Nhà xuất bản</th>
                                <th>Tồn</th>
                                <th>Đơn giá bán</th> {/* New column */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.map((book, index) => (
                                <tr key={book.id}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{book.maSach}</td>
                                    <td>{book.tenSach}</td>
                                    <td>{book.tacGia}</td>
                                    <td>{book.theLoai}</td>
                                    <td>{book.namXuatBan}</td>
                                    <td>{book.nhaXuatBan}</td>
                                    <td>{book.soLuongTon}</td>
                                    <td>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(book.donGiaBan).replace('₫', 'VNĐ')} {/* Format price */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Buttons */}
                <div className="pagination-buttons">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Trước
                    </button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TatCaSach;