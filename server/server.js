// server.js
const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const cors = require('cors');

const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

// Serve React App
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));