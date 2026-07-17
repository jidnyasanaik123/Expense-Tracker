const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running.');
});

// GET all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }
    res.json(results);
  });
});

// POST a new expense
app.post('/expenses', (req, res) => {
  const { description, amount } = req.body;

  if (!description || !amount) {
    return res.status(400).json({ error: 'Description and amount are required' });
  }

  db.query(
    'INSERT INTO expenses (description, amount) VALUES (?, ?)',
    [description, amount],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add expense' });
      }
      res.status(201).json({ id: result.insertId, description, amount });
    }
  );
});

// DELETE an expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete expense' });
    }
    res.status(204).send();
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});