const express = require('express');
const router = express.Router();
const {Auction} = require('./schema/schema');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Auctions = Auction;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'images', 'auction-items'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });



//Session Validation

const validateSession = async (req, res) => { 
    const user_id = req.session.user_id;

    if(user_id) {
        return true;
    } else {
        console.log('invalid session:');
    }
    return false;
}



//fetch all auctions
router.get('/all', async (req, res) => {
    try {
        const auctions = await Auctions.find();
        res.status(200).json(auctions);

    } catch (err) {
        console.error('Error fetching auctions: ' + err);
        res.status(500).json({message : 'Server Error Failed to fetch auctions...'});
    }
});



// fetch featured auctions (max 5)
router.get('/featured', async (req, res) => {
  try {
      const featuredAuctions = await Auctions
          .find({ 
              "bids.0": { "$exists": true },
              end_time: { $gt: new Date() }  // Only active auctions
          })
          .sort({ end_time: 1 })
          .limit(5);

      res.status(200).json(featuredAuctions);
  } catch (err) {
      console.error('Error fetching featured auctions:' + err);
      res.status(500).json({ message: 'Server Error Failed to fetch auctions...' });
  }
});




//fetch auction by id
router.get('/:id', async (req, res) => {
    console.log('Receive id: ' + req.params.id);
    try {
      const auction = await Auctions.findById(req.params.id)
      .populate('seller_id', 'name') // 👈 fetch seller name from User
      .populate('feedbacks.user_id', 'name'); // 👈 fetch reviewer name  
        if(!auction) {
            return res.status(404).json({message : 'Auction Not Found..'})
        }

        res.status(200).json(auction);
    } catch(error) {
        console.error("Error fetching auction: " + error);
        res.status(500).json({message : 'Failed to Fetch Auction..'})
    }
})


//place bid on (auction_id)
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


router.post('/:id/review', async (req, res) => {
    console.log('reached backend..');
    const user_id = req.session.user_id;
    const auction_id = req.params.id;

    const {Stars, description, createdAt} = req.body;

    validateSession(req, res);

    try {
        console.log('Finding auction by ID:', auction_id);
        const auction = await Auctions.findById(auction_id);
    
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }
    
        console.log('Pushing feedback...');
        auction.feedbacks.push({
            user_id: new mongoose.Types.ObjectId(user_id),
            Stars,
            description,
            createdAt
        });
    
        console.log('Saving auction...');
        await auction.save();
    
        console.log('Auction saved!');
        res.status(200).json({ message: 'Review submitted successfully' });
    
    } catch (err) {
        console.error('Error posting a review:', err);
        res.status(500).json({ error: 'Failed to submit review' });
    }    
});



//add new auction
router.post('/add', upload.single('image-upload'), async (req, res) => {
    const isSessionValid = validateSession(req, res);
    if (!isSessionValid) return;
  
    try {
      const {
        name,
        category,
        price,
        description,
        'start-time': startTime,
        'end-time': endTime
      } = req.body;
  
      const parsedStartTime = new Date(startTime);
      const parsedEndTime = new Date(endTime);
  
      if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
        return res.status(400).json({ message: 'Invalid start or end time' });
      }
  
      const imageFile = req.file ? `/images/auction-items/${req.file.filename}` : null;
  
      const newAuction = new Auctions({
        title: name,
        description,
        category,
        img: imageFile,
        start_time: parsedStartTime,
        end_time: parsedEndTime,
        price: Number(price),
        seller_id: req.session.user_id,
        bids: [],
        feedbacks: []
      });
  
      await newAuction.save();
  
      res.status(201).json({ message: 'Auction added successfully' });
  
    } catch (err) {
      console.error("Error adding new auction:", err);
      res.status(500).json({ message: 'Failed to add new auction' });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.search;
        // Only return auctions that have not yet ended.
        const activeFilter = { end_time: { $gt: new Date() } };
        
        const query = searchTerm && searchTerm !== "all"
            ? { title: { $regex: searchTerm, $options: 'i' }, ...activeFilter }
            : activeFilter;
        
        const auctions = await Auction.find(query);
        res.json(auctions);
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).send('Error fetching auctions');
    }
});

  
  router.get('auctions/edit/:id', async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id);
      if (!auction || auction.seller_id.toString() !== req.session.user_id) {
        return res.status(403).send('Unauthorized');
      }
      res.render('editAuction', { auction });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // POST to update auction
  router.post('auctions/edit/:id', async (req, res) => {
    const { title, description, startingPrice, endTime } = req.body;
    try {
      const auction = await Auction.findById(req.params.id);
      if (!auction || auction.seller_id.toString() !== req.session.user_id) {
        return res.status(403).send('Unauthorized');
      }
  
      auction.title = title;
      auction.description = description;
      auction.price = startingPrice; // Keep name consistent
      auction.end_time = new Date(endTime);
      await auction.save();
  
      res.redirect('/profile');
      if (auction.end_time <= new Date()) {
        return res.status(403).send('Auction has ended and cannot be modified.');
    }
    
    } catch (err) {
      res.status(500).send('Update Failed');
    }
  });
  
  // POST to delete auction
  router.post('auctions/delete/:id', async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id);
      if (!auction || auction.seller_id.toString() !== req.session.user_id) {
        return res.status(403).send('Unauthorized');
      }
  
      await Auction.deleteOne({ _id: req.params.id });
      res.redirect('/profile');
      if (auction.end_time <= new Date()) {
        return res.status(403).send('Auction has ended and cannot be modified.');
    }
    } catch (err) {
      res.status(500).send('Deletion Failed');
    }
  });

module.exports = router;