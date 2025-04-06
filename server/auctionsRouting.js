const express = require('express');
const router = express.Router();
const {Auction} = require('./schema/schema');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Auctions = Auction;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images/auction-items'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

const validateSession = async (req, res) => { 
    const user_id = req.session.user_id;

    if(user_id) {
        return true;
    } else {
        alert('Session Expired Please login..');
        window.href.location = 'loginAndRegister.html';
    }
    return false;
}




router.get('/all', async (req, res) => {
    try {
        const auctions = await Auctions.find();
        res.status(200).json(auctions);

    } catch (err) {
        console.error('Error fetching auctions: ' + err);
        res.status(500).json({message : 'Server Error Failed to fetch auctions...'});
    }
});

router.get('/featured', async (req, res) => {
    try {
        const featuredAuctions = await Auctions.find({"bids.5" : {"$exists" : true}});
        res.status(200).json(featuredAuctions);

    } catch (err) {
        console.error('Error fetching featured auctions:' + err);
        res.status(500).json({message : 'Server Error Failed to fetch auctions...'})
    }

})

router.get('/:id', async (req, res) => {
    console.log('Receive id: ' + req.params.id);
    try {
        const auction = await Auctions.findById(req.params.id);
        if(!auction) {
            return res.status(404).json({message : 'Auction Not Found..'})
        }

        res.status(200).json(auction);
    } catch(error) {
        console.error("Error fetching auction: " + error);
        res.status(500).json({message : 'Failed to Fetch Auction..'})
    }
})

router.post('/:id/bid', async (req, res) => {

    try {

        const user_id = req.session.user_id;
        const amount = req.body.amount;


        const auction = await Auctions.findById(req.params.id);

        if(!auction) {
            return res.status(404).json({message : 'Auction not Found'});
        }

        const highestBid = auction.bids.length > 0 
        ? Math.max(...auction.bids.map(bid => bid.amount)) 
        : auction.price;

        if (amount <= highestBid) {
            return res.status(400).json({message : 'Bid must be higher the current highest bid..'});
        }

        auction.bids.push({
            user_id : new mongoose.Types.ObjectId(user_id),
            amount,
            bid_time : new Date()
        });

        await auction.save();
        res.status(200).json({ message: 'Bid placed successfully', auction });
    } catch (err) {
        console.error('Error placing bid:', err);
        res.status(500).json({ error: 'Failed to place bid' });
    }
});

router.post(':id/review', async (req, res) => {
    const user_id = req.session.user_id;
    const auction_id = req.params.id;

    const {rating, Stars, description, createdAt} = req.body;

    try {
        if (!req.session.user_id) {
            alert('Session expired please login...');
            window.location.href = 'loginAndRegister.html';
        }
    } catch (err) {
        console.error("Error validating session: " + err);
    }

    try {
        const auction = await Auctions.findById(auction_id);
        auction.feedbacks.push({
            user_id: new mongoose.Types.ObjectId(user_id),
            rating,
            Stars,
            description,
            createdAt
        });

        await auction.save();

    } catch (err) {
        console.log('Error posting a review: ' + err);
        res.status(500).json({error : 'Failed to submit review'});
    }
})


router.post('/add', upload.single('image-upload'), async (req, res) => {
    const isSessionValid = validateSession(req, res);

    if (!isSessionValid) return;

    try {
        const {
            name,
            category,
            price,
            description,
            startTime,
            endTime,
            'image-url': imageUrl
        } = req.body;

        const imageFile = req.file ? `/uploads/${req.file.filename}` : null;

        const newAuction = new Auctions({
            name,
            category,
            price,
            description,
            startTime,
            endTime,
            image: imageUrl || imageFile // Use URL if provided, else file path
        });

        await newAuction.save();

        res.status(201).json({ message: 'Auction added successfully' });

    } catch (err) {
        console.error("Error adding new auction:", err);
        res.status(500).json({ message: 'Failed to add new auction' });
    }
});

module.exports = router;