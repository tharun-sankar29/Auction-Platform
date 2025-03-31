const express = require('express');
const router = express.Router();
const {Auction} = require('./schema/schema');
const mongoose = require('mongoose');

const Auctions = Auction;


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



module.exports = router;