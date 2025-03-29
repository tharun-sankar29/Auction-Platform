const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const ProductSchema = new mongoose.Schema({
  _id: String,
  img: String,        
  Name: String,
  price: Number,
  Description: String,
  Start: Date,
  End: Date
});

const auctionSchema = new mongoose.Schema({
    title: String,                    // Product title
    description: String,              // Product description
    img: String,                      // Image path
    start_time: Date,                 // Auction start time
    end_time: Date,                   // Auction end time
    price: Number,                    // Starting price
    seller_id: mongoose.Schema.Types.ObjectId,  // Seller ID (from users collection)
    bids: [
        {
            user_id: mongoose.Schema.Types.ObjectId,   // Bidder ID
            amount: Number,                            // Bid amount
            bid_time: { type: Date, default: Date.now }
        }
    ]
});




const User = mongoose.model('User', UserSchema);
const Products = mongoose.model('Product', ProductSchema);
const Auctions = mongoose.model('Auction', auctionSchema);
;



module.exports = {User, Products, Auctions};
