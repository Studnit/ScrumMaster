/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, User, Trash2, ChevronRight, Maximize2, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead, Resource, TaskStatus, CurrentUser } from '../types';

interface TeamViewProps {
  selectedLead: Lead;
  currentUser: CurrentUser;
  newResourceName: string;
  setNewResourceName: (name: string) => void;
  addResource: () => void;
  editingResourceId: string | null;
  setEditingResourceId: (id: string | null) => void;
  editingResourceName: string;
  setEditingResourceName: (name: string) => void;
  renameResource: (id: string) => void;
  moveResource: (id: string, targetLeadId: string) => void;
  leads: Lead[];
  selectedLeadId: string;
  setSelectedResourceDetail: (resource: Resource) => void;
  deleteResource: (id: string) => void;
  updateTaskStatus: (resourceId: string, taskId: string, status: TaskStatus) => void;
  deleteTask: (resourceId: string, taskId: string) => void;
  newTaskNames: Record<string, string>;
  setNewTaskNames: (names: any) => void;
  addTask: (resourceId: string) => void;
}

const TeamView = React.memo(({ 
  selectedLead, 
  currentUser, 
  newResourceName, 
  setNewResourceName, 
  addResource, 
  editingResourceId, 
  setEditingResourceId, 
  editingResourceName, 
  setEditingResourceName, 
  renameResource, 
  moveResource, 
  leads, 
  selectedLeadId, 
  setSelectedResourceDetail, 
  deleteResource, 
  updateTaskStatus, 
  deleteTask, 
  newTaskNames, 
  setNewTaskNames, 
  addTask 
}: TeamViewProps) => (
  <>
    {/* Scope Info */}
    <div className="mb-8 p-8 bg-white rounded-[2rem] text-slate-900 shadow-xl relative overflow-hidden group border border-slate-200">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:scale-110"></div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">Scope of Task</p>
        <h3 className="text-3xl font-black leading-tight max-w-2xl italic text-slate-800">{selectedLead?.scope}</h3>
      </div>
    </div>

    {/* Add Resource Input - Only for Admins */}
    {currentUser.isAdmin && (
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex gap-3">
        <input 
          type="text" 
          placeholder={`Add new member under ${selectedLead?.name}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400"
          value={newResourceName}
          onChange={(e) => setNewResourceName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addResource()}
        />
        <button 
          onClick={addResource}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          <span>Add Member</span>
        </button>
      </div>
    )}

    {/* Resources Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      <AnimatePresence mode="popLayout">
        {(selectedLead.resources || [])
          .filter((r: Resource) => currentUser.isAdmin || r.id === currentUser.id)
          .map((resource: Resource) => (
          <motion.div 
            key={resource.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/5 transition-all overflow-hidden flex flex-col group"
          >
            {/* Resource Header */}
            <div className={`p-6 border-b flex items-center justify-between ${resource.color}`}>
              <div className="flex items-center gap-4 flex-1">
                <div 
                  className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
                  onClick={() => setSelectedResourceDetail(resource)}
                >
                  <User size={24} />
                </div>
                <div className="flex-1">
                  {editingResourceId === resource.id && currentUser.isAdmin ? (
                    <div className="flex gap-2">
                      <input 
                        autoFocus
                        className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-base font-black w-full text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        value={editingResourceName}
                        onChange={(e) => setEditingResourceName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && renameResource(resource.id)}
                        onBlur={() => setEditingResourceId(null)}
                      />
                    </div>
                  ) : (
                    <h3 
                      className={`font-black leading-tight text-xl tracking-tight text-white ${currentUser.isAdmin ? 'cursor-pointer hover:underline' : ''}`}
                      onClick={() => {
                        if (currentUser.isAdmin) {
                          setEditingResourceId(resource.id);
                          setEditingResourceName(resource.name);
                        }
                      }}
                    >
                      {resource.name}
                    </h3>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] opacity-60 font-black uppercase tracking-[0.2em] text-white">Resource</p>
                    {(resource.tasks || []).length > 0 && (
                      <div className="flex gap-0.5 h-1.5 w-20 bg-white/20 rounded-full overflow-hidden">
                        {['done', 'in progress', 'stuck'].map(status => {
                          const count = (resource.tasks || []).filter((t: any) => t.status === status).length;
                          if (count === 0) return null;
                          const width = (count / (resource.tasks || []).length) * 100;
                          return (
                            <div 
                              key={status}
                              style={{ width: `${width}%` }}
                              className={`h-full ${status === 'done' ? 'bg-emerald-400' : status === 'stuck' ? 'bg-red-400' : 'bg-amber-400'}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {currentUser.isAdmin && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select 
                      className="appearance-none bg-white/10 border border-white/20 rounded-full pl-4 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer transition-all hover:bg-white/20"
                      onChange={(e) => moveResource(resource.id, e.target.value)}
                      value={selectedLeadId}
                      title="Move to another lead"
                    >
                      <option disabled value={selectedLeadId}>Move to...</option>
                      {leads.filter((l: Lead) => l.id !== selectedLeadId).map((l: Lead) => (
                        <option key={l.id} value={l.id} className="text-slate-900">{l.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
                      <ChevronRight size={12} className="rotate-90" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedResourceDetail(resource)}
                    className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                    title="View detailed report"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => deleteResource(resource.id)}
                    className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Tasks List */}
            <div className="p-6 flex-1 space-y-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Backlog ({(resource.tasks || []).length})</span>
              </div>
              
              <div className="space-y-3">
                {(resource.tasks || []).map((task: any) => (
                  <div 
                    key={task.id}
                    className={`
                      flex flex-col p-4 rounded-[1.25rem] border transition-all group/task bg-white
                      ${task.status === 'done' ? 'border-emerald-100 opacity-75' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`
                          w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm
                          ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'stuck' ? 'bg-red-500' : 'bg-amber-500'}
                        `}></div>
                        <span className={`text-sm font-bold truncate transition-all ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {task.name}
                        </span>
                      </div>
                      {currentUser.isAdmin && (
                        <button 
                          onClick={() => deleteTask(resource.id, task.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover/task:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 pl-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{task.date}</span>
                        <select 
                          value={task.status}
                          onChange={(e) => updateTaskStatus(resource.id, task.id, e.target.value as TaskStatus)}
                          className={`
                            text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border focus:ring-0 cursor-pointer transition-all bg-white
                            ${task.status === 'done' ? 'border-emerald-200 text-emerald-600' : task.status === 'stuck' ? 'border-red-200 text-red-600' : 'border-amber-200 text-amber-600'}
                          `}
                        >
                          <option value="in progress">In Progress</option>
                          <option value="done">Done</option>
                          <option value="stuck">Stuck</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(resource.tasks || []).length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-200">
                  <CheckSquare size={32} className="mb-3 opacity-50" />
                  <p className="text-[11px] font-black uppercase tracking-widest italic">No active tasks</p>
                </div>
              )}
            </div>

            {/* Add Task Input - Only for Admins */}
            {currentUser.isAdmin && (
              <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Assign new task..."
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    value={newTaskNames[resource.id] || ''}
                    onChange={(e) => setNewTaskNames((prev: any) => ({ ...prev, [resource.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addTask(resource.id)}
                  />
                  <button 
                    onClick={() => addTask(resource.id)}
                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </>
));

export default TeamView;
