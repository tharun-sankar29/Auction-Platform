
const mongoose = require('mongoose');
const express = require('express');
const { Auctions, Dead } = require('./server/schema');

const app = express();
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb://127.0.0.1:27017/sample';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error in connection", err));

app.post('/proDet', async (req, res) => {
  const {
    'auction-id': auction_id,  
    'seller-id': seller_id,
    title,            
    description,
    price,
    img,
    'end-time': end       
  } = req.body;
  
  try {
    const newAuction = new Auctions({
      seller_id,
      title,                     
      description,               
      img,                       
      price,                     
      end_time: new Date(end),   
      status: "Alive"            
    });
    await newAuction.save();
    res.status(201).send("Successful");
  } catch (err) {
    console.error("Error ", err);
    res.status(400).send("Unsuccessful");
  }
});

setInterval(async function() {
  const currentTime = Date.now();
  try {
    await Auctions.updateMany(
      { end_time: { $lte: currentTime }, status: "Alive" },
      { $set: { status: "Dead" } }
    );

    const deadAuctions = await Auctions.find({ status: "Dead" });
    if (deadAuctions.length > 0) {
      for (const auction of deadAuctions) {
        const deadPro = new Dead({
          title: auction.title,
          description: auction.description,
          img: auction.img,
          price: auction.price,           
          end_time: auction.end_time,
          bids: auction.bids,
          maxamount: auction.maxamount
        });
        await deadPro.save();
      }
    }
    await Auctions.deleteMany({ status: "Dead" });
  } catch (error) {
    console.error("Cleanup error: ", error);
  }
}, 1000);

app.listen(3000, () => console.log("Listening on port 3000"));
