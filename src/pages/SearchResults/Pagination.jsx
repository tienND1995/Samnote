import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const renderPageNumbers = () => {
        let pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li className={`page-item ${currentPage === i ? 'active' : ''}`} key={i}>
                    <a className="page-link" href="#" onClick={() => setCurrentPage(i)}>{i}</a>
                </li>
            );
        }
        return pages;
    }

    return (
        <nav aria-label="Page navigation" className='w-full pt-2'>
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>Previous</a>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>Next</a>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;