import React, { useState } from 'react';
import '../../styles/PathStyles.css';
import './TatCaSach.css';
import bookData from './BookData';

function TatCaSach() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    const [tempSelectedPublishers, setTempSelectedPublishers] = useState([]); // Temporary selection for the modal
    const [publisherSearchTerm, setPublisherSearchTerm] = useState('');
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [tempSelectedAuthors, setTempSelectedAuthors] = useState([]); // Temporary selection for the modal
    const [authorSearchTerm, setAuthorSearchTerm] = useState('');
    const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [tempSelectedGenres, setTempSelectedGenres] = useState([]); // Temporary selection for the modal
    const [genreSearchTerm, setGenreSearchTerm] = useState('');
    const [isYearModalOpen, setIsYearModalOpen] = useState(false);
    const [yearRange, setYearRange] = useState({ from: '', to: '' });
    const [selectedYears, setSelectedYears] = useState([]);
    const [tempSelectedYears, setTempSelectedYears] = useState([]); // Temporary selection for the modal
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockRange, setStockRange] = useState({ from: '', to: '' });
    const [sortOrder, setSortOrder] = useState({ field: '', order: '' }); // Sorting state
    const booksPerPage = 10; // Number of books to display per page

    const publishers = [...new Set(bookData.map((book) => book.nhaXuatBan))]; // Unique publishers
    const filteredPublishers = publishers.filter((publisher) =>
        publisher.toLowerCase().includes(publisherSearchTerm.toLowerCase())
    );

    const authors = [...new Set(bookData.map((book) => book.tacGia))]; // Unique authors
    const filteredAuthors = authors.filter((author) =>
        author.toLowerCase().includes(authorSearchTerm.toLowerCase())
    );

    const genres = [...new Set(bookData.map((book) => book.theLoai))]; // Unique genres
    const filteredGenres = genres.filter((genre) =>
        genre.toLowerCase().includes(genreSearchTerm.toLowerCase())
    );

    const years = [...new Set(bookData.map((book) => book.namXuatBan))].sort((a, b) => a - b); // Unique years sorted

    const filteredBooks = bookData.filter(
        (book) =>
            (book.maSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.tenSach.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedPublishers.length === 0 || selectedPublishers.includes(book.nhaXuatBan)) &&
            (selectedAuthors.length === 0 || selectedAuthors.includes(book.tacGia)) &&
            (selectedGenres.length === 0 || selectedGenres.includes(book.theLoai)) &&
            (
                (yearRange.from && yearRange.to && book.namXuatBan >= yearRange.from && book.namXuatBan <= yearRange.to) || // Filter by range
                (selectedYears.length > 0 && selectedYears.includes(book.namXuatBan)) || // Filter by selected years
                (yearRange.from === '' && yearRange.to === '' && selectedYears.length === 0) // No filter applied
            ) &&
            (
                (stockRange.from && stockRange.to && book.soLuongTon >= stockRange.from && book.soLuongTon <= stockRange.to) || // Filter by stock range
                (stockRange.from === '' && stockRange.to === '') // No stock filter applied
            )
    );

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (sortOrder.field && sortOrder.order) {
            if (sortOrder.order === 'asc') {
                return a[sortOrder.field] > b[sortOrder.field] ? 1 : -1;
            } else {
                return a[sortOrder.field] < b[sortOrder.field] ? 1 : -1;
            }
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

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

    const handlePublisherSelection = (publisher) => {
        setTempSelectedPublishers((prev) =>
            prev.includes(publisher) ? prev.filter((p) => p !== publisher) : [...prev, publisher]
        );
    };

    const handleAuthorSelection = (author) => {
        setTempSelectedAuthors((prev) =>
            prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
        );
    };

    const handleGenreSelection = (genre) => {
        setTempSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleYearRangeChange = (field, value) => {
        setYearRange((prev) => ({ ...prev, [field]: value }));
        if (value) {
            setTempSelectedYears([]); // Clear selected years if a range is being entered
        }
    };

    const handleYearSelection = (year) => {
        setTempSelectedYears((prev) =>
            prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
        );
        if (tempSelectedYears.length === 0) {
            setYearRange({ from: '', to: '' }); // Clear the range if years are being selected
        }
    };

    const handleSort = (field, order) => {
        setSortOrder({ field, order });
    };

    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

    return (
        <div className="page-container">
            <h1 className="page-title">Tất Cả Sách</h1>
            <div className="content-container">
                {/* Search and Filters */}
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
                    <div className="filters">
                        <span className="filter-title">Bộ lọc:</span>
                        <button
                            className={`filter-button ${
                                selectedYears.length > 0 || (yearRange.from && yearRange.to) ? 'active-year-filter' : ''
                            }`}
                            onClick={() => setIsYearModalOpen(true)}
                        >
                            Theo năm xuất bản
                        </button>
                        <button
                            className={`filter-button ${
                                selectedGenres.length > 0 ? 'active-genre-filter' : ''
                            }`}
                            onClick={() => {
                                setTempSelectedGenres(selectedGenres); // Preserve current selection
                                setIsGenreModalOpen(true);
                            }}
                        >
                            Theo thể loại
                        </button>
                        <button
                            className={`filter-button ${
                                selectedAuthors.length > 0 ? 'active-author-filter' : ''
                            }`}
                            onClick={() => {
                                setTempSelectedAuthors(selectedAuthors); // Preserve current selection
                                setIsAuthorModalOpen(true);
                            }}
                        >
                            Theo tác giả
                        </button>
                        <button
                            className={`filter-button ${
                                selectedPublishers.length > 0 ? 'active-publisher-filter' : ''
                            }`}
                            onClick={() => {
                                setTempSelectedPublishers(selectedPublishers); // Preserve current selection
                                setIsPublisherModalOpen(true);
                            }}
                        >
                            Theo nhà xuất bản
                        </button>
                        <button
                            className="filter-button"
                            onClick={() => setIsStockModalOpen(true)}
                        >
                            Theo số lượng tồn
                        </button>
                    </div>
                </div>

                {/* Publisher Modal */}
                {isPublisherModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            {/* Block 1: Title */}
                            <div className="modal-top">
                                <h2>Chọn theo nhà xuất bản</h2>
                            </div>

                            {/* Block 2: Search and Publisher List */}
                            <div className="modal-middle">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nhà xuất bản"
                                    className="publisher-search-bar"
                                    value={publisherSearchTerm}
                                    onChange={(e) => setPublisherSearchTerm(e.target.value)}
                                />
                                <div className="sort-buttons">
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('nhaXuatBan', 'asc')}
                                    >
                                        Sắp xếp tăng dần
                                    </button>
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('nhaXuatBan', 'desc')}
                                    >
                                        Sắp xếp giảm dần
                                    </button>
                                </div>
                                <div className="publisher-list">
                                    {/* Display selected publishers at the top */}
                                    {tempSelectedPublishers.map((publisher) => (
                                        <div
                                            key={publisher}
                                            className="publisher-item selected"
                                            onClick={() => handlePublisherSelection(publisher)}
                                        >
                                            {publisher}
                                        </div>
                                    ))}
                                    {/* Display unselected publishers below */}
                                    {filteredPublishers
                                        .filter((publisher) => !tempSelectedPublishers.includes(publisher))
                                        .map((publisher) => (
                                            <div
                                                key={publisher}
                                                className="publisher-item"
                                                onClick={() => handlePublisherSelection(publisher)}
                                            >
                                                {publisher}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Block 3: Buttons */}
                            <div className="modal-bottom">
                                <button
                                    className="apply-button"
                                    onClick={() => {
                                        setSelectedPublishers(tempSelectedPublishers); // Apply the selected publishers
                                        setIsPublisherModalOpen(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setSelectedPublishers([]); // Clear the filter
                                        setIsPublisherModalOpen(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="close-button"
                                    onClick={() => setIsPublisherModalOpen(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Author Modal */}
                {isAuthorModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            {/* Block 1: Title */}
                            <div className="modal-top">
                                <h2>Chọn theo tác giả</h2>
                            </div>

                            {/* Block 2: Search and Author List */}
                            <div className="modal-middle">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tác giả"
                                    className="author-search-bar"
                                    value={authorSearchTerm}
                                    onChange={(e) => setAuthorSearchTerm(e.target.value)}
                                />
                                <div className="sort-buttons">
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('tacGia', 'asc')}
                                    >
                                        Sắp xếp tăng dần
                                    </button>
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('tacGia', 'desc')}
                                    >
                                        Sắp xếp giảm dần
                                    </button>
                                </div>
                                <div className="author-list">
                                    {/* Display selected authors at the top */}
                                    {tempSelectedAuthors.map((author) => (
                                        <div
                                            key={author}
                                            className="author-item selected"
                                            onClick={() => handleAuthorSelection(author)}
                                        >
                                            {author}
                                        </div>
                                    ))}
                                    {/* Display unselected authors below */}
                                    {filteredAuthors
                                        .filter((author) => !tempSelectedAuthors.includes(author))
                                        .map((author) => (
                                            <div
                                                key={author}
                                                className="author-item"
                                                onClick={() => handleAuthorSelection(author)}
                                            >
                                                {author}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Block 3: Buttons */}
                            <div className="modal-bottom">
                                <button
                                    className="apply-button"
                                    onClick={() => {
                                        setSelectedAuthors(tempSelectedAuthors); // Apply the selected authors
                                        setIsAuthorModalOpen(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setSelectedAuthors([]); // Clear the filter
                                        setIsAuthorModalOpen(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="close-button"
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
                        <div className="modal">
                            {/* Block 1: Title */}
                            <div className="modal-top">
                                <h2>Chọn theo thể loại</h2>
                            </div>

                            {/* Block 2: Search and Genre List */}
                            <div className="modal-middle">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm thể loại"
                                    className="genre-search-bar"
                                    value={genreSearchTerm}
                                    onChange={(e) => setGenreSearchTerm(e.target.value)}
                                />
                                <div className="sort-buttons">
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('theLoai', 'asc')}
                                    >
                                        Sắp xếp tăng dần
                                    </button>
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('theLoai', 'desc')}
                                    >
                                        Sắp xếp giảm dần
                                    </button>
                                </div>
                                <div className="genre-list">
                                    {/* Display selected genres at the top */}
                                    {tempSelectedGenres.map((genre) => (
                                        <div
                                            key={genre}
                                            className="genre-item selected"
                                            onClick={() => handleGenreSelection(genre)}
                                        >
                                            {genre}
                                        </div>
                                    ))}
                                    {/* Display unselected genres below */}
                                    {filteredGenres
                                        .filter((genre) => !tempSelectedGenres.includes(genre))
                                        .map((genre) => (
                                            <div
                                                key={genre}
                                                className="genre-item"
                                                onClick={() => handleGenreSelection(genre)}
                                            >
                                                {genre}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Block 3: Buttons */}
                            <div className="modal-bottom">
                                <button
                                    className="apply-button"
                                    onClick={() => {
                                        setSelectedGenres(tempSelectedGenres); // Apply the selected genres
                                        setIsGenreModalOpen(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setSelectedGenres([]); // Clear the filter
                                        setIsGenreModalOpen(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="close-button"
                                    onClick={() => setIsGenreModalOpen(false)}
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
                        <div className="modal">
                            {/* Block 1: Title */}
                            <div class="modal-top">
                                <h2>Chọn theo năm xuất bản</h2>
                            </div>

                            {/* Block 2: Year Range and Year List */}
                            <div className="modal-middle">
                                <div className="year-range">
                                    <label>
                                        Từ năm:
                                        <input
                                            type="number"
                                            value={yearRange.from}
                                            onChange={(e) =>
                                                handleYearRangeChange('from', e.target.value)
                                            }
                                            disabled={tempSelectedYears.length > 0} // Disable if years are selected
                                        />
                                    </label>
                                    <label>
                                        Đến năm:
                                        <input
                                            type="number"
                                            value={yearRange.to}
                                            onChange={(e) =>
                                                handleYearRangeChange('to', e.target.value)
                                            }
                                            disabled={tempSelectedYears.length > 0} // Disable if years are selected
                                        />
                                    </label>
                                </div>
                                <div className="sort-buttons">
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('namXuatBan', 'asc')}
                                    >
                                        Sắp xếp tăng dần
                                    </button>
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('namXuatBan', 'desc')}
                                    >
                                        Sắp xếp giảm dần
                                    </button>
                                </div>
                                <div className="year-list">
                                    {/* Display selected years at the top */}
                                    {tempSelectedYears.map((year) => (
                                        <div
                                            key={year}
                                            className="year-item selected"
                                            onClick={() => handleYearSelection(year)}
                                        >
                                            {year}
                                        </div>
                                    ))}
                                    {/* Display unselected years below */}
                                    {years
                                        .filter((year) => !tempSelectedYears.includes(year))
                                        .map((year) => (
                                            <div
                                                key={year}
                                                className="year-item"
                                                onClick={() => handleYearSelection(year)}
                                                style={{
                                                    pointerEvents:
                                                        yearRange.from || yearRange.to
                                                            ? 'none'
                                                            : 'auto', // Disable if a range is entered
                                                    opacity:
                                                        yearRange.from || yearRange.to
                                                            ? 0.5
                                                            : 1, // Dim if disabled
                                                }}
                                            >
                                                {year}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Block 3: Buttons */}
                            <div className="modal-bottom">
                                <button
                                    className="apply-button"
                                    onClick={() => {
                                        setSelectedYears(tempSelectedYears); // Apply the selected years
                                        setIsYearModalOpen(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setSelectedYears([]); // Clear the filter
                                        setYearRange({ from: '', to: '' }); // Clear the range
                                        setIsYearModalOpen(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="close-button"
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
                        <div className="modal">
                            {/* Block 1: Title */}
                            <div className="modal-top">
                                <h2>Chọn theo số lượng tồn</h2>
                            </div>

                            {/* Block 2: Stock Range */}
                            <div className="modal-middle">
                                <div className="stock-range">
                                    <label>
                                        Từ:
                                        <input
                                            type="number"
                                            value={stockRange.from}
                                            onChange={(e) =>
                                                setStockRange({ ...stockRange, from: e.target.value })
                                            }
                                        />
                                    </label>
                                    <label>
                                        Đến:
                                        <input
                                            type="number"
                                            value={stockRange.to}
                                            onChange={(e) =>
                                                setStockRange({ ...stockRange, to: e.target.value })
                                            }
                                        />
                                    </label>
                                </div>
                                <div className="sort-buttons">
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('soLuongTon', 'asc')}
                                    >
                                        Sắp xếp tăng dần
                                    </button>
                                    <button
                                        className="sort-button"
                                        onClick={() => handleSort('soLuongTon', 'desc')}
                                    >
                                        Sắp xếp giảm dần
                                    </button>
                                </div>
                            </div>

                            {/* Block 3: Buttons */}
                            <div className="modal-bottom">
                                <button
                                    className="apply-button"
                                    onClick={() => setIsStockModalOpen(false)}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setStockRange({ from: '', to: '' }); // Clear the stock range
                                        setIsStockModalOpen(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="close-button"
                                    onClick={() => setIsStockModalOpen(false)}
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
                                <th>Mã sách</th>
                                <th>Tên sách</th>
                                <th>Tác giả</th>
                                <th>Thể loại</th>
                                <th>Năm XB</th>
                                <th>Nhà xuất bản</th>
                                <th>Tồn</th> {/* New column */}
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
                                    <td>{book.soLuongTon}</td> {/* New data */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Buttons */}
                <div className="pagination-buttons">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TatCaSach;