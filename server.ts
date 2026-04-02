import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import sqlite3Pkg from 'sqlite3';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { fileURLToPath } from 'url';

const sqlite3 = (sqlite3Pkg as any).default || sqlite3Pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3000;

app.use(express.json());

// --- Database Setup ---
let db: any;

function initDatabase() {
  db = new sqlite3.Database('database.sqlite', (err: any) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Database opened successfully');
    }
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      team TEXT,
      scope TEXT,
      isAdmin INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      leadId TEXT,
      name TEXT,
      color TEXT,
      FOREIGN KEY(leadId) REFERENCES leads(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      resourceId TEXT,
      name TEXT,
      date TEXT,
      status TEXT,
      FOREIGN KEY(resourceId) REFERENCES resources(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      name TEXT
    )`, () => {
      // Seed default users if table is empty
      db.get('SELECT count(*) as count FROM users', (err, row: any) => {
        if (err) {
          console.error('Error counting users:', err);
          return;
        }
        if (row && row.count === 0) {
          db.run('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)', 
            ['u-1', 'superadmin', 'superadmin', 'super_admin', 'Super Admin']);
          db.run('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)', 
            ['u-2', 'admin', 'admin', 'admin', 'Admin User']);
        }
      });
    });
  });
}

// --- WebSocket Broadcast ---
function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// --- API Routes ---

app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM leads', (err, leads: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT * FROM resources', (err, resources: any[]) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.all('SELECT * FROM tasks', (err, tasks: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.all('SELECT * FROM users', (err, users: any[]) => {
          if (err) return res.status(500).json({ error: err.message });

          const data = leads.map(lead => ({
            ...lead,
            isAdmin: !!lead.isAdmin,
            resources: resources
              .filter(r => r.leadId === lead.id)
              .map(resource => ({
                ...resource,
                tasks: tasks.filter(t => t.resourceId === resource.id)
              }))
          }));
          
          res.json({ data, users });
        });
      });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user });
  });
});

app.post('/api/sync', (req, res) => {
  const { type, payload } = req.body;
  
  // Simple sync handler that just broadcasts the action to others
  // In a real app, we would update the DB here too
  // For this demo, let's just broadcast and let the client handle the state update
  // But wait, the user wants "data save use here sql lite", so we MUST save to DB.
  
  if (type === 'ADD_LEAD') {
    const { id, name, role, team, scope, isAdmin } = payload;
    db.run('INSERT INTO leads (id, name, role, team, scope, isAdmin) VALUES (?, ?, ?, ?, ?, ?)', 
      [id, name, role, team, scope, isAdmin ? 1 : 0]);
  } else if (type === 'DELETE_LEAD') {
    db.run('DELETE FROM leads WHERE id = ?', [payload.id]);
    db.run('DELETE FROM resources WHERE leadId = ?', [payload.id]);
  } else if (type === 'ADD_RESOURCE') {
    const { id, leadId, name, color } = payload;
    db.run('INSERT INTO resources (id, leadId, name, color) VALUES (?, ?, ?, ?)', [id, leadId, name, color]);
  } else if (type === 'DELETE_RESOURCE') {
    db.run('DELETE FROM resources WHERE id = ?', [payload.id]);
    db.run('DELETE FROM tasks WHERE resourceId = ?', [payload.id]);
  } else if (type === 'UPDATE_RESOURCE') {
    db.run('UPDATE resources SET name = ? WHERE id = ?', [payload.name, payload.id]);
  } else if (type === 'ADD_TASK') {
    const { id, resourceId, name, date, status } = payload;
    db.run('INSERT INTO tasks (id, resourceId, name, date, status) VALUES (?, ?, ?, ?, ?)', [id, resourceId, name, date, status]);
  } else if (type === 'DELETE_TASK') {
    db.run('DELETE FROM tasks WHERE id = ?', [payload.id]);
  } else if (type === 'UPDATE_TASK_STATUS') {
    db.run('UPDATE tasks SET status = ? WHERE id = ?', [payload.status, payload.id]);
  } else if (type === 'MOVE_RESOURCE') {
    db.run('UPDATE resources SET leadId = ? WHERE id = ?', [payload.targetLeadId, payload.id]);
  } else if (type === 'UPDATE_LEAD') {
    const { id, isAdmin } = payload;
    db.run('UPDATE leads SET isAdmin = ? WHERE id = ?', [isAdmin ? 1 : 0, id]);
  } else if (type === 'ADD_USER') {
    const { id, username, password, role, name } = payload;
    db.run('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)', [id, username, password, role, name]);
  } else if (type === 'UPDATE_USER') {
    const { id, username, password, role, name } = payload;
    db.run('UPDATE users SET username = ?, password = ?, role = ?, name = ? WHERE id = ?', [username, password, role, name, id]);
  } else if (type === 'DELETE_USER') {
    db.run('DELETE FROM users WHERE id = ?', [payload.id]);
  } else if (type === 'INITIALIZE') {
    // Bulk insert initial data if DB is empty
    db.get('SELECT count(*) as count FROM leads', (err, row: any) => {
      if (err) {
        console.error('Error counting leads for initialization:', err);
        return;
      }
      if (row && row.count === 0) {
        db.serialize(() => {
          payload.forEach((lead: any) => {
            db.run('INSERT INTO leads (id, name, role, team, scope, isAdmin) VALUES (?, ?, ?, ?, ?, ?)', 
              [lead.id, lead.name, lead.role, lead.team, lead.scope, lead.isAdmin ? 1 : 0]);
            lead.resources.forEach((res: any) => {
              db.run('INSERT INTO resources (id, leadId, name, color) VALUES (?, ?, ?, ?)', [res.id, lead.id, res.name, res.color]);
              res.tasks.forEach((task: any) => {
                db.run('INSERT INTO tasks (id, resourceId, name, date, status) VALUES (?, ?, ?, ?, ?)', [task.id, res.id, task.name, task.date, task.status]);
              });
            });
          });
        });
      }
    });
  }

  broadcast({ type, payload });
  res.json({ success: true });
});

// --- Vite Middleware ---
async function startServer() {
  try {
    initDatabase();
    
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
