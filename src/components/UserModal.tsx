/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount } from '../types';

interface UserModalProps {
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  editingUser: UserAccount | null;
  userForm: Partial<UserAccount>;
  setUserForm: (form: any) => void;
  handleSaveUser: () => void;
}

const UserModal = React.memo(({ 
  isUserModalOpen, 
  setIsUserModalOpen, 
  editingUser, 
  userForm, 
  setUserForm, 
  handleSaveUser 
}: UserModalProps) => (
  <AnimatePresence>
    {isUserModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsUserModalOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-200"
        >
          <div className="p-8 bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-black mb-2 relative z-10">{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">System Access Configuration</p>
            <button 
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                placeholder="e.g. John Doe"
                value={userForm.name}
                onChange={(e) => setUserForm((prev: any) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                placeholder="e.g. johndoe"
                value={userForm.username}
                onChange={(e) => setUserForm((prev: any) => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                placeholder="Leave blank to keep current"
                value={userForm.password}
                onChange={(e) => setUserForm((prev: any) => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Role</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                value={userForm.role}
                onChange={(e) => setUserForm((prev: any) => ({ ...prev, role: e.target.value as any }))}
              >
                <option value="user">User (Resource)</option>
                <option value="admin">Admin (Team Lead)</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

export default UserModal;
