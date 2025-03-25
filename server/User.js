const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

// const AuctionItemsSchema = new mongoose.Schema({
//     name : String,
//     auction_id : String,
//     rating : String,
//     img : String,
//     TimeRemaining : String,
//     AddedOnDate : String
// });

module.exports = mongoose.model('User', UserSchema);
// module.exports = mongoose.model('AuctionItems', AuctionItemsSchema);


