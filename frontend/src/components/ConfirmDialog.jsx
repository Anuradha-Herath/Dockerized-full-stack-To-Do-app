import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isDark, isLoading = false }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-sm transform overflow-hidden rounded-xl ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        } p-6 shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95`} onKeyDown={handleKeyDown}>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${
              isDark ? 'bg-red-900/50' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`h-5 w-5 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h3>
          </div>

          {/* Message */}
          <p className={`text-sm mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {message}
          </p>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Deleting...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
