const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

// Correct parameter order (req, res)
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './home.html'));
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
