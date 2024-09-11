const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to database
db.connect((err) => {
    if (err) { throw err; }
    console.log('Connected to database');
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle user signup
app.post('/signup', (req, res) => {
    const { username, password, age, location, sex } = req.body;
    const sql = `INSERT INTO users (username, password, age, location, sex) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [username, password, age, location, sex], (err, result) => {
        if (err) throw err;
        res.send('User registered successfully');
    });
});

// Endpoint to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(sql, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.send('Login successful');
        } else {
            res.send('Login failed');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


console.log(`Database Host: ${process.env.DB_HOST}`);
