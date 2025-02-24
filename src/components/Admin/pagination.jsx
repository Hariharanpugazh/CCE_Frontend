import React from "react";
import backIcon from '../../assets/icons/back-icon.svg';
import nextIcon from '../../assets/icons/next-icon.svg';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  return (
    <div className="flex justify-between items-center mt-6">
      {/* Displaying range info */}
      <span className="text-gray-600 text-sm">
        Showing {startItem.toString().padStart(2, "0")}-{endItem.toString().padStart(2, "0")} of {totalItems}
      </span>

      {/* Pagination buttons */}
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          className="p-1.5 px-3 border-r border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <img src={backIcon} alt="" className="w-4" />
        </button>

        <button
          className="p-1.5 px-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <img src={nextIcon} alt="" className="w-4"/>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
