import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { Account, CreateAccountRequest, UpdateAccountRequest, AccountRole, RoleNames } from '@/types/admin.types';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountRequest | UpdateAccountRequest) => Promise<void>;
  account?: Account | null;
  mode: 'create' | 'edit';
}

const AccountFormModal = ({ isOpen, onClose, onSubmit, account, mode }: AccountFormModalProps) => {
  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    accountPassword: '',
    accountRole: AccountRole.Staff,
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && account) {
      setFormData({
        accountName: account.accountName || '',
        accountEmail: account.accountEmail || '',
        accountPassword: '',
        accountRole: account.accountRole,
        isActive: account.isActive !== false,
      });
    } else {
      setFormData({
        accountName: '',
        accountEmail: '',
        accountPassword: '',
        accountRole: AccountRole.Staff,
        isActive: true,
      });
    }
    setErrors({});
  }, [account, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (!formData.accountEmail.trim()) {
      newErrors.accountEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.accountEmail)) {
      newErrors.accountEmail = 'Invalid email format';
    }

    if (mode === 'create' && !formData.accountPassword) {
      newErrors.accountPassword = 'Password is required';
    }

    if (formData.accountPassword && formData.accountPassword.length < 6) {
      newErrors.accountPassword = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        const createData: CreateAccountRequest = {
          accountName: formData.accountName,
          accountEmail: formData.accountEmail,
          accountPassword: formData.accountPassword,
          accountRole: formData.accountRole,
          isActive: formData.isActive,
        };
        await onSubmit(createData);
      } else {
        const updateData: UpdateAccountRequest = {
          accountName: formData.accountName,
          accountEmail: formData.accountEmail,
          accountRole: formData.accountRole,
          isActive: formData.isActive,
        };
        if (formData.accountPassword) {
          updateData.accountPassword = formData.accountPassword;
        }
        await onSubmit(updateData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) : value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <User className="w-6 h-6" />
                {mode === 'create' ? 'Create New Account' : 'Edit Account'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.accountName ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter account name"
                />
                {errors.accountName && (
                  <p className="mt-1 text-sm text-red-400">{errors.accountName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="accountEmail"
                  value={formData.accountEmail}
                  onChange={handleChange}
                  disabled={mode === 'edit'}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.accountEmail ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter email address"
                />
                {errors.accountEmail && (
                  <p className="mt-1 text-sm text-red-400">{errors.accountEmail}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password {mode === 'edit' && '(Leave blank to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="accountPassword"
                    value={formData.accountPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                      errors.accountPassword ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder={mode === 'create' ? 'Enter password (min 6 chars)' : 'Leave blank to keep current'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.accountPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.accountPassword}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <select
                  name="accountRole"
                  value={formData.accountRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(RoleNames).map(([value, label]) => (
                    <option key={value} value={value} className="bg-gray-900">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-blue-200 cursor-pointer">
                  Account is Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AccountFormModal;
