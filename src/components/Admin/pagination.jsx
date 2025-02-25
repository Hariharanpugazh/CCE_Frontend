import React from "react";
import backIcon from "../../assets/icons/back-icon.svg";
import nextIcon from "../../assets/icons/next-icon.svg";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Logic for which page numbers to show
    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    // Pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-6">
      {/* Displaying range info */}
      {/* <span className="text-gray-600 text-sm">
        Showing {startItem.toString().padStart(2, "0")}-
        {endItem.toString().padStart(2, "0")} of {totalItems}
      </span> */}

      {/* Pagination buttons */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <img src={backIcon || "/placeholder.svg"} alt="" className="w-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`flex items-center justify-center w-7 h-7 rounded-md ${
              page === currentPage
                ? "bg-yellow-400 text-black font-medium"
                : page === "..."
                ? "bg-white text-gray-600"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => page !== "..." && onPageChange(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <img src={nextIcon || "/placeholder.svg"} alt="" className="w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
