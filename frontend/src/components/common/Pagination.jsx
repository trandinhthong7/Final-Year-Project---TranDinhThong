const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    
    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 my-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#004643] text-[#fffffe] hover:bg-[#f9bc60] hover:text-[#001e1d]'
                }`}
            >
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                                ? 'bg-[#f9bc60] text-[#001e1d] font-bold'
                                : 'bg-[#abd1c6] text-[#004643] hover:bg-[#004643] hover:text-[#fffffe]'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#004643] text-[#fffffe] hover:bg-[#f9bc60] hover:text-[#001e1d]'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
