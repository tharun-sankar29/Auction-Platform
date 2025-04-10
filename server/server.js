const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');

const app = express();
app.use(methodOverride('_method'));

// const { User, Auction, Dead, Payment} = require('./schema/schema');

//session initialization
// ejs view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/html'));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'auction_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, '../public')));
//update


const authRoutes = require('./authRouting');
const auctionRoutes = require('./auctionsRouting');
const paymentRoutes = require('./paymentRouting');


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'auction_secret',
    resave: false,
    saveUninitialized: false,
}));

const authMiddleware = (req, res, next) => {
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ message: 'Session expired, please login' });
    }
};

module.exports = authMiddleware;

//set routing address..
app.use('/auth', authRoutes);
app.use('/auctions', auctionRoutes, authMiddleware);
app.use('/payments', paymentRoutes);

// Serve static files from multiple folders

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', express.static(path.join(__dirname, '../public/html')));



// Catch-all route to serve HTML files with query parameters
app.get('/:file', (req, res) => {
    const filePath = path.join(__dirname, '../public/html', req.params.file);

    // Check if the file exists and serve it
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});


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
