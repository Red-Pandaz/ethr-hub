const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); 

const routes = require('./routes');
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});