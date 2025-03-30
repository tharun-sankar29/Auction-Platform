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

// ✅ LOGOUT Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
});

// ✅ Corrected Session Retrieval Route
router.get('/session', (req, res) => {
    if (req.session.user_id) {  // ✅ Correctly check for user_id in session
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
        const userData = await User.findById(req.session.user_id);
        const soldData = await Auction.find({ seller_id: req.session.user_id });
        const activeAuctions = await Auction.find({ seller_id: req.session.user_id, status: { $ne: "Dead" } });
        const deadData = await Dead.find({ seller_id: req.session.user_id });

        // Function to compute the max bid amount
        const computeMaxBid = (auction) => {
            return auction.bids.reduce((max, bid) => bid.amount > max ? bid.amount : max, 0);
        };

        // Add max bid amount to each auction object
        soldData.forEach(auction => auction.maxamount = computeMaxBid(auction));
        activeAuctions.forEach(auction => auction.maxamount = computeMaxBid(auction));
        deadData.forEach(dead => dead.maxamount = computeMaxBid(dead));

        // Render the profile view
        res.render('profile', { 
            user: userData, 
            soldProduct: soldData, 
            auction: activeAuctions, 
            Deadauction: deadData,
        });

    } catch (err) {
        console.error('Error fetching profile data:', err);
        res.status(500).send('Server error');
    }
});

router.post('/payment', async (req, res) => {
  try {
    const { deadId, amt, payment_method } = req.body;
    const userId = req.session.userId || null;

    const newPayment = new Payment({
      user_id: userId,
      dead_id: deadId, 
      payment_status: 'Pending', 
      amount: amt 
    });
    await newPayment.save();

    res.status(201).send("Payment processed successfully!");
  } catch (err) {
    console.error("Payment error:", err);
    res.status(400).send("Payment failed.");
  }
});

router.get('/paymentPage', async (req, res) => {
  try {
    const deadData = await Dead.findById(req.params.deadId);
    if (!deadData) {
      return res.status(404).send("Dead auction not found.");
    }
  
    res.render('/payment', { amount: deadData.maxamount, deadId: deadData._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
