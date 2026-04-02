/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';

interface ResourceDetailModalProps {
  selectedResourceDetail: any;
  setSelectedResourceDetail: (resource: any) => void;
  resourceChartData: any[];
}

const ResourceDetailModal = React.memo(({ 
  selectedResourceDetail, 
  setSelectedResourceDetail, 
  resourceChartData 
}: ResourceDetailModalProps) => (
  <AnimatePresence>
    {selectedResourceDetail && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedResourceDetail(null)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className={`p-8 flex items-center justify-between ${selectedResourceDetail.color}`}>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{selectedResourceDetail.name}</h2>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mt-1">Resource Performance Profile</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedResourceDetail(null)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Stats & Chart */}
              <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-xl font-black text-slate-900">{(selectedResourceDetail.tasks || []).length}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Done</p>
                      <p className="text-xl font-black text-emerald-700">{(selectedResourceDetail.tasks || []).filter((t: any) => t.status === 'done').length}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Active</p>
                      <p className="text-xl font-black text-amber-700">{(selectedResourceDetail.tasks || []).filter((t: any) => t.status !== 'done').length}</p>
                    </div>
                  </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Status Distribution</h3>
                  <div className="h-[200px] w-full">
                    {resourceChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={resourceChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {resourceChartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-300 italic text-xs">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center justify-between">
                  Recent Activity
                  <span className="text-[10px] text-slate-400">{(selectedResourceDetail.tasks || []).length} Tasks</span>
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {(selectedResourceDetail.tasks || []).length > 0 ? (
                    (selectedResourceDetail.tasks || []).map((task: any) => (
                      <div key={task.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'stuck' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <div>
                            <p className={`text-sm font-bold ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{task.date}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${task.status === 'done' ? 'bg-emerald-50 text-emerald-600' : task.status === 'stuck' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {task.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-300">
                      <CheckSquare size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">No tasks assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

export default ResourceDetailModal;
