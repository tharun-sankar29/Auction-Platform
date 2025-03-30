const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

const { User, Auction, Product, Dead, Payment} = require('./schema/schema');

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



app.get('../feedback.ejs', async (req,res) => {
    try {
        feedbackData = await Auction.findById(auction_id).populate('feedbacks.user_id'); // req.params.id - getting auction Id from link
        // .populate(id) - replace feedback id with userid
        feedbackData.feedbacks.forEach( fd => {
            let stars='';
            switch (fd.rating) {
                case 1: stars = '★'; break;
                case 2: stars = '★★'; break;
                case 3: stars = '★★★'; break;
                case 4: stars = '★★★★'; break;
                case 5: stars = '★★★★★'; break;
            }
            fd.Stars = stars;
        })
        res.render('../feedback.ejs', {
            feedback: feedbackData
        })
    } catch (err) {
        console.error(err)
    }
});

app.get('../payment.ejs', async (req, res) => {
  try {
    const deadData = await Dead.findById(req.params.deadId);
    if (!deadData) {
      return res.status(404).send("Dead auction not found.");
    }
  
    res.render('../payment.ejs', { amount: deadData.maxamount, deadId: deadData._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Route to handle payment submission
app.post('/payment', async (req, res) => {
  try {
    const { deadId, amt, payment_method } = req.body;
    const userId = req.session.userId || null;

    const newPayment = new Payment({
      user_id: userId,
      dead_id: deadId, 
      payment_status: 'Pending', 
      amount: amount
    });
    await newPayment.save();

    res.status(201).send("Payment processed successfully!");
  } catch (err) {
    console.error("Payment error:", err);
    res.status(400).send("Payment failed.");
  }
});

//import all routings...
const authRoutes = require('./authRouting');
const auctionRoutes = require('./auctionsRouting');


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
