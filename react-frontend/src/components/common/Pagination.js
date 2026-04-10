import React from 'react';
import './Pagination.css';

const WINDOW_SIZE = 5;
const JUMP = 5;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const half = Math.floor(WINDOW_SIZE / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + WINDOW_SIZE - 1);
  start = Math.max(1, end - WINDOW_SIZE + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const goTo = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== currentPage) onPageChange(next);
  };

  const atFirst = currentPage === 1;
  const atLast = currentPage === totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-link pagination-arrow"
        onClick={() => goTo(currentPage - JUMP)}
        disabled={atFirst}
        aria-label={`Jump back ${JUMP} pages`}
      >
        &laquo;
      </button>
      <button
        className="pagination-link pagination-arrow"
        onClick={() => goTo(currentPage - 1)}
        disabled={atFirst}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination-link ${p === currentPage ? 'active' : ''}`}
          onClick={() => goTo(p)}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className="pagination-link pagination-arrow"
        onClick={() => goTo(currentPage + 1)}
        disabled={atLast}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <button
        className="pagination-link pagination-arrow"
        onClick={() => goTo(currentPage + JUMP)}
        disabled={atLast}
        aria-label={`Jump forward ${JUMP} pages`}
      >
        &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
