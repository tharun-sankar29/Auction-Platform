const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});
//removed user define Id , Name to name
const ProductSchema = new mongoose.Schema({
  img: String,        
  name: String,
  price: Number,
  Description: String,
  Start: Date,
  End: Date,
  status: String
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
    ],
    maxamount: Number
});

const deadSchema = new mongoose.Schema({
    title: String,
    description: String,
    img: String,
    price: String,
    end_time: Date,
    bids: [
        {
            user_id: mongoose.Schema.Types.ObjectId,
            amount: Number,
            bid_time: {type: Date, default: Date.now }
        }
    ],
    maxamount : Number
});


const User = mongoose.model('User', UserSchema);
const Products = mongoose.model('Product', ProductSchema);
const Auctions = mongoose.model('Auction', auctionSchema);
const Dead = mongoose.model('Dead', deadSchema);
;



module.exports = {User, Products, Auctions, Dead};
