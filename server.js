const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3000;

// Declare db globally
let db;

// Database configuration
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
            console.log('Connected to database.');
            startServer();  // Start server after connection is established
        }
    });

    db.on('error', err => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectDatabase(); // Reconnect on connection loss
        } else {
            throw err;
        }
    });
}

function startServer() {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

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

// Connect to the database and start the server
connectDatabase();