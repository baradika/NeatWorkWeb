import { useEffect } from 'react';
import { X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const alertClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const iconClasses = {
    error: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const getIcon = () => {
    const size = 20;
    switch (type) {
      case 'success':
        return <span className={iconClasses[type]}>✓</span>;
      case 'warning':
        return <span className={iconClasses[type]}>!</span>;
      case 'info':
        return <span className={iconClasses[type]}>i</span>;
      default:
        return <span className={iconClasses[type]}>✕</span>;
    }
  };

  return (
    <div 
      className={`${alertClasses[type]} border px-4 py-3 rounded fixed top-4 right-4 max-w-md w-full shadow-lg z-50 flex items-start justify-between`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium">
            {type === 'error' && 'Error'}
            {type === 'success' && 'Success'}
            {type === 'warning' && 'Warning'}
            {type === 'info' && 'Info'}
          </p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      <button
        type="button"
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;
