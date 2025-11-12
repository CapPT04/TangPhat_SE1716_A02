import toast from 'react-hot-toast';
import CustomToast, { ToastType } from '@/components/common/CustomToast';

export const showToast = (message: string, type: ToastType = 'info') => {
  toast.custom(
    (t) => (
      <CustomToast
        message={message}
        type={type}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    {
      duration: 4000,
      position: 'top-right',
    }
  );
};

export const toastSuccess = (message: string) => showToast(message, 'success');
export const toastError = (message: string) => showToast(message, 'error');
export const toastWarning = (message: string) => showToast(message, 'warning');
export const toastInfo = (message: string) => showToast(message, 'info');
