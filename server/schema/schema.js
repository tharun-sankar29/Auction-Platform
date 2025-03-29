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

// const AuctionItemsSchema = new mongoose.Schema({
//     name : String,
//     auction_id : String,
//     rating : String,
//     img : String,
//     TimeRemaining : String,
//     AddedOnDate : String
// });

const User = mongoose.model('User', UserSchema);
const Products = mongoose.model('Product', ProductSchema);
// module.exports = mongoose.model('AuctionItems', AuctionItemsSchema);


module.exports = {User, Products};
