const express = require('express');
const router = express.Router();
const { User, Auction, Dead } = require('./schema/schema'); 

// ✅ LOGIN Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const FoundUser = await User.findOne({ email, password });

        if (FoundUser) {
            console.log('New user has been logged in...');
            console.log('UID: ' + FoundUser._id);

            req.session.user_id = FoundUser._id;  // ✅ Store user_id in session

            res.status(200).json({ message: 'Login successful!.. Redirecting to dashboard...' });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Server Error..' });
    }
});

// ✅ REGISTER Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists, Please Login...' });
        }

        const newUser = await User.create({ name, email, password });

        req.session.user_id = newUser._id;  // ✅ Store user_id in session

        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Something went wrong, please try again later...' });
    }
});

// LOGOUT Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
});

// Session Retrieval Route
router.get('/session', (req, res) => {
    if (req.session.user_id) {  // 
        res.json({ user_id: req.session.user_id });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

router.get('/profile', async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ message: 'No such user. Please login.' });
    }

    try {
        const userId = req.session.user_id;
        const userData = await User.findById(userId);

        const soldData = await Auction.find({ seller_id: userId });
        const activeAuctions = await Auction.find({ seller_id: userId, end_time: { $gt: new Date() } });

        // Find all auctions where bidding has ended
        const endedAuctions = await Auction.find({
            end_time: { $lte: new Date() },
            bids: { $exists: true, $ne: [] }
        }).lean();

        // Get only the ones where the current user has the highest bid
        const wonAuctions = endedAuctions.filter(auction => {
            const highestBid = auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, { amount: 0 });
            return highestBid.user_id?.toString() === userId;
        });

      
        const computeMaxBid = (auction) => {
            return auction.bids.reduce((max, bid) => bid.amount > max ? bid.amount : max, 0);
        };

        soldData.forEach(auction => auction.maxamount = computeMaxBid(auction));
        activeAuctions.forEach(auction => auction.maxamount = computeMaxBid(auction));
        wonAuctions.forEach(auction => auction.maxamount = computeMaxBid(auction));

        res.render('profile', {
            user: userData,
            soldProduct: soldData,
            auction: activeAuctions,
            wonAuctions: wonAuctions 
        });

    } catch (err) {
        console.error('Error fetching profile data:', err);
        res.status(500).send('Server error');
    }
});


// Route to handle payment submission
router.post('/payment/:id', async (req, res) => {
    try {
      const { deadId, amt, payment_method } = req.body;
      const userId = req.session.user_id || null;
  
      const newPayment = new Payment({
        user_id: userId,
        dead_id: deadId, // This refers to the auction the user won
        payment_status: 'Pending',
        amount: amt,
        payment_method // Optional: include it if you're planning to use it
      });
  
      await newPayment.save();
  
      res.status(201).send("Payment processed successfully!");
    } catch (err) {
      console.error("Payment error:", err);
      res.status(400).send("Payment failed.");
    }
  });
  


// Route to show payment page
router.get('/paymentPage', async (req, res) => {
      
      
    try {
      const { deadId } = req.query;
  
      if (!deadId) {
        return res.status(400).send("Missing deadId parameter.");
      }
  
      const deadData = await Auction.findById(deadId);
      if (!deadData) {
        return res.status(404).send("Auction not found.");
      }
  
      const maxBid = deadData.bids.reduce((max, bid) => bid.amount > max ? bid.amount : max, 0);
  
      res.render('payment', { amount: maxBid, deadId: deadData._id });
  
    } catch (err) {
      console.error("Payment page error:", err);
      res.status(500).json({ message: "Failed to Fetch Auction.." });
    }
  });

  

  

module.exports = router;
