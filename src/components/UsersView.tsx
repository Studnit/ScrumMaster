/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Trash2, ShieldCheck, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount } from '../types';

interface UsersViewProps {
  users: UserAccount[];
  setEditingUser: (user: UserAccount | null) => void;
  setIsUserModalOpen: (open: boolean) => void;
  setUserForm: (form: any) => void;
  deleteUser: (id: string) => void;
}

const UsersView = React.memo(({ 
  users, 
  setEditingUser, 
  setIsUserModalOpen, 
  setUserForm, 
  deleteUser 
}: UsersViewProps) => (
  <div className="space-y-8 pb-20">
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-2">User Management</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Control system access and permissions</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setUserForm({ username: '', password: '', role: 'user', name: '' });
            setIsUserModalOpen(true);
          }}
          className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <motion.div 
          key={user.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden group hover:shadow-2xl transition-all"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <ShieldCheck size={28} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                user.role === 'super_admin' ? 'bg-rose-50 border-rose-200 text-rose-600' : 
                user.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 
                'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                {user.role.replace('_', ' ')}
              </div>
            </div>
            
            <h4 className="text-xl font-black text-slate-900 mb-1">{user.name}</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">@{user.username}</p>
            
            <div className="flex gap-3 pt-6 border-t border-slate-50">
              <button 
                onClick={() => {
                  setEditingUser(user);
                  setUserForm({ ...user, password: '' });
                  setIsUserModalOpen(true);
                }}
                className="flex-1 py-3 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
              >
                Edit Profile
                <ChevronRight size={14} />
              </button>
              <button 
                onClick={() => deleteUser(user.id)}
                className="p-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
));

export default UsersView;
