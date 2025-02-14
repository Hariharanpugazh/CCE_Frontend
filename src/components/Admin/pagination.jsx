import React from 'react';


const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage <= 3) {
        // Near the start
        pageNumbers.push(2, 3, 4);
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle
        pageNumbers.push('ellipsis');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex justify-center my-4 items-center ">
      <nav className="flex items-center space-x-1 select-none">
        {/* Previous button */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => 
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors focus:outline-none ${
                currentPage === page
                  ? "bg-yellow-400 font-bold text-black"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}


        {/* Next button */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );
};


export default Pagination;