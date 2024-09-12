const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public2'));

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/resultsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema definition
const ResultSchema = new mongoose.Schema({
    username: String,
    score: Number
});

// Model
const Result = mongoose.model('Result', ResultSchema);

// Routes for API
app.get('/api/results', async (req, res) => {
    const results = await Result.find();
    res.json(results);
});

app.post('/api/results', async (req, res) => {
    const newResult = new Result(req.body);
    const savedResult = await newResult.save();
    res.json(savedResult);
});

// Route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public2', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});