const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mysql = require('mysql');
let connected = false;

// Declare db globally
let db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to serve the Enter Data page
app.get('/enter-data', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'enter_data.html'));
});

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const dbConfig = {
    host: 'db',
    user: 'admin',
    password: 'admin',
    database: 'userDB'
};

function connectDatabase() {
    db = mysql.createConnection(dbConfig);
    db.connect(err => {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            setTimeout(connectDatabase, 5000); // Retry after 5 seconds
        } else {
            connected = true;
            console.log('Connected to database.');
        }
    });

    db.on('error', err => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectDatabase();
        } else {
            throw err;
        }
    });
}
connectDatabase();

console.log(`Database Host: ${process.env.DB_HOST}`);