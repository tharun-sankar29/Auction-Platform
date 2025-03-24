const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from multiple folders
app.use('/css', express.static(path.join(__dirname, '../css')));  // CSS folder
app.use('/js', express.static(path.join(__dirname, '../js')));    // JS folder
app.use('/', express.static(path.join(__dirname, '../')));        // HTML files in the root

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../home.html'));  // Serve home.html
});

app.post('/login', (req, res)) {
    const {username, password} = req.body;
    
}

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
