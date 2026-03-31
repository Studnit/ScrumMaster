/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  User, 
  CheckSquare, 
  Plus, 
  Search, 
  Trash2,
  UserCircle,
  Users,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type TaskStatus = 'in progress' | 'done' | 'stuck';

interface Task {
  id: string;
  name: string;
  date: string;
  status: TaskStatus;
}

interface Resource {
  id: string;
  name: string;
  tasks: Task[];
  color?: string;
}

interface Lead {
  id: string;
  name: string;
  role: string;
  team: string;
  scope: string;
  resources: Resource[];
}

// --- Initial Data ---

const INITIAL_DATA: Lead[] = [
  {
    id: 'l-0',
    name: 'Kalyani Raut',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'MPOC/CPOC/HSM Task',
    resources: [
      { id: 'r-1', name: 'Ishita Sakhala', tasks: [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { id: 'r-2', name: 'Akhila Ravi', tasks: [], color: 'bg-purple-50 border-purple-200 text-purple-700' },
    ]
  },
  {
    id: 'l-2',
    name: 'Pratik Patil',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'FIS Raft ISO, 610 processor, Stargate and Getnet processor',
    resources: [
      { id: 'r-3', name: 'Shivani Saknure', tasks: [], color: 'bg-pink-50 border-pink-200 text-pink-700' },
      { id: 'r-4', name: 'Anusha Kanthed', tasks: [], color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { id: 'r-5', name: 'Harshita Bhavanasi', tasks: [], color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
      { id: 'r-6', name: 'Shubham Gilbile', tasks: [], color: 'bg-rose-50 border-rose-200 text-rose-700' },
    ]
  },
  {
    id: 'l-3',
    name: 'HemantKumar Nikole',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'OTC Processors',
    resources: [
      { id: 'r-11', name: 'Paraj Jain', tasks: [], color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    ]
  },
  {
    id: 'l-4',
    name: 'Dipak Pawar',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'Amex and All Gift processor Certifications',
    resources: [
      { id: 'r-12', name: 'Prathamesh Chitodkar', tasks: [], color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
    ]
  },
  {
    id: 'l-6',
    name: 'Harshal Chaudhari',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'Chase ISO/UTF/Stratus Processor, BlackHawk Processor, In-Store Wallets, Check Processor and PLCC Processor',
    resources: [
      { id: 'r-13', name: 'Atharva Sharma', tasks: [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { id: 'r-19', name: 'Vaishnavi Mate', tasks: [], color: 'bg-purple-50 border-purple-200 text-purple-700' },
      { id: 'r-14', name: 'Kartik Macharre', tasks: [], color: 'bg-pink-50 border-pink-200 text-pink-700' },
      { id: 'r-20', name: 'Naga Mani Gatti', tasks: [], color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { id: 'r-15', name: 'Swagata Ranagar', tasks: [], color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
      { id: 'r-21', name: 'Ashrin Shaik', tasks: [], color: 'bg-rose-50 border-rose-200 text-rose-700' },
      { id: 'r-16', name: 'Sumith Venkat Nallabothula', tasks: [], color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { id: 'r-22', name: 'Praneetha Chandragiri', tasks: [], color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
      { id: 'r-17', name: 'Deepti Soni', tasks: [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { id: 'r-18', name: 'Lekana Somayajula', tasks: [], color: 'bg-purple-50 border-purple-200 text-purple-700' },
    ]
  },
  {
    id: 'l-7',
    name: 'Gayatri Kelhe',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'FD Bypass/Nashville/Ecompass and Elavon processor',
    resources: [
      { id: 'r-23', name: 'Vaka Yuva Sai Reddy', tasks: [], color: 'bg-pink-50 border-pink-200 text-pink-700' },
      { id: 'r-24', name: 'Vishnu Vardhan Lekkala', tasks: [], color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { id: 'r-25', name: 'Mani Teja Chittabattina', tasks: [], color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    ]
  },
  {
    id: 'l-8',
    name: 'Amol Datal',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'FD Bypass/Nashville/Ecompass and Elavon processor',
    resources: [
      { id: 'r-26', name: 'Pravallika Saladi', tasks: [], color: 'bg-rose-50 border-rose-200 text-rose-700' },
      { id: 'r-27', name: 'Devi Sri Lakshmi Gudimetla', tasks: [], color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { id: 'r-28', name: 'Venkata Lakshmi Siva Swetha Edara', tasks: [], color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
    ]
  },
  {
    id: 'l-9',
    name: 'Prakash Borude',
    role: 'Module Lead',
    team: 'Java Team',
    scope: 'Settlement & File Processing',
    resources: [
      { id: 'r-29', name: 'Nilesh Dhongade', tasks: [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { id: 'r-30', name: 'Kalyani Wable', tasks: [], color: 'bg-purple-50 border-purple-200 text-purple-700' },
      { id: 'r-31', name: 'Raghav Naulakha', tasks: [], color: 'bg-pink-50 border-pink-200 text-pink-700' },
    ]
  },
  {
    id: 'l-10',
    name: 'Vishal Gaikwad',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'Petro and US',
    resources: [
      { id: 'r-32', name: 'Akash Deshmukh', tasks: [], color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { id: 'r-33', name: 'Arjav Jain', tasks: [], color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
      { id: 'r-34', name: 'Tushar Pathak', tasks: [], color: 'bg-rose-50 border-rose-200 text-rose-700' },
    ]
  },
  {
    id: 'l-11',
    name: 'Sanket Bargal',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'Europe & US',
    resources: [
      { id: 'r-35', name: 'Shivam Sonawane', tasks: [], color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { id: 'r-36', name: 'Kunal Shinde', tasks: [], color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
      { id: 'r-37', name: 'Nityananda Reddy Thalla', tasks: [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
    ]
  },
  {
    id: 'l-12',
    name: 'Vrushabh Mundhe',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'US & Canada',
    resources: [
      { id: 'r-38', name: 'Prabhat Kashyap', tasks: [], color: 'bg-purple-50 border-purple-200 text-purple-700' },
      { id: 'r-39', name: 'Shivam Vishwakarma', tasks: [], color: 'bg-pink-50 border-pink-200 text-pink-700' },
    ]
  },
  {
    id: 'l-13',
    name: 'Krunal Doshi',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'Production Issues POC',
    resources: [
      { id: 'r-40', name: 'Manish Mahajan', tasks: [], color: 'bg-amber-50 border-amber-200 text-amber-700' },
    ]
  },
  {
    id: 'l-14',
    name: 'Rohit Sonawane',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'Certification AI Team',
    resources: [
      { id: 'r-41', name: 'Mahidhar Karnati', tasks: [], color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
      { id: 'r-42', name: 'Karthika Priya Sivapuram', tasks: [], color: 'bg-rose-50 border-rose-200 text-rose-700' },
    ]
  },
  {
    id: 'l-15',
    name: 'Nitesh Kharose',
    role: 'Scrum Master',
    team: 'EMV Team',
    scope: 'Project Management',
    resources: [
      { id: 'r-43', name: 'Anash Raj', tasks: [], color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { id: 'r-44', name: 'Vijayakumar Reddy Ronda', tasks: [], color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
      { id: 'r-45', name: 'Lokeswari Bellamkonda', tasks: [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { id: 'r-46', name: 'Kritika Singh', tasks: [], color: 'bg-purple-50 border-purple-200 text-purple-700' },
    ]
  }
];

// --- Components ---

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_DATA);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(INITIAL_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [newLeadName, setNewLeadName] = useState('');
  const [newResourceName, setNewResourceName] = useState('');
  const [newTaskNames, setNewTaskNames] = useState<Record<string, string>>({});
  const [newTaskDates, setNewTaskDates] = useState<Record<string, string>>({});
  const [newTaskStatuses, setNewTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editingResourceName, setEditingResourceName] = useState('');

  const RESOURCE_COLORS = [
    'bg-blue-50 border-blue-200 text-blue-700',
    'bg-purple-50 border-purple-200 text-purple-700',
    'bg-pink-50 border-pink-200 text-pink-700',
    'bg-amber-50 border-amber-200 text-amber-700',
    'bg-emerald-50 border-emerald-200 text-emerald-700',
    'bg-rose-50 border-rose-200 text-rose-700',
    'bg-indigo-50 border-indigo-200 text-indigo-700',
    'bg-cyan-50 border-cyan-200 text-cyan-700',
  ];

  const getResourceColor = (index: number) => RESOURCE_COLORS[index % RESOURCE_COLORS.length];

  const selectedLead = useMemo(() => 
    leads.find(l => l.id === selectedLeadId) || leads[0], 
    [leads, selectedLeadId]
  );

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter(l => 
      l.name.toLowerCase().includes(query) ||
      l.team.toLowerCase().includes(query) ||
      l.scope.toLowerCase().includes(query) ||
      l.resources.some(r => 
        r.name.toLowerCase().includes(query) ||
        r.tasks.some(t => t.name.toLowerCase().includes(query))
      )
    );
  }, [leads, searchQuery]);

  const addLead = () => {
    if (!newLeadName.trim()) return;
    const newLead: Lead = {
      id: `l-${Date.now()}`,
      name: newLeadName,
      role: 'Team Lead',
      team: 'General',
      scope: 'New Scope',
      resources: []
    };
    setLeads(prev => [...prev, newLead]);
    setSelectedLeadId(newLead.id);
    setNewLeadName('');
  };

  const addResource = () => {
    if (!newResourceName.trim()) return;
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: [
          ...l.resources, 
          { 
            id: `r-${Date.now()}`, 
            name: newResourceName, 
            tasks: [],
            color: getResourceColor(l.resources.length)
          }
        ]
      };
    }));
    setNewResourceName('');
  };

  const renameResource = (resourceId: string) => {
    if (!editingResourceName.trim()) return;
    setLeads(prev => prev.map(l => ({
      ...l,
      resources: l.resources.map(r => r.id === resourceId ? { ...r, name: editingResourceName } : r)
    })));
    setEditingResourceId(null);
    setEditingResourceName('');
  };

  const moveResource = (resourceId: string, targetLeadId: string) => {
    setLeads(prev => {
      let resourceToMove: Resource | null = null;
      
      // Find and remove resource
      const updatedLeads = prev.map(l => {
        const resourceIndex = l.resources.findIndex(r => r.id === resourceId);
        if (resourceIndex !== -1) {
          resourceToMove = { ...l.resources[resourceIndex] };
          return {
            ...l,
            resources: l.resources.filter(r => r.id !== resourceId)
          };
        }
        return l;
      });

      if (!resourceToMove) return prev;

      // Add to target lead
      return updatedLeads.map(l => {
        if (l.id === targetLeadId) {
          return {
            ...l,
            resources: [...l.resources, resourceToMove!]
          };
        }
        return l;
      });
    });
  };

  const addTask = (resourceId: string) => {
    const taskName = newTaskNames[resourceId];
    const taskDate = newTaskDates[resourceId] || new Date().toISOString().split('T')[0];
    const taskStatus = newTaskStatuses[resourceId] || 'in progress';
    
    if (!taskName || !taskName.trim()) return;

    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: l.resources.map(r => {
          if (r.id !== resourceId) return r;
          return {
            ...r,
            tasks: [...r.tasks, { 
              id: `t-${Date.now()}`, 
              name: taskName, 
              date: taskDate,
              status: taskStatus
            }]
          };
        })
      };
    }));
    setNewTaskNames(prev => ({ ...prev, [resourceId]: '' }));
    setNewTaskDates(prev => ({ ...prev, [resourceId]: '' }));
    setNewTaskStatuses(prev => ({ ...prev, [resourceId]: 'in progress' }));
  };

  const updateTaskStatus = (resourceId: string, taskId: string, status: TaskStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: l.resources.map(r => {
          if (r.id !== resourceId) return r;
          return {
            ...r,
            tasks: r.tasks.map(t => t.id === taskId ? { ...t, status } : t)
          };
        })
      };
    }));
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => {
      const newLeads = prev.filter(l => l.id !== leadId);
      if (leadId === selectedLeadId && newLeads.length > 0) {
        setSelectedLeadId(newLeads[0].id);
      }
      return newLeads;
    });
  };

  const deleteResource = (resourceId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: l.resources.filter(r => r.id !== resourceId)
      };
    }));
  };

  const deleteTask = (resourceId: string, taskId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: l.resources.map(r => {
          if (r.id !== resourceId) return r;
          return {
            ...r,
            tasks: r.tasks.filter(t => t.id !== taskId)
          };
        })
      };
    }));
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-[#0F172A] font-sans overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar: Leads List */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
      `}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Sumant Upasani</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Product Manager</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads, teams, scope..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hierarchy</p>
          {filteredLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => {
                setSelectedLeadId(lead.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center justify-between p-3 rounded-xl transition-all group border
                ${selectedLeadId === lead.id 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-600 border-transparent'}
              `}
            >
              <div className="flex items-center gap-3 text-left">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${selectedLeadId === lead.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}
                `}>
                  {lead.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold leading-tight truncate">{lead.name}</p>
                    {lead.role === 'Module Lead' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" title="Module Lead"></span>
                    )}
                  </div>
                  <p className="text-[10px] opacity-60 font-medium truncate">{lead.role} • {lead.team}</p>
                </div>
              </div>
              <ChevronRight size={14} className={`transition-transform ${selectedLeadId === lead.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="New lead name..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLead()}
            />
            <button 
              onClick={addLead}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content: Resources & Tasks */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-[#F8FAFC]">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <UserCircle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {selectedLead.name}
                <span className={`
                  text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest
                  ${selectedLead.role === 'Module Lead' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}
                `}>
                  {selectedLead.role}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedLead.team}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Manager: Mangesh Bhosale</p>
              <p className="text-lg font-black text-slate-700">{selectedLead.resources.length} Members</p>
            </div>
            <button 
              onClick={() => deleteLead(selectedLead.id)}
              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete Lead"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Scope Info */}
            <div className="mb-8 p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:scale-110"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">Scope of Task</p>
                <h3 className="text-3xl font-black leading-tight max-w-2xl italic serif">{selectedLead.scope}</h3>
              </div>
            </div>

            {/* Add Resource Input */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex gap-3">
              <input 
                type="text" 
                placeholder={`Add new member under ${selectedLead.name}...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addResource()}
              />
              <button 
                onClick={addResource}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-200"
              >
                <Plus size={18} />
                <span>Add Member</span>
              </button>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              <AnimatePresence mode="popLayout">
                {selectedLead.resources.map((resource) => (
                  <motion.div 
                    key={resource.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden flex flex-col group"
                  >
                    {/* Resource Header */}
                    <div className={`p-5 border-b flex items-center justify-between ${resource.color || 'bg-white border-slate-100'}`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          {editingResourceId === resource.id ? (
                            <div className="flex gap-2">
                              <input 
                                autoFocus
                                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                value={editingResourceName}
                                onChange={(e) => setEditingResourceName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && renameResource(resource.id)}
                                onBlur={() => setEditingResourceId(null)}
                              />
                            </div>
                          ) : (
                            <h3 
                              className="font-bold text-slate-800 leading-tight text-base cursor-pointer hover:text-indigo-600 transition-colors"
                              onClick={() => {
                                setEditingResourceId(resource.id);
                                setEditingResourceName(resource.name);
                              }}
                            >
                              {resource.name}
                            </h3>
                          )}
                          <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Resource</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <select 
                          className="text-[10px] bg-white/50 border-none rounded-lg px-2 py-1 font-bold text-slate-500 focus:ring-0 cursor-pointer hover:bg-white transition-colors"
                          onChange={(e) => moveResource(resource.id, e.target.value)}
                          value={selectedLeadId}
                          title="Move to another lead"
                        >
                          <option disabled value={selectedLeadId}>Move to...</option>
                          {leads.filter(l => l.id !== selectedLeadId).map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => deleteResource(resource.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="p-5 flex-1 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task Backlog ({resource.tasks.length})</span>
                      </div>
                      
                      <div className="space-y-2">
                        {resource.tasks.map((task) => (
                          <div 
                            key={task.id}
                            className={`
                              flex flex-col p-3 rounded-xl border transition-all group/task
                              ${task.status === 'done' ? 'bg-emerald-50/30 border-emerald-100/50' : 'bg-slate-50/50 border-transparent hover:border-indigo-200 hover:bg-white'}
                            `}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`
                                  w-2 h-2 rounded-full flex-shrink-0
                                  ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'stuck' ? 'bg-red-500' : 'bg-amber-500'}
                                `}></div>
                                <span className={`text-sm font-medium truncate transition-all ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {task.name}
                                </span>
                              </div>
                              <button 
                                onClick={() => deleteTask(resource.id, task.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-task-hover:opacity-100 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1 pl-5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400">{task.date}</span>
                                <select 
                                  value={task.status}
                                  onChange={(e) => updateTaskStatus(resource.id, task.id, e.target.value as TaskStatus)}
                                  className={`
                                    text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border-none focus:ring-0 cursor-pointer
                                    ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700' : task.status === 'stuck' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
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

                      {resource.tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-slate-300">
                          <CheckSquare size={24} className="mb-2 opacity-20" />
                          <p className="text-[11px] font-medium italic">No active tasks</p>
                        </div>
                      )}
                    </div>

                    {/* Add Task Input */}
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Assign new task..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          value={newTaskNames[resource.id] || ''}
                          onChange={(e) => setNewTaskNames(prev => ({ ...prev, [resource.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && addTask(resource.id)}
                        />
                        <button 
                          onClick={() => addTask(resource.id)}
                          className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="date" 
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={newTaskDates[resource.id] || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setNewTaskDates(prev => ({ ...prev, [resource.id]: e.target.value }))}
                        />
                        <select 
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={newTaskStatuses[resource.id] || 'in progress'}
                          onChange={(e) => setNewTaskStatuses(prev => ({ ...prev, [resource.id]: e.target.value as TaskStatus }))}
                        >
                          <option value="in progress">In Progress</option>
                          <option value="done">Done</option>
                          <option value="stuck">Stuck</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedLead.resources.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <User size={28} />
                  </div>
                  <p className="text-lg font-bold">No members assigned</p>
                  <p className="text-sm">Start by adding a new member for {selectedLead.name}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
