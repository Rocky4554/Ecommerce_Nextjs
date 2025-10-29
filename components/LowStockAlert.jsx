export default function LowStockAlert({ inventory, threshold = 10 }) {
  if (inventory >= threshold) return null;
  
  if (inventory === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div>
          <h4 className="text-red-900 font-semibold">Out of Stock</h4>
          <p className="text-red-700 text-sm mt-1">This product is currently unavailable.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start">
      <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div>
        <h4 className="text-orange-900 font-semibold">Low Stock Alert</h4>
        <p className="text-orange-700 text-sm mt-1">
          Only {inventory} {inventory === 1 ? 'unit' : 'units'} remaining!
        </p>
      </div>
    </div>
  );
}