const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || "admin123";
const DB_PATH = process.env.DB_PATH || './notes.db';

const db = new sqlite3.Database(DB_PATH);

app.use(bodyParser.json());
app.use(express.static('public'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, content TEXT, password TEXT)`);
});

// API: Lấy thông tin (Đã bảo mật - Chỉ trả về content nếu không có pass)
app.get('/api/note/:id', (req, res) => {
  db.get("SELECT (password IS NOT NULL) as isLocked FROM notes WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row && row.isLocked) {
      // TUYỆT ĐỐI KHÔNG gửi content ở đây
      return res.json({ isLocked: true });
    }
    
    db.get("SELECT content FROM notes WHERE id = ?", [req.params.id], (err, contentRow) => {
      res.json({ content: contentRow ? contentRow.content : "", isLocked: false });
    });
  });
});

app.post('/api/note/:id', (req, res) => {
  const { content } = req.body;
  db.run(`INSERT INTO notes (id, content) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content`, 
  [req.params.id, content], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.post('/api/note/:id/password', (req, res) => {
  const { password } = req.body;
  const val = password === "" ? null : password;
  db.run("UPDATE notes SET password = ? WHERE id = ?", [val, req.params.id], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

// API: Mở khóa - Trả về content sau khi verify thành công
app.post('/api/note/:id/unlock', (req, res) => {
  const { password } = req.body;
  
  if (password === MASTER_PASSWORD) {
    db.get("SELECT content FROM notes WHERE id = ?", [req.params.id], (err, row) => {
      res.json({ success: true, content: row ? row.content : "", isAdmin: true });
    });
    return;
  }

  db.get("SELECT content FROM notes WHERE id = ? AND password = ?", [req.params.id, password], (err, row) => {
    if (row) res.json({ success: true, content: row.content, isAdmin: false });
    else res.status(401).json({ success: false });
  });
});

app.post('/api/note/:id/unlock-permanently', (req, res) => {
  const { masterPassword } = req.body;
  if (masterPassword !== MASTER_PASSWORD) return res.status(403).json({ success: false });
  db.run("UPDATE notes SET password = NULL WHERE id = ?", [req.params.id], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.post('/api/admin/check', (req, res) => {
  const { password } = req.body;
  if (password === MASTER_PASSWORD) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/admin/notes', (req, res) => {
  const { password } = req.body;
  if (password !== MASTER_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  
  db.all("SELECT id, (password IS NOT NULL) as isLocked FROM notes", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at :${PORT}`));
