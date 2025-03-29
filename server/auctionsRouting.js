const express = require('express');
const router = express.Router();
const {Auctions} = require('./schema/schema');

router.get('/all', async (req, res) => {
    try {
        const auctions = await Auctions.find();
        res.status(200).json(auctions);

    } catch (err) {
        console.error('Error fetching auctions: ' + err);
        res.status(500).json({message : 'Server Error Failed to fetch auctions...'});
    }
});


module.exports = router;