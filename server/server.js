const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

const { User, Auction, Product, Dead } = require('../../server/schema/schema');

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

//authentication for session
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && user.password === password) {
        req.session.userId = user._id;
        res.redirect('/profile');
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });


app.get('../profile.ejs.html', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json('No such user');
    }
    try {
      const userData = await User.findById(req.session.userId);
      const soldData = await Auction.find({ seller_id: req.session.userId });
      const activeAuctions = await Auction.find({ seller_id: req.session.userId, status: { $ne: "Dead" } });
      const deadData = await Dead.find({ seller_id: req.session.userId });

      const computeMaxBid = (auction) => {
        let maxBid = 0;w
        auction.bids.forEach(bid => {
          if (bid.amount > maxBid) {
            maxBid = bid.amount;
          }
        });
        return maxBid;
      };
  
      soldData.forEach(auction => auction.maxamount = computeMaxBid(auction));
      activeAuctions.forEach(auction => auction.maxamount = computeMaxBid(auction));
      deadData.forEach(dead => dead.maxamount = computeMaxBid(dead));
      
      res.render('../profile.ejs.html', { 
        user: userData, 
        soldProduct: soldData, 
        auction: activeAuctions, 
        Deadauction: deadData 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

//import all routings...
const authRoutes = require('./authRouting');
const auctionRoutes = require('./auctionsRouting');


const app = express();
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
