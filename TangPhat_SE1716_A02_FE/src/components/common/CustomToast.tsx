import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const CustomToast = ({ message, type, onClose }: CustomToastProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50';
      case 'error':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
      case 'info':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-center gap-3 p-4 rounded-xl backdrop-blur-lg border ${getBackgroundColor()} shadow-2xl min-w-[320px] max-w-md`}
    >
      {getIcon()}
      <p className="flex-1 text-white font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default CustomToast;
