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
  X,
  LayoutDashboard,
  Users2,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';

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
  isAdmin?: boolean;
}

// --- Initial Data ---

const INITIAL_DATA: Lead[] = [
  {
    id: 'l-0',
    name: 'Kalyani Raut',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'MPOC/CPOC/HSM Task',
    isAdmin: true,
    resources: [
      { id: 'r-0', name: 'Kalyani Raut', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-1', name: 'Ishita Sakhala', tasks: [], color: 'bg-white border-slate-200 text-slate-900' },
      { id: 'r-2', name: 'Akhila Ravi', tasks: [], color: 'bg-indigo-50 border-indigo-100 text-indigo-900' },
    ]
  },
  {
    id: 'l-2',
    name: 'Pratik Patil',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'FIS Raft ISO, 610 processor, Stargate and Getnet processor',
    isAdmin: true,
    resources: [
      { id: 'r-p1', name: 'Pratik Patil', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-3', name: 'Shivani Saknure', tasks: [], color: 'bg-blue-50 border-blue-100 text-blue-900' },
      { id: 'r-4', name: 'Anusha Kanthed', tasks: [], color: 'bg-purple-50 border-purple-100 text-purple-900' },
      { id: 'r-5', name: 'Harshita Bhavanasi', tasks: [], color: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
      { id: 'r-6', name: 'Shubham Gilbile', tasks: [], color: 'bg-rose-50 border-rose-100 text-rose-900' },
    ]
  },
  {
    id: 'l-3',
    name: 'HemantKumar Nikole',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'OTC Processors',
    isAdmin: true,
    resources: [
      { id: 'r-h1', name: 'HemantKumar Nikole', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-11', name: 'Paraj Jain', tasks: [], color: 'bg-amber-50 border-amber-100 text-amber-900' },
    ]
  },
  {
    id: 'l-4',
    name: 'Dipak Pawar',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'Amex and All Gift processor Certifications',
    isAdmin: true,
    resources: [
      { id: 'r-d1', name: 'Dipak Pawar', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-12', name: 'Prathamesh Chitodkar', tasks: [], color: 'bg-cyan-50 border-cyan-100 text-cyan-900' },
    ]
  },
  {
    id: 'l-6',
    name: 'Harshal Chaudhari',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'Chase ISO/UTF/Stratus Processor, BlackHawk Processor, In-Store Wallets, Check Processor and PLCC Processor',
    isAdmin: true,
    resources: [
      { id: 'r-h2', name: 'Harshal Chaudhari', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-13', name: 'Atharva Sharma', tasks: [], color: 'bg-white border-slate-200 text-slate-900' },
      { id: 'r-19', name: 'Vaishnavi Mate', tasks: [], color: 'bg-indigo-50 border-indigo-100 text-indigo-900' },
      { id: 'r-14', name: 'Kartik Macharre', tasks: [], color: 'bg-blue-50 border-blue-100 text-blue-900' },
      { id: 'r-20', name: 'Naga Mani Gatti', tasks: [], color: 'bg-purple-50 border-purple-100 text-purple-900' },
      { id: 'r-15', name: 'Swagata Ranagar', tasks: [], color: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
      { id: 'r-21', name: 'Ashrin Shaik', tasks: [], color: 'bg-rose-50 border-rose-100 text-rose-900' },
      { id: 'r-16', name: 'Sumith Venkat Nallabothula', tasks: [], color: 'bg-amber-50 border-amber-100 text-amber-900' },
      { id: 'r-22', name: 'Praneetha Chandragiri', tasks: [], color: 'bg-cyan-50 border-cyan-100 text-cyan-900' },
      { id: 'r-17', name: 'Deepti Soni', tasks: [], color: 'bg-white border-slate-200 text-slate-900' },
      { id: 'r-18', name: 'Lekana Somayajula', tasks: [], color: 'bg-indigo-50 border-indigo-100 text-indigo-900' },
    ]
  },
  {
    id: 'l-7',
    name: 'Gayatri Kelhe',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'FD Bypass/Nashville/Ecompass and Elavon processor',
    isAdmin: true,
    resources: [
      { id: 'r-g1', name: 'Gayatri Kelhe', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-23', name: 'Vaka Yuva Sai Reddy', tasks: [], color: 'bg-blue-50 border-blue-100 text-blue-900' },
      { id: 'r-24', name: 'Vishnu Vardhan Lekkala', tasks: [], color: 'bg-purple-50 border-purple-100 text-purple-900' },
      { id: 'r-25', name: 'Mani Teja Chittabattina', tasks: [], color: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
    ]
  },
  {
    id: 'l-8',
    name: 'Amol Datal',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'FD Bypass/Nashville/Ecompass and Elavon processor',
    isAdmin: true,
    resources: [
      { id: 'r-a1', name: 'Amol Datal', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-26', name: 'Pravallika Saladi', tasks: [], color: 'bg-rose-50 border-rose-100 text-rose-900' },
      { id: 'r-27', name: 'Devi Sri Lakshmi Gudimetla', tasks: [], color: 'bg-amber-50 border-amber-100 text-amber-900' },
      { id: 'r-28', name: 'Venkata Lakshmi Siva Swetha Edara', tasks: [], color: 'bg-cyan-50 border-cyan-100 text-cyan-900' },
    ]
  },
  {
    id: 'l-9',
    name: 'Prakash Borude',
    role: 'Module Lead',
    team: 'Java Team',
    scope: 'Settlement & File Processing',
    isAdmin: true,
    resources: [
      { id: 'r-p2', name: 'Prakash Borude', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-29', name: 'Nilesh Dhongade', tasks: [{ id: 't-1', name: 'File Processing Logic', date: '2024-03-20', status: 'in progress' }], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-30', name: 'Kalyani Wable', tasks: [{ id: 't-2', name: 'Settlement Reports', date: '2024-03-21', status: 'done' }], color: 'bg-indigo-900 border-indigo-800 text-white' },
      { id: 'r-31', name: 'Raghav Naulakha', tasks: [{ id: 't-3', name: 'Error Handling', date: '2024-03-22', status: 'stuck' }], color: 'bg-blue-900 border-blue-800 text-white' },
    ]
  },
  {
    id: 'l-13',
    name: 'Krunal Doshi',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'Production Issues POC',
    isAdmin: true,
    resources: [
      { id: 'r-k1', name: 'Krunal Doshi', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-40', name: 'Manish Mahajan', tasks: [{ id: 't-4', name: 'Issue Triaging', date: '2024-03-23', status: 'in progress' }], color: 'bg-purple-900 border-purple-800 text-white' },
    ]
  },
  {
    id: 'l-14',
    name: 'Rohit Sonawane',
    role: 'Module Lead',
    team: 'EMV Team',
    scope: 'Certification AI Team',
    isAdmin: true,
    resources: [
      { id: 'r-r1', name: 'Rohit Sonawane', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-41', name: 'Mahidhar Karnati', tasks: [{ id: 't-5', name: 'AI Model Training', date: '2024-03-24', status: 'done' }], color: 'bg-emerald-900 border-emerald-800 text-white' },
      { id: 'r-42', name: 'Karthika Priya Sivapuram', tasks: [{ id: 't-6', name: 'Data Labeling', date: '2024-03-25', status: 'in progress' }], color: 'bg-rose-900 border-rose-800 text-white' },
    ]
  },
  {
    id: 'l-15',
    name: 'Nitesh Kharose',
    role: 'Scrum Master',
    team: 'EMV Team',
    scope: 'Project Management',
    isAdmin: true,
    resources: [
      { id: 'r-n1', name: 'Nitesh Kharose', tasks: [], color: 'bg-slate-900 border-slate-800 text-white' },
      { id: 'r-43', name: 'Anash Raj', tasks: [], color: 'bg-white border-slate-200 text-slate-900' },
      { id: 'r-44', name: 'Vijayakumar Reddy Ronda', tasks: [], color: 'bg-indigo-50 border-indigo-100 text-indigo-900' },
      { id: 'r-45', name: 'Lokeswari Bellamkonda', tasks: [], color: 'bg-blue-50 border-blue-100 text-blue-900' },
      { id: 'r-46', name: 'Kritika Singh', tasks: [], color: 'bg-purple-50 border-purple-100 text-purple-900' },
      { id: 'r-32', name: 'Akash Deshmukh', tasks: [], color: 'bg-purple-50 border-purple-100 text-purple-900' },
      { id: 'r-33', name: 'Arjav Jain', tasks: [], color: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
      { id: 'r-34', name: 'Tushar Pathak', tasks: [], color: 'bg-rose-50 border-rose-100 text-rose-900' },
      { id: 'r-35', name: 'Shivam Sonawane', tasks: [], color: 'bg-amber-50 border-amber-100 text-amber-900' },
      { id: 'r-36', name: 'Kunal Shinde', tasks: [], color: 'bg-cyan-50 border-cyan-100 text-cyan-900' },
      { id: 'r-37', name: 'Nityananda Reddy Thalla', tasks: [], color: 'bg-white border-slate-200 text-slate-900' },
      { id: 'r-38', name: 'Prabhat Kashyap', tasks: [], color: 'bg-indigo-50 border-indigo-100 text-indigo-900' },
      { id: 'r-39', name: 'Shivam Vishwakarma', tasks: [], color: 'bg-blue-50 border-blue-100 text-blue-900' },
    ]
  }
];

// --- Components ---

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_DATA);
  const [currentUser, setCurrentUser] = useState<{ id: string, name: string, role: string, isAdmin: boolean }>({
    id: 'admin',
    name: 'Admin User',
    role: 'Administrator',
    isAdmin: true
  });
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
  const [currentView, setCurrentView] = useState<'team' | 'reports'>('team');
  const [reportFilter, setReportFilter] = useState<{ type: 'status' | 'lead' | null, value: string | null }>({ type: null, value: null });

  const RESOURCE_COLORS = [
    'bg-slate-900 border-slate-800 text-white',
    'bg-indigo-900 border-indigo-800 text-white',
    'bg-blue-900 border-blue-800 text-white',
    'bg-purple-900 border-purple-800 text-white',
    'bg-emerald-900 border-emerald-800 text-white',
    'bg-rose-900 border-rose-800 text-white',
    'bg-amber-900 border-amber-800 text-white',
    'bg-cyan-900 border-cyan-800 text-white',
  ];

  const getResourceColor = (index: number) => RESOURCE_COLORS[index % RESOURCE_COLORS.length];

  const selectedLead = useMemo(() => 
    leads.find(l => l.id === selectedLeadId) || leads[0], 
    [leads, selectedLeadId]
  );

  const filteredLeads = useMemo(() => {
    let baseLeads = leads;
    
    // RBAC: If user is not admin and is a resource, they might only see their lead
    // But the prompt says "Only users or resources assigned to specific tasks can access certain information."
    // Let's interpret this as: if you are a resource, you only see the lead you belong to, and only your own card.
    if (!currentUser.isAdmin && currentUser.role === 'Resource') {
      baseLeads = leads.filter(l => l.resources.some(r => r.id === currentUser.id));
    } else if (!currentUser.isAdmin) {
      // If they are a lead but not admin (though all leads are admins now)
      baseLeads = leads.filter(l => l.id === currentUser.id);
    }

    if (!searchQuery) return baseLeads;
    const query = searchQuery.toLowerCase();
    return baseLeads.filter(l => 
      l.name.toLowerCase().includes(query) ||
      l.team.toLowerCase().includes(query) ||
      l.scope.toLowerCase().includes(query) ||
      l.resources.some(r => 
        r.name.toLowerCase().includes(query) ||
        r.tasks.some(t => t.name.toLowerCase().includes(query))
      )
    );
  }, [leads, searchQuery, currentUser]);

  const addLead = () => {
    if (!newLeadName.trim()) return;
    const newLead: Lead = {
      id: `l-${Date.now()}`,
      name: newLeadName,
      role: 'Team Lead',
      team: 'General',
      scope: 'New Scope',
      isAdmin: true,
      resources: [
        { 
          id: `r-tl-${Date.now()}`, 
          name: newLeadName, 
          tasks: [], 
          color: 'bg-slate-900 border-slate-800 text-white' 
        }
      ]
    };
    setLeads(prev => [...prev, newLead]);
    setSelectedLeadId(newLead.id);
    setNewLeadName('');
  };

  const toggleAdmin = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, isAdmin: !l.isAdmin } : l));
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
    setLeads(prev => prev.map(l => {
      const isLeadResource = l.resources.some(r => r.id === resourceId && r.name === l.name);
      return {
        ...l,
        name: isLeadResource ? editingResourceName : l.name,
        resources: l.resources.map(r => r.id === resourceId ? { ...r, name: editingResourceName } : r)
      };
    }));
    // Update currentUser if it's the one being renamed
    if (currentUser.id === resourceId) {
      setCurrentUser(prev => ({ ...prev, name: editingResourceName }));
    }
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

  // --- Chart Data Calculations ---
  const reportData = useMemo(() => {
    const statusCounts = { 'in progress': 0, 'done': 0, 'stuck': 0 };
    const leadTaskCounts: any[] = [];
    const resourceTaskCounts: any[] = [];

    leads.forEach(lead => {
      let leadTasks = 0;
      lead.resources.forEach(res => {
        const tasksCount = res.tasks.length;
        leadTasks += tasksCount;
        resourceTaskCounts.push({ name: res.name, tasks: tasksCount, lead: lead.name });
        res.tasks.forEach(task => {
          statusCounts[task.status]++;
        });
      });
      leadTaskCounts.push({ name: lead.name, tasks: leadTasks });
    });

    const pieData = [
      { name: 'In Progress', value: statusCounts['in progress'], color: '#f59e0b' },
      { name: 'Done', value: statusCounts['done'], color: '#10b981' },
      { name: 'Stuck', value: statusCounts['stuck'], color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Sort resource productivity to show top performers
    const topResources = [...resourceTaskCounts]
      .sort((a, b) => b.tasks - a.tasks)
      .slice(0, 10);

    // Filtered details based on reportFilter
    let filteredDetails: any[] = [];
    if (reportFilter.type === 'status') {
      leads.forEach(lead => {
        lead.resources.forEach(res => {
          res.tasks.forEach(task => {
            if (task.status === reportFilter.value?.toLowerCase()) {
              filteredDetails.push({
                resource: res.name,
                lead: lead.name,
                task: task.name,
                date: task.date,
                status: task.status
              });
            }
          });
        });
      });
    } else if (reportFilter.type === 'lead') {
      const lead = leads.find(l => l.name === reportFilter.value);
      if (lead) {
        lead.resources.forEach(res => {
          res.tasks.forEach(task => {
            filteredDetails.push({
              resource: res.name,
              lead: lead.name,
              task: task.name,
              date: task.date,
              status: task.status
            });
          });
        });
      }
    }

    return { pieData, leadTaskCounts, topResources, filteredDetails };
  }, [leads, reportFilter]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
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
        w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
      `}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <CheckSquare size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">Certification</h1>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">Management</p>
            </div>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button 
              onClick={() => setCurrentView('team')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'team' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users2 size={14} />
              Team
            </button>
            <button 
              onClick={() => setCurrentView('reports')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'reports' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart3 size={14} />
              Reports
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads, teams..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Team Leads</p>
          {filteredLeads.map((lead) => (
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
                  <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-bold leading-tight truncate ${selectedLeadId === lead.id && currentView === 'team' ? 'text-slate-900' : ''}`}>{lead.name}</p>
                    {lead.isAdmin && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Admin"></span>
                    )}
                  </div>
                  <p className="text-[10px] opacity-60 font-medium truncate">{lead.role} • {lead.team}</p>
                </div>
              </div>
              <ChevronRight size={14} className={`transition-transform ${selectedLeadId === lead.id && currentView === 'team' ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="New lead..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLead()}
            />
            <button 
              onClick={addLead}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-6 flex items-center justify-between shadow-xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
              {currentView === 'reports' ? <BarChart3 size={28} /> : <UserCircle size={28} />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                {currentView === 'reports' ? 'Organization Reports' : selectedLead.name}
                {currentView === 'team' && selectedLead.isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30">
                    Admin
                  </span>
                )}
                {currentView === 'team' && (
                  <span className={`
                    text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest
                    ${selectedLead.role === 'Module Lead' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}
                  `}>
                    {selectedLead.role}
                  </span>
                )}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {currentView === 'reports' ? 'Visualizing team productivity' : selectedLead.team}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-800 pr-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sr. Practice Head</p>
                <p className="text-sm font-black text-white">Mangesh Bhosale</p>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                <UserCircle size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</p>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10">
                  <LayoutDashboard size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 p-2 max-h-[400px] overflow-y-auto">
                  <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Switch Identity</p>
                  <button 
                    onClick={() => setCurrentUser({ id: 'admin', name: 'Admin User', role: 'Administrator', isAdmin: true })}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${currentUser.id === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    Administrator
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <p className="px-3 py-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Team Leads (Admins)</p>
                  {leads.filter(l => l.isAdmin).map(l => (
                    <button 
                      key={l.id}
                      onClick={() => {
                        const tlResource = l.resources.find(r => r.name === l.name);
                        setCurrentUser({ id: tlResource ? tlResource.id : l.id, name: l.name, role: l.role, isAdmin: true });
                        setSelectedLeadId(l.id);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${currentUser.id === l.id || (l.resources.some(r => r.id === currentUser.id && r.name === l.name)) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {l.name}
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 my-1" />
                  <p className="px-3 py-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Resources (Limited)</p>
                  {leads.flatMap(l => l.resources).slice(0, 10).map(r => (
                    <button 
                      key={r.id}
                      onClick={() => {
                        setCurrentUser({ id: r.id, name: r.name, role: 'Resource', isAdmin: false });
                        const lead = leads.find(l => l.resources.some(res => res.id === r.id));
                        if (lead) setSelectedLeadId(lead.id);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${currentUser.id === r.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {currentView === 'team' ? (
              <>
                {/* Scope Info */}
                <div className="mb-8 p-8 bg-white rounded-[2rem] text-slate-900 shadow-xl relative overflow-hidden group border border-slate-200">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:scale-110"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">Scope of Task</p>
                    <h3 className="text-3xl font-black leading-tight max-w-2xl italic text-slate-800">{selectedLead.scope}</h3>
                  </div>
                </div>

                {/* Add Resource Input - Only for Admins */}
                {currentUser.isAdmin && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex gap-3">
                    <input 
                      type="text" 
                      placeholder={`Add new member under ${selectedLead.name}...`}
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
                    {selectedLead.resources
                      .filter(r => currentUser.isAdmin || r.id === currentUser.id)
                      .map((resource) => (
                      <motion.div 
                        key={resource.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/5 transition-all overflow-hidden flex flex-col group"
                      >
                        {/* Resource Header */}
                        <div className={`p-5 border-b flex items-center justify-between ${resource.color || 'bg-slate-900 border-slate-800 text-white'}`}>
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-sm border border-white/20">
                              <User size={20} />
                            </div>
                            <div className="flex-1">
                              {editingResourceId === resource.id && currentUser.isAdmin ? (
                                <div className="flex gap-2">
                                  <input 
                                    autoFocus
                                    className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm font-bold w-full text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                    value={editingResourceName}
                                    onChange={(e) => setEditingResourceName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && renameResource(resource.id)}
                                    onBlur={() => setEditingResourceId(null)}
                                  />
                                </div>
                              ) : (
                                <h3 
                                  className={`font-black leading-tight text-lg tracking-tight ${currentUser.isAdmin ? 'cursor-pointer hover:underline' : ''}`}
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
                              <div className="flex items-center gap-3 mt-0.5">
                                <p className="text-[10px] opacity-70 font-black uppercase tracking-[0.2em]">Resource</p>
                                {resource.tasks.length > 0 && (
                                  <div className="flex gap-0.5 h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                    {['done', 'in progress', 'stuck'].map(status => {
                                      const count = resource.tasks.filter(t => t.status === status).length;
                                      if (count === 0) return null;
                                      const width = (count / resource.tasks.length) * 100;
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
                            <div className="flex items-center gap-1">
                              <div className="relative">
                                <select 
                                  className="appearance-none bg-white/10 border border-white/20 rounded-full pl-4 pr-8 py-1.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer transition-all hover:bg-white/20"
                                  onChange={(e) => moveResource(resource.id, e.target.value)}
                                  value={selectedLeadId}
                                  title="Move to another lead"
                                >
                                  <option disabled value={selectedLeadId}>Move to...</option>
                                  {leads.filter(l => l.id !== selectedLeadId).map(l => (
                                    <option key={l.id} value={l.id} className="text-slate-900">{l.name}</option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
                                  <ChevronRight size={10} className="rotate-90" />
                                </div>
                              </div>
                              <button 
                                onClick={() => deleteResource(resource.id)}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Tasks List */}
                        <div className="p-5 flex-1 space-y-3 bg-slate-50/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task Backlog ({resource.tasks.length})</span>
                          </div>
                          
                          <div className="space-y-2">
                            {resource.tasks.map((task) => (
                              <div 
                                key={task.id}
                                className={`
                                  flex flex-col p-3 rounded-xl border transition-all group/task
                                  ${task.status === 'done' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'}
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
                              <CheckSquare size={24} className="mb-2 opacity-50" />
                              <p className="text-[11px] font-medium italic">No active tasks</p>
                            </div>
                          )}
                        </div>

                        {/* Add Task Input - Only for Admins */}
                        {currentUser.isAdmin && (
                          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="Assign new task..."
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                value={newTaskNames[resource.id] || ''}
                                onChange={(e) => setNewTaskNames(prev => ({ ...prev, [resource.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && addTask(resource.id)}
                              />
                              <button 
                                onClick={() => addTask(resource.id)}
                                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="date" 
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                value={newTaskDates[resource.id] || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setNewTaskDates(prev => ({ ...prev, [resource.id]: e.target.value }))}
                              />
                              <select 
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                value={newTaskStatuses[resource.id] || 'in progress'}
                                onChange={(e) => setNewTaskStatuses(prev => ({ ...prev, [resource.id]: e.target.value as TaskStatus }))}
                              >
                                <option value="in progress">In Progress</option>
                                <option value="done">Done</option>
                                <option value="stuck">Stuck</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {selectedLead.resources.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-300 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <User size={28} />
                      </div>
                      <p className="text-lg font-bold text-slate-400">No members assigned</p>
                      <p className="text-sm text-slate-500">Start by adding a new member for {selectedLead.name}.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-8 pb-20">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion Rate</p>
                      <p className="text-2xl font-black text-slate-900">
                        {Math.round((reportData.pieData.find(d => d.name === 'Done')?.value || 0) / (reportData.pieData.reduce((acc, d) => acc + d.value, 0) || 1) * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <CheckSquare size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks Done</p>
                      <p className="text-2xl font-black text-slate-900">{reportData.pieData.find(d => d.name === 'Done')?.value || 0}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                      <PieChartIcon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Leads</p>
                      <p className="text-2xl font-black text-slate-900">{leads.length}</p>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Task Status Distribution */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PieChartIcon size={20} className="text-indigo-600" />
                        Task Status Distribution
                      </div>
                      {reportFilter.type === 'status' && (
                        <button 
                          onClick={() => setReportFilter({ type: null, value: null })}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Clear Filter
                        </button>
                      )}
                    </h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportData.pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            onClick={(data) => setReportFilter({ type: 'status', value: data.name })}
                            className="cursor-pointer"
                          >
                            {reportData.pieData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                stroke={reportFilter.value === entry.name ? '#000' : 'none'}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tasks per Lead */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={20} className="text-indigo-600" />
                        Tasks per Team Lead
                      </div>
                      {reportFilter.type === 'lead' && (
                        <button 
                          onClick={() => setReportFilter({ type: null, value: null })}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Clear Filter
                        </button>
                      )}
                    </h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={reportData.leadTaskCounts}
                          onClick={(data) => {
                            if (data && data.activeLabel) {
                              setReportFilter({ type: 'lead', value: data.activeLabel });
                            }
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar 
                            dataKey="tasks" 
                            fill="#4f46e5" 
                            radius={[6, 6, 0, 0]} 
                            className="cursor-pointer"
                          >
                            {reportData.leadTaskCounts.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={reportFilter.value === entry.name ? '#312e81' : '#4f46e5'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Filtered Details Section */}
                  {reportFilter.type && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl lg:col-span-2"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <Search size={20} className="text-indigo-600" />
                          Details for {reportFilter.type}: {reportFilter.value}
                        </h3>
                        <button 
                          onClick={() => setReportFilter({ type: null, value: null })}
                          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                          <X size={20} className="text-slate-400" />
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Lead</th>
                              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task</th>
                              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {reportData.filteredDetails.map((detail, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 text-sm font-bold text-slate-900">{detail.resource}</td>
                                <td className="py-4 text-xs font-medium text-slate-500">{detail.lead}</td>
                                <td className="py-4 text-sm text-slate-700">{detail.task}</td>
                                <td className="py-4 text-xs font-bold text-slate-400">{detail.date}</td>
                                <td className="py-4">
                                  <span className={`
                                    text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md
                                    ${detail.status === 'done' ? 'bg-emerald-100 text-emerald-700' : detail.status === 'stuck' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
                                  `}>
                                    {detail.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* Top Performers */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl lg:col-span-2">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                      <TrendingUp size={20} className="text-emerald-600" />
                      Top Resource Productivity
                    </h3>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData.topResources} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                            width={120}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="tasks" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
