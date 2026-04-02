/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckSquare, 
  Users2, 
  BarChart3, 
  Search, 
  Lock, 
  ChevronRight 
} from 'lucide-react';
import { Lead } from '../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  currentView: string;
  setCurrentView: (view: any) => void;
  currentUser: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredLeads: Lead[];
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
}

const Sidebar = React.memo(({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  currentView, 
  setCurrentView, 
  currentUser, 
  searchQuery, 
  setSearchQuery, 
  filteredLeads, 
  selectedLeadId, 
  setSelectedLeadId 
}: SidebarProps) => (
  <aside className={`
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
    w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
  `}>
    <div className="p-6 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
          <CheckSquare size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Certification</h1>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Management</p>
        </div>
      </div>

      <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/10">
        <button 
          onClick={() => setCurrentView('team')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'team' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <Users2 size={14} />
          Team
        </button>
        <button 
          onClick={() => setCurrentView('reports')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'reports' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <BarChart3 size={14} />
          Reports
        </button>
        <button 
          onClick={() => setCurrentView('search')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'search' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <Search size={14} />
          Search
        </button>
        {currentUser.role === 'Super Administrator' && (
          <button 
            onClick={() => setCurrentView('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <Lock size={14} />
            Users
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
        <input 
          type="text" 
          placeholder="Search leads, teams..."
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Team Leads</p>
      {filteredLeads.map((lead: any) => (
        <button
          key={lead.id}
          onClick={() => {
            setSelectedLeadId(lead.id);
            setCurrentView('team');
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          className={`
            w-full flex items-center justify-between p-3 rounded-xl transition-all group border
            ${selectedLeadId === lead.id && currentView === 'team'
              ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm' 
              : 'hover:bg-slate-50 text-slate-500 border-transparent'}
          `}
        >
          <div className="flex items-center gap-3 text-left">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
              ${selectedLeadId === lead.id && currentView === 'team' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}
            `}>
              {lead.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">{lead.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">{lead.team}</p>
            </div>
          </div>
          <ChevronRight size={14} className={`transition-transform ${selectedLeadId === lead.id ? 'translate-x-1 text-indigo-400' : 'opacity-0 group-hover:opacity-100 text-slate-300'}`} />
        </button>
      ))}
    </div>
  </aside>
));

export default Sidebar;
