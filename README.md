# 💰 Expense Tracker

A full-stack web app to track personal expenses by category and by month. Built to practice modern web development — React on the frontend, Node.js + Express + MySQL on the backend.

---

## What it does

- Add an expense with a description, category, and amount
- View all expenses, automatically grouped by month
- See your total spend for whichever month you're viewing
- Delete any expense
- All data is saved in a real MySQL database — nothing disappears on refresh

---

## Tech Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Frontend   | React (Vite)                    |
| Backend    | Node.js, Express                |
| Database   | MySQL                           |
| Other      | REST API, Fetch API, CORS, dotenv |

---

## How it works

```
React (localhost:5173)  →  Express API (localhost:5000)  →  MySQL Database
```

The React app sends requests to the Express server whenever you add, view, or delete an expense. Express runs the matching SQL query against MySQL and sends the result back, and React updates the screen.

---

## Project Structure

This project has two parts, in two folders/repos:

- **`/frontend`** — the React app (what you see in the browser)
- **`/backend`** — the Express API + MySQL connection (handles storing/retrieving data)

---

## Running it locally

### 1. Backend setup

```
cd backend
npm install
```

Create a `.env` file inside `backend` with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
PORT=5000
```

Create the database in MySQL:
```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Start the backend:
```
npm run dev
```
This runs at `http://localhost:5000`.

### 2. Frontend setup

```
cd frontend
npm install
npm run dev
```
This runs at `http://localhost:5173`. Open that link in your browser.

> Both the backend and frontend need to be running at the same time.

---

## API Reference

| Method | Endpoint         | What it does            |
|--------|------------------|--------------------------|
| GET    | `/expenses`      | Get all expenses         |
| POST   | `/expenses`      | Add a new expense        |
| DELETE | `/expenses/:id`  | Delete an expense by ID  |

---

## What I learned

This was my first full-stack web project. I came from a data science/Python background, so building this taught me:
- How a frontend and backend actually talk to each other over HTTP
- React fundamentals — state, effects, controlled forms, rendering lists
- Building a REST API from scratch with Express
- Connecting a Node.js backend to a MySQL database

---
