const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');


//import all routings...
const authRoutes = require('./authRouting');
const auctionRoutes = require('./auctionsRouting');


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set routing address..
app.use('/auth', authRoutes);
app.use('/auctions', auctionRoutes);

// Serve static files from multiple folders
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', express.static(path.join(__dirname, '../public/html')));


const MONGODB_URL = 'mongodb://localhost:27017/auctionDB';   //Fil it later.....
const PORT = 5000;


mongoose.connect(MONGODB_URL)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error(('❌ MongoDB connection failed:', err)));



// Routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/html/home.html'));  // Serve home.html
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
