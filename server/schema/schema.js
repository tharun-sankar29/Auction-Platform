const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});


const auctionSchema = new mongoose.Schema({
    title: String,                    // Product title
    description: String, 
    category: String,             // Product description
    img: String,                      // Image path
    start_time: Date,                 // Auction start time
    end_time: Date,                   // Auction end time
    price: Number,                    // Starting price
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Seller ID (from users collection)
    bids: [
        {
            user_id: mongoose.Schema.Types.ObjectId,   // Bidder ID
            amount: Number,                            // Bid amount
            bid_time: { type: Date, default: Date.now }
        }
    ],
    feedbacks: [
        {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: {type: Number, min: 1, max: 5},
        Stars: String,
        description: String,
        createdAt: {type: Date, default: Date.now }
        }
    ]
});

const deadSchema = new mongoose.Schema({
    title: String,
    description: String,
    img: String,
    price: Number,
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

const PaymentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dead', required: true },
    payment_status: { type: String, enum: ['Pending', 'Completed', 'Failed'], required: true },
    amount: { type: Number, required: true } 
});


const User = mongoose.model('User', UserSchema);
const Auction = mongoose.model('Auction', auctionSchema);
const Dead = mongoose.model('Dead', deadSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
;



module.exports = {User, Auction, Dead, Payment};
