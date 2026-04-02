/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  UserCircle,
  Menu,
  X,
  BarChart3,
  LogOut,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Imports ---
import { TaskStatus, Task, Resource, Lead, UserAccount, CurrentUser } from './types';
import { INITIAL_DATA } from './initialData';
import { useAppData } from './hooks/useAppData';
import Sidebar from './components/Sidebar';
import ResourceDetailModal from './components/ResourceDetailModal';
import UserModal from './components/UserModal';
import SearchView from './components/SearchView';
import UsersView from './components/UsersView';
import TeamView from './components/TeamView';
import ReportsView from './components/ReportsView';
import LoginScreen from './components/LoginScreen';

// --- Main App ---

export default function App() {
  const { leads, setLeads, users, setUsers, isDataLoaded, syncAction } = useAppData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'team' | 'users'>('dashboard');
  const [currentView, setCurrentView] = useState<'team' | 'reports' | 'search' | 'users'>('team');
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState<Partial<UserAccount>>({
    username: '',
    password: '',
    role: 'user',
    name: ''
  });

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
  const [reportFilter, setReportFilter] = useState<{ type: 'status' | 'lead' | null, value: string | null }>({ type: null, value: null });
  const [selectedResourceDetail, setSelectedResourceDetail] = useState<Resource | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);

  const RESOURCE_COLORS = [
    'bg-slate-950 border-slate-900 text-white',
    'bg-indigo-950 border-indigo-900 text-white',
    'bg-blue-950 border-blue-900 text-white',
    'bg-purple-950 border-purple-900 text-white',
    'bg-emerald-950 border-emerald-900 text-white',
    'bg-rose-950 border-rose-900 text-white',
    'bg-amber-950 border-amber-900 text-white',
    'bg-cyan-950 border-cyan-900 text-white',
  ];

  const getResourceColor = (index: number) => RESOURCE_COLORS[index % RESOURCE_COLORS.length];

  const selectedLead = useMemo(() => {
    if (!leads || leads.length === 0) return null;
    return leads.find(l => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  const filteredLeads = useMemo(() => {
    let baseLeads = leads;
    
    // RBAC: If user is not admin and is a resource, they might only see their lead
    // But the prompt says "Only users or resources assigned to specific tasks can access certain information."
    // Let's interpret this as: if you are a resource, you only see the lead you belong to, and only your own card.
    if (!currentUser.isAdmin && currentUser.role === 'Resource') {
      baseLeads = leads.filter(l => (l.resources || []).some(r => r.id === currentUser.id));
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
      (l.resources || []).some(r => 
        r.name.toLowerCase().includes(query) ||
        (r.tasks || []).some(t => t.name.toLowerCase().includes(query))
      )
    );
  }, [leads, searchQuery, currentUser]);

  const addLead = useCallback(() => {
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
    syncAction('ADD_LEAD', newLead);
    setLeads(prev => [...prev, newLead]);
    setSelectedLeadId(newLead.id);
    setNewLeadName('');
  }, [newLeadName, syncAction, setLeads, setSelectedLeadId]);

  const toggleAdmin = useCallback((leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const newIsAdmin = !lead.isAdmin;
    syncAction('UPDATE_LEAD', { id: leadId, isAdmin: newIsAdmin });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, isAdmin: newIsAdmin } : l));
  }, [leads, syncAction, setLeads]);

  const handleSaveUser = useCallback(() => {
    if (!userForm.username || !userForm.name || !userForm.role) return;
    
    if (editingUser) {
      const updatedUser = { ...editingUser, ...userForm } as UserAccount;
      syncAction('UPDATE_USER', updatedUser);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
    } else {
      const newUser: UserAccount = {
        id: `u-${Date.now()}`,
        username: userForm.username!,
        password: userForm.password || 'password',
        role: userForm.role as any,
        name: userForm.name!
      };
      syncAction('ADD_USER', newUser);
      setUsers(prev => [...prev, newUser]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserForm({ username: '', password: '', role: 'user', name: '' });
  }, [userForm, editingUser, syncAction, setUsers]);

  const handleDeleteUser = useCallback((userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      syncAction('DELETE_USER', { id: userId });
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  }, [syncAction, setUsers]);

  const addResource = useCallback(() => {
    if (!newResourceName.trim() || !selectedLead) return;
    const newRes = { 
      id: `r-${Date.now()}`, 
      leadId: selectedLeadId,
      name: newResourceName, 
      tasks: [], 
      color: getResourceColor((selectedLead?.resources || []).length) 
    };
    syncAction('ADD_RESOURCE', newRes);
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: [...(l.resources || []), newRes]
      };
    }));
    setNewResourceName('');
  }, [newResourceName, selectedLeadId, selectedLead?.resources?.length, syncAction, setLeads]);

  const renameResource = useCallback((resourceId: string) => {
    if (!editingResourceName.trim()) return;
    syncAction('UPDATE_RESOURCE', { id: resourceId, name: editingResourceName });
    setLeads(prev => prev.map(l => {
      const isLeadResource = (l.resources || []).some(r => r.id === resourceId && r.name === l.name);
      return {
        ...l,
        name: isLeadResource ? editingResourceName : l.name,
        resources: (l.resources || []).map(r => r.id === resourceId ? { ...r, name: editingResourceName } : r)
      };
    }));
    // Update currentUser if it's the one being renamed
    if (currentUser.id === resourceId) {
      setCurrentUser(prev => ({ ...prev, name: editingResourceName }));
    }
    setEditingResourceId(null);
    setEditingResourceName('');
  }, [editingResourceName, syncAction, setLeads, currentUser.id]);

  const moveResource = useCallback((resourceId: string, targetLeadId: string) => {
    syncAction('MOVE_RESOURCE', { id: resourceId, targetLeadId });
    setLeads(prev => {
      let resourceToMove: Resource | null = null;
      
      // Find and remove resource
      const updatedLeads = prev.map(l => {
        const resourceIndex = (l.resources || []).findIndex(r => r.id === resourceId);
        if (resourceIndex !== -1) {
          resourceToMove = { ...(l.resources || [])[resourceIndex] };
          return {
            ...l,
            resources: (l.resources || []).filter(r => r.id !== resourceId)
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
            resources: [...(l.resources || []), resourceToMove!]
          };
        }
        return l;
      });
    });
  }, [syncAction, setLeads]);

  const addTask = useCallback((resourceId: string) => {
    const taskName = newTaskNames[resourceId];
    const taskDate = newTaskDates[resourceId] || new Date().toISOString().split('T')[0];
    const taskStatus = newTaskStatuses[resourceId] || 'in progress';
    
    if (!taskName || !taskName.trim()) return;

    const newTask: Task = { 
      id: `t-${Date.now()}`, 
      name: taskName, 
      date: taskDate,
      status: taskStatus as TaskStatus
    };

    syncAction('ADD_TASK', { ...newTask, resourceId });

    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: (l.resources || []).map(r => {
          if (r.id !== resourceId) return r;
          return {
            ...r,
            tasks: [...(r.tasks || []), newTask]
          };
        })
      };
    }));
    setNewTaskNames(prev => ({ ...prev, [resourceId]: '' }));
    setNewTaskDates(prev => ({ ...prev, [resourceId]: '' }));
    setNewTaskStatuses(prev => ({ ...prev, [resourceId]: 'in progress' }));
  }, [newTaskNames, newTaskDates, newTaskStatuses, selectedLeadId, syncAction, setLeads]);

  const updateTaskStatus = useCallback((resourceId: string, taskId: string, status: TaskStatus) => {
    syncAction('UPDATE_TASK_STATUS', { id: taskId, status });
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: (l.resources || []).map(r => {
          if (r.id !== resourceId) return r;
          return {
            ...r,
            tasks: (r.tasks || []).map(t => t.id === taskId ? { ...t, status } : t)
          };
        })
      };
    }));
  }, [selectedLeadId, syncAction, setLeads]);

  const deleteLead = useCallback((leadId: string) => {
    syncAction('DELETE_LEAD', { id: leadId });
    setLeads(prev => {
      const newLeads = prev.filter(l => l.id !== leadId);
      if (leadId === selectedLeadId && newLeads.length > 0) {
        setSelectedLeadId(newLeads[0].id);
      }
      return newLeads;
    });
  }, [selectedLeadId, syncAction, setLeads, setSelectedLeadId]);

  const deleteResource = useCallback((resourceId: string) => {
    syncAction('DELETE_RESOURCE', { id: resourceId });
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: (l.resources || []).filter(r => r.id !== resourceId)
      };
    }));
  }, [selectedLeadId, syncAction, setLeads]);

  const deleteTask = useCallback((resourceId: string, taskId: string) => {
    syncAction('DELETE_TASK', { id: taskId });
    setLeads(prev => prev.map(l => {
      if (l.id !== selectedLeadId) return l;
      return {
        ...l,
        resources: (l.resources || []).map(r => {
          if (r.id !== resourceId) return r;
          return {
            ...r,
            tasks: (r.tasks || []).filter(t => t.id !== taskId)
          };
        })
      };
    }));
  }, [selectedLeadId, syncAction, setLeads]);

  // --- Chart Data Calculations ---
  const reportData = useMemo(() => {
    const statusCounts = { 'in progress': 0, 'done': 0, 'stuck': 0 };
    const leadTaskCounts: any[] = [];
    const resourceTaskCounts: any[] = [];

    leads.forEach(lead => {
      let leadTasks = 0;
      (lead.resources || []).forEach(res => {
        const tasksCount = (res.tasks || []).length;
        leadTasks += tasksCount;
        resourceTaskCounts.push({ name: res.name, tasks: tasksCount, lead: lead.name });
        (res.tasks || []).forEach(task => {
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
        (lead.resources || []).forEach(res => {
          (res.tasks || []).forEach(task => {
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
        (lead.resources || []).forEach(res => {
          (res.tasks || []).forEach(task => {
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

  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase();
    const results: { 
      resourceId: string,
      resourceName: string, 
      leadName: string, 
      leadId: string,
      resourceColor: string, 
      tasks: Task[] 
    }[] = [];
    
    leads.forEach(lead => {
      (lead.resources || []).forEach((resource, idx) => {
        const matchesName = lead.name.toLowerCase().includes(query) || resource.name.toLowerCase().includes(query);
        const matchingTasks = (resource.tasks || []).filter(t => t.name.toLowerCase().includes(query));
        
        if (matchesName || matchingTasks.length > 0) {
          results.push({
            resourceId: resource.id,
            resourceName: resource.name,
            leadId: lead.id,
            leadName: lead.name,
            resourceColor: resource.color || getResourceColor(idx),
            tasks: matchesName ? (resource.tasks || []) : matchingTasks
          });
        }
      });
    });
    return results;
  }, [leads, globalSearchQuery]);

  const resourceChartData = useMemo(() => {
    if (!selectedResourceDetail) return [];
    const counts = { 'in progress': 0, 'done': 0, 'stuck': 0 };
    selectedResourceDetail.tasks.forEach(t => counts[t.status]++);
    return [
      { name: 'In Progress', value: counts['in progress'], color: '#f59e0b' },
      { name: 'Done', value: counts['done'], color: '#10b981' },
      { name: 'Stuck', value: counts['stuck'], color: '#ef4444' },
    ].filter(d => d.value > 0);
  }, [selectedResourceDetail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      if (response.ok) {
        const { user } = await response.json();
        setCurrentUser({
          id: user.id,
          name: user.name,
          role: user.role === 'super_admin' ? 'Super Administrator' : user.role === 'admin' ? 'Administrator' : 'User',
          isAdmin: user.role === 'super_admin' || user.role === 'admin'
        });
        setIsAuthenticated(true);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    // Fallback for resource-based login if not in users table yet
    // Regular Admin/Lead Check
    const leadMatch = leads.find(l => l.name.toLowerCase().split(' ')[0] === loginForm.username.toLowerCase());
    if (leadMatch && loginForm.password === 'password') {
      setCurrentUser({
        id: leadMatch.id,
        name: leadMatch.name,
        role: 'Team Lead',
        isAdmin: true
      });
      setSelectedLeadId(leadMatch.id);
      setIsAuthenticated(true);
      return;
    }

    // Resource Check
    let resourceMatch: { r: Resource, l: Lead } | null = null;
    leads.forEach(l => {
      const r = (l.resources || []).find(res => res.name.toLowerCase().split(' ')[0] === loginForm.username.toLowerCase());
      if (r) resourceMatch = { r, l };
    });

    if (resourceMatch && loginForm.password === 'password') {
      setCurrentUser({
        id: resourceMatch.r.id,
        name: resourceMatch.r.name,
        role: 'Resource',
        isAdmin: false
      });
      setSelectedLeadId(resourceMatch.l.id);
      setIsAuthenticated(true);
      return;
    }

    setLoginError('Invalid username or password. (Try admin/admin)');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Syncing Data...</p>
      </div>
    );
  }

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
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredLeads={filteredLeads}
        selectedLeadId={selectedLeadId}
        setSelectedLeadId={setSelectedLeadId}
        newLeadName={newLeadName}
        setNewLeadName={setNewLeadName}
        addLead={addLead}
      />

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
                {currentView === 'reports' ? 'Organization Reports' : currentView === 'search' ? 'Global Task Search' : selectedLead?.name}
                {currentView === 'team' && selectedLead?.isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30">
                    Admin
                  </span>
                )}
                {currentView === 'team' && selectedLead && (
                  <span className={`
                    text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest
                    ${selectedLead.role === 'Module Lead' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}
                  `}>
                    {selectedLead.role}
                  </span>
                )}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {currentView === 'reports' ? 'Visualizing team productivity' : currentView === 'search' ? 'Search tasks by name or keyword' : selectedLead?.team}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className={`relative transition-all duration-300 ${isHeaderSearchFocused ? 'w-80' : 'w-64'}`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isHeaderSearchFocused ? 'text-indigo-400' : 'text-white/40'}`} size={16} />
              <input 
                type="text" 
                placeholder="Search tasks, names..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  if (currentView !== 'search') setCurrentView('search');
                }}
                onFocus={() => setIsHeaderSearchFocused(true)}
                onBlur={() => setIsHeaderSearchFocused(false)}
              />
            </div>

            <div className="flex items-center gap-4 border-r border-slate-800 pr-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sr. Practice Head</p>
                <p className="text-sm font-black text-white">Mangesh Bhosale</p>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                <UserCircle size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4 border-r border-slate-800 pr-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Manager</p>
                <p className="text-sm font-black text-white">Sumant Upasani</p>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                <UserCircle size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <p className="text-xs font-black text-white">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {currentView === 'search' ? (
              <SearchView 
                globalSearchQuery={globalSearchQuery}
                setGlobalSearchQuery={setGlobalSearchQuery}
                globalSearchResults={globalSearchResults}
                setSelectedLeadId={setSelectedLeadId}
                setCurrentView={setCurrentView}
              />
            ) : currentView === 'users' ? (
              <UsersView 
                users={users}
                setEditingUser={setEditingUser}
                setUserForm={setUserForm}
                setIsUserModalOpen={setIsUserModalOpen}
                deleteUser={handleDeleteUser}
              />
            ) : currentView === 'team' ? (
              selectedLead ? (
                <TeamView 
                  selectedLead={selectedLead}
                  currentUser={currentUser}
                  newResourceName={newResourceName}
                  setNewResourceName={setNewResourceName}
                  addResource={addResource}
                  editingResourceId={editingResourceId}
                  setEditingResourceId={setEditingResourceId}
                  editingResourceName={editingResourceName}
                  setEditingResourceName={setEditingResourceName}
                  renameResource={renameResource}
                  moveResource={moveResource}
                  leads={leads}
                  selectedLeadId={selectedLeadId}
                  setSelectedResourceDetail={setSelectedResourceDetail}
                  deleteResource={deleteResource}
                  updateTaskStatus={updateTaskStatus}
                  deleteTask={deleteTask}
                  newTaskNames={newTaskNames}
                  setNewTaskNames={setNewTaskNames}
                  addTask={addTask}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <p className="text-sm font-bold uppercase tracking-widest">No lead selected or available</p>
                </div>
              )
            ) : (
              <ReportsView 
                reportData={reportData}
                setReportFilter={setReportFilter}
                reportFilter={reportFilter}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ResourceDetailModal 
        selectedResourceDetail={selectedResourceDetail}
        setSelectedResourceDetail={setSelectedResourceDetail}
        resourceChartData={resourceChartData}
      />

      <UserModal 
        isUserModalOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
        editingUser={editingUser}
        userForm={userForm}
        setUserForm={setUserForm}
        handleSaveUser={handleSaveUser}
      />
    </div>
  );
}
