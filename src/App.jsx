import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';
const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  useEffect(() => {
    fetchExpenses();
  }, []);

  function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  function fetchExpenses() {
    fetch(`${API_URL}/expenses`)
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error('Error fetching expenses:', err));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Number(amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: `[${category}] ${description}`,
        amount: Number(amount),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setDescription('');
        setAmount('');
        fetchExpenses();
      })
      .catch((err) => console.error('Error adding expense:', err));
  }

  function handleDelete(id) {
    fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' })
      .then(() => fetchExpenses())
      .catch((err) => console.error('Error deleting expense:', err));
  }

  // Group expenses by "YYYY-MM" using their created_at timestamp
  function getMonthKey(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  const availableMonths = [...new Set(expenses.map((exp) => getMonthKey(exp.created_at)))].sort().reverse();

  const filteredExpenses = expenses.filter((exp) => getMonthKey(exp.created_at) === selectedMonth);

  const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  function formatMonthLabel(key) {
    const [year, month] = key.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Expenses</h1>

      <div style={styles.monthSelectorWrap}>
        <label style={styles.monthLabel}>Viewing:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={styles.select}
        >
          {availableMonths.length === 0 && (
            <option value={selectedMonth}>{formatMonthLabel(selectedMonth)}</option>
          )}
          {availableMonths.map((m) => (
            <option key={m} value={m}>{formatMonthLabel(m)}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="e.g. Groceries, Electricity bill, Uber ride"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          style={styles.inputSmall}
          required
        />
        <button type="submit" style={styles.button}>Add</button>
      </form>

      <h2 style={styles.total}>Total for {formatMonthLabel(selectedMonth)}: ₹{total.toFixed(2)}</h2>

      {filteredExpenses.length === 0 ? (
        <p style={styles.empty}>No expenses for this month yet.</p>
      ) : (
        <ul style={styles.list}>
          {filteredExpenses.map((exp) => (
            <li key={exp.id} style={styles.listItem}>
              <span>{exp.description}</span>
              <div style={styles.rightSide}>
                <span style={styles.amount}>₹{Number(exp.amount).toFixed(2)}</span>
                <button onClick={() => handleDelete(exp.id)} style={styles.deleteBtn}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '560px', margin: '40px auto', fontFamily: 'Segoe UI, Arial, sans-serif', padding: '0 20px' },
  heading: { textAlign: 'center', color: '#222' },
  monthSelectorWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' },
  monthLabel: { fontWeight: 'bold', color: '#444' },
  form: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  input: { flex: 2, padding: '10px', border: '1px solid #ccc', borderRadius: '6px', minWidth: '120px' },
  inputSmall: { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '6px', minWidth: '90px' },
  select: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px' },
  button: { padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  total: { textAlign: 'center', color: '#111', marginBottom: '20px' },
  empty: { textAlign: 'center', color: '#888' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' },
  rightSide: { display: 'flex', alignItems: 'center', gap: '12px' },
  amount: { fontWeight: 'bold', color: '#333' },
  deleteBtn: { background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' },
};

export default App;