const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    className = ""
  }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      // Simple pagination for few pages
      if (totalPages <= maxVisiblePages) {
        return [...Array(totalPages).keys()].map(i => i + 1);
      }
      
      // Complex pagination with ellipsis
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (startPage > 1) {
        pages.unshift(1);
        if (startPage > 2) {
          pages.splice(1, 0, '...');
        }
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
      
      return pages;
    };
  
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        
        <div className="flex space-x-1">
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : null}
              disabled={pageNum === '...'}
              className={`w-10 h-10 rounded-md border ${currentPage === pageNum 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {pageNum}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;