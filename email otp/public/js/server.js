const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for Translator and Chat App
app.get('/translator', (req, res) => {
  res.send('Translator Service Coming Soon!');
});

app.get('/chat', (req, res) => {
  res.send('Chat App Coming Soon!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
