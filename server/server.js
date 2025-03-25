const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./User');
const { time } = require('console');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from multiple folders
app.use('/css', express.static(path.join(__dirname, '../css')));  // CSS folder
app.use('/js', express.static(path.join(__dirname, '../js')));    // JS folder
app.use('/', express.static(path.join(__dirname, '../')));        // HTML files in the root

const MONGODB_URL = 'mongodb://localhost:27017/auctionDB';   //Fil it later.....
const PORT = 3000;


mongoose.connect(MONGODB_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error(('❌ MongoDB connection failed:', err)))



// Routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../home.html'));  // Serve home.html
});


app.post('/resgiter', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            res.send('User already exists, Please Login...')
        } else {
            const newUser = await User.insertOne({name, email, password});
            await newUser.save();
        }
    }

    catch (error) {
        console.error(error);
        res.status(401).send('Something went wrong, please try again later...');
    }
});


app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const FoundUser = await User.findOne({email, password});

        if (FoundUser) {
            res.send('Login successful!.. Redirecting to dashboard.....');
        } else {
            res.status(401).send('Invalid username or password')
        }
    } catch (error) {
        res.status(500).send('Server Error..');
    }
});



app.listen(PORT, () => {
    console.log('Listening on port ${PORT}...');
});
