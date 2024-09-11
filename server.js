const express = require('express');
const mysql = require('mysql');
let connected = false;
const app = express();
const PORT = 3000;

const dbConfig = {
    host: 'db',
    user: 'admin',
    password: 'admin',
    database: 'userDB'
};

function connectDatabase() {
    const db = mysql.createConnection(dbConfig);
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
