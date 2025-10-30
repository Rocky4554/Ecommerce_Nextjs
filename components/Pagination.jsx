
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex justify-center items-center gap-3 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-neutral-800 text-amber-50 rounded-md disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2  bg-neutral-800 text-amber-50 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
