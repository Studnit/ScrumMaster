/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchViewProps {
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  globalSearchResults: any[];
  setSelectedLeadId: (id: string | null) => void;
  setCurrentView: (view: any) => void;
}

const SearchView = React.memo(({ 
  globalSearchQuery, 
  setGlobalSearchQuery, 
  globalSearchResults, 
  setSelectedLeadId, 
  setCurrentView 
}: SearchViewProps) => (
  <div className="space-y-8 pb-20">
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-slate-900 mb-6">Search Organization</h3>
        <div className="relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Search by resource, lead, or task keyword..."
            className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-400"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {globalSearchResults.map((result: any) => (
        <motion.div 
          key={`${result.leadId}-${result.resourceId}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col group hover:shadow-2xl transition-all"
        >
          <div className={`p-6 border-b flex items-center justify-between ${result.resourceColor}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                <User size={24} />
              </div>
              <div>
                <h4 className="font-black text-white text-xl leading-tight">{result.resourceName}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Lead: {result.leadName}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedLeadId(result.leadId);
                setCurrentView('team');
              }}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {result.tasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'stuck' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                  <span className="text-xs font-bold text-slate-700 truncate">{task.name}</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${task.status === 'done' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : task.status === 'stuck' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      
      {globalSearchQuery && globalSearchResults.length === 0 && (
        <div className="col-span-full py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Search size={40} />
          </div>
          <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">No results found</h4>
          <p className="text-slate-400 text-sm mt-2">Try searching for something else</p>
        </div>
      )}
    </div>
  </div>
));

export default SearchView;
