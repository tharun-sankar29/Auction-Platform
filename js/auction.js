const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true}));
const url = 'mongodb://127.0.0.1:27017/sample';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to mongoDB"))
.catch(err => console.log("Error in connection", err));
const SchemaAuc = mongoose.Schema

const auctionSchema = mongoose.SchemaAuc({
    auction_id : String,
    product_id : String,
    start_time: Date,
    end_time: Date,
    bid_increment: Number,
    current_price: Number,
    status: String,
    created_at: Date
});

const auctionModel = mongoose.model('Auctions', SchemaAuc)

