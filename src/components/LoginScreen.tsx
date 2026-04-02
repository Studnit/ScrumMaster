/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, UserCircle, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  loginForm: any;
  setLoginForm: (form: any) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginError: string;
}

const LoginScreen = React.memo(({ 
  loginForm, 
  setLoginForm, 
  handleLogin, 
  loginError 
}: LoginScreenProps) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px]"></div>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Certification Portal</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Secure Access Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="Enter username"
                value={loginForm.username}
                onChange={(e) => setLoginForm((prev: any) => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev: any) => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          {loginError && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-rose-500 text-xs font-bold text-center"
            >
              {loginError}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Sign In
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Admin Access: <span className="text-indigo-400">admin / admin</span>
          </p>
        </div>
      </div>
    </motion.div>
  </div>
));

export default LoginScreen;
