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

//fetch data from database
app.get('/products', async (req, res) => {
    try {
      const products = await productModel.find({});
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  //display 
  document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
  
    function fetchProducts() {
      fetch('/products')
        .then(response => response.json())
        .then(products => renderProducts(products))
        .catch(error => console.error('Error fetching products:', error));
    }
  
    function renderProducts(products) {
      const container = document.getElementById('product-container');
      container.innerHTML = ''; 
      products.forEach(product => {
        const productHTML = `
          <h2>${auction.title}</h2>
        <img src="images/auction-items/${auction.id}.jpg">
        <p id="currentBid">Current Bid: ${auction.price}</p>
        <p>Time Left:<p id="timeLeft"> ${auction.timeLeft}</p></p>
        <button class = "add-review" onclick="window.location.href='review.html?auction_id=${auction.id}'">Add Review</button>
        <button id="placeBidButton" class = "placebid">Place Bid</button>
        <div id="bidModal" style="display:none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Place Bid</h2>
                <input id="bidAmount" type="number" placeholder="Enter bid amount">
                <button id="submitBid">Submit Bid</button>
            </div>
        </div>
        `;
        container.innerHTML += productHTML;
      });
    }
  });
  
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
