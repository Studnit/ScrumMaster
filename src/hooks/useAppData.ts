import { useState, useEffect, useCallback } from 'react';
import { Lead, UserAccount, Resource, Task, TaskStatus } from '../types';
import { INITIAL_DATA } from '../initialData';

export function useAppData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const syncAction = useCallback(async (type: string, payload: any) => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload })
      });
    } catch (error) {
      console.error('Sync error:', error);
    }
  }, []);

  const handleRemoteAction = useCallback((type: string, payload: any) => {
    setLeads(prev => {
      switch (type) {
        case 'INITIALIZE':
          return payload;
        case 'ADD_LEAD':
          return [...prev, payload];
        case 'DELETE_LEAD':
          return prev.filter(l => l.id !== payload.id);
        case 'ADD_RESOURCE':
          return prev.map(l => (l && l.id === payload.leadId) ? { ...l, resources: [...(l.resources || []), payload] } : l);
        case 'DELETE_RESOURCE':
          return prev.map(l => l ? ({ ...l, resources: (l.resources || []).filter(r => r.id !== payload.id) }) : l);
        case 'UPDATE_RESOURCE':
          return prev.map(l => l ? ({
            ...l,
            resources: (l.resources || []).map(r => r.id === payload.id ? { ...r, name: payload.name } : r)
          }) : l);
        case 'ADD_TASK':
          return prev.map(l => l ? ({
            ...l,
            resources: (l.resources || []).map(r => r.id === payload.resourceId ? { ...r, tasks: [...(r.tasks || []), payload] } : r)
          }) : l);
        case 'DELETE_TASK':
          return prev.map(l => l ? ({
            ...l,
            resources: (l.resources || []).map(r => ({ ...r, tasks: (r.tasks || []).filter(t => t.id !== payload.id) }))
          }) : l);
        case 'UPDATE_TASK_STATUS':
          return prev.map(l => l ? ({
            ...l,
            resources: (l.resources || []).map(r => ({
              ...r,
              tasks: (r.tasks || []).map(t => t.id === payload.id ? { ...t, status: payload.status } : t)
            }))
          }) : l);
        case 'MOVE_RESOURCE':
          let resourceToMove: Resource | null = null;
          const leadsWithoutResource = prev.map(l => {
            if (!l) return l;
            const res = (l.resources || []).find(r => r.id === payload.id);
            if (res) {
              resourceToMove = { ...res };
              return { ...l, resources: (l.resources || []).filter(r => r.id !== payload.id) };
            }
            return l;
          });
          if (!resourceToMove) return prev;
          return leadsWithoutResource.map(l => (l && l.id === payload.targetLeadId) ? { ...l, resources: [...(l.resources || []), resourceToMove!] } : l);
        case 'UPDATE_LEAD':
          return prev.map(l => (l && l.id === payload.id) ? { ...l, isAdmin: payload.isAdmin } : l);
        default:
          return prev;
      }
    });
  }, []);

  const handleRemoteUserAction = useCallback((type: string, payload: any) => {
    setUsers(prev => {
      switch (type) {
        case 'ADD_USER':
          return [...prev, payload];
        case 'UPDATE_USER':
          return prev.map(u => u.id === payload.id ? payload : u);
        case 'DELETE_USER':
          return prev.filter(u => u.id !== payload.id);
        default:
          return prev;
      }
    });
  }, []);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(res => {
        const { data, users } = res;
        if (data.length === 0) {
          syncAction('INITIALIZE', INITIAL_DATA);
          setLeads(INITIAL_DATA);
        } else {
          setLeads(data);
        }
        setUsers(users || []);
        setIsDataLoaded(true);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        // Fallback to initial data if fetch fails
        setLeads(INITIAL_DATA);
        setIsDataLoaded(true);
      });

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        if (type.includes('USER')) {
          handleRemoteUserAction(type, payload);
        } else {
          handleRemoteAction(type, payload);
        }
      } catch (e) {
        console.error('WS message error:', e);
      }
    };

    return () => socket.close();
  }, [syncAction, handleRemoteAction, handleRemoteUserAction]);

  return {
    leads,
    setLeads,
    users,
    setUsers,
    isDataLoaded,
    syncAction
  };
}
