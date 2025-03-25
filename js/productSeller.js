const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURI = 'mongodb://localhost:27017/auctionDB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

const productSchema = new mongoose.Schema({
  _id: String,
  img: String,        
  Name: String,
  price: Number,
  Description: String,
  Start: Date,
  End: Date
});

const productModel = mongoose.model('Products', productSchema);

app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
  res.sendFile(path.join('C:/Users/forgo/OneDrive/Desktop/Auction/Expense_splitter/Auction-Platform/Auction-Platform/seller.html'));
});

app.post('/proDet', async (req, res) => {
  const { 'product-id': id, img, name, price, description, 'start-time': start, 'end-time': end } = req.body;
  try {
    const newProduct = new productModel({
      _id: id,
      img: img || '',
      Name: name,
      price: parseFloat(price),
      Description: description,
      Start: new Date(start),
      End: new Date(end)
    });
    const result = await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: result });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
