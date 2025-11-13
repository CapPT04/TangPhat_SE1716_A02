import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, User, CheckCircle, XCircle } from 'lucide-react';
import { Account, RoleNames, AccountRole, CreateAccountRequest, UpdateAccountRequest } from '@/types/admin.types';
import { accountService } from '@/services/account.service';
import AccountFormModal from '@/components/features/admin/AccountFormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toastSuccess, toastError } from '@/utils/toast';

const AccountListPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAll();
      setAccounts(data.sort((a, b) => b.accountId - a.accountId));
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadAccounts();
      return;
    }

    try {
      setLoading(true);
      const data = await accountService.search(searchTerm);
      setAccounts(data.sort((a, b) => b.accountId - a.accountId));
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedAccount(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (account: Account) => {
    setFormMode('edit');
    setSelectedAccount(account);
    setIsFormModalOpen(true);
  };

  const handleCreateAccount = async (data: CreateAccountRequest | UpdateAccountRequest) => {
    try {
      await accountService.create(data as CreateAccountRequest);
      toastSuccess('Account created successfully!');
      loadAccounts();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleUpdateAccount = async (data: CreateAccountRequest | UpdateAccountRequest) => {
    if (!selectedAccount) return;
    
    try {
      await accountService.update(selectedAccount.accountId, data as UpdateAccountRequest);
      toastSuccess('Account updated successfully!');
      loadAccounts();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update account';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleOpenDeleteDialog = (account: Account) => {
    setSelectedAccount(account);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;

    try {
      await accountService.delete(selectedAccount.accountId);
      toastSuccess('Account deleted successfully!');
      loadAccounts();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        'Failed to delete account. The account may have created news articles.';
      toastError(errorMessage);
    }
  };

  const getRoleBadgeColor = (roleId: number) => {
    switch (roleId) {
      case 1: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'; // Staff
      case 2: return 'bg-green-500/20 text-green-400 border-green-500/30'; // Lecturer
      case 3: return 'bg-red-500/20 text-red-400 border-red-500/30'; // Admin
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const filteredAccounts = searchTerm 
    ? accounts 
    : accounts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <User className="w-10 h-10" />
            Account Management
          </h1>
          <p className="text-blue-200">Manage system accounts and permissions</p>
        </motion.div>

        {/* Search and Create Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Account
            </button>
          </div>
        </motion.div>

        {/* Accounts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-20 text-blue-200">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No accounts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Role</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-200">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <motion.tr
                      key={account.accountId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-mono">{account.accountId}</td>
                      <td className="px-6 py-4 text-white font-medium">{account.accountName}</td>
                      <td className="px-6 py-4 text-blue-200">{account.accountEmail}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(account.accountRole)}`}>
                          {RoleNames[account.accountRole as AccountRole] || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {account.accountId === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">
                            System
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            account.isActive !== false ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {account.isActive !== false ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {account.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(account)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(account)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Account Form Modal */}
        <AccountFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={formMode === 'create' ? handleCreateAccount : handleUpdateAccount}
          account={selectedAccount}
          mode={formMode}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Account"
          message={`Are you sure you want to delete account "${selectedAccount?.accountName}"? This action cannot be undone. Note: Accounts that have created news articles cannot be deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default AccountListPage;
