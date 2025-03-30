const mongoose = require('mongoose');
const express = require('express');
const { Products, Deads } = require('./server/schema'); 

const app = express();
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb://127.0.0.1:27017/sample';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongoDB"))
  .catch(err => console.log("Error in connection", err));

const productSchema = new mongoose.Schema({
    product_id: { type: String, unique: true },
    seller_id: { type: String, unique: true },
    catogary_id: String,
    title: String,
    description: String,
    starting_price: String,
    image_url: String,
    status_of_product: String,
    endTime: Date
});
const productModel = mongoose.model('Products', productSchema);

app.post('/proDet', async (req, res) => {
    const {
        'product-id': product_id, 
        'seller-id': seller_id,
        catogary,
        name,
        description,
        price,
        img,
        'end-time': end
    } = req.body;
    
    try {
        const newProduct = new productModel({
            product_id,
            seller_id,
            catogary_id: catogary,
            title: name,
            description: description,
            starting_price: price,
            image_url: img,
            status_of_product: "Alive",
            endTime: new Date(end)
        });
        await newProduct.save();
        res.status(201).send("Successful");
    } catch (err) {
        console.error("Error ", err);
        res.status(400).send("Unsuccessful");
    }
});

setInterval(async function() {
    const currentTime = Date.now();
    try {
        await productModel.updateMany(
            { endTime: { $lte: currentTime }, status_of_product: "Alive" },
            { $set: { status_of_product: "Dead" } }
        );

        const deadProducts = await productModel.find({ status_of_product: "Dead" });
        if (deadProducts.length > 0) {
            for (const prod of deadProducts) {
                const deadPro = new Deads({
                    title: prod.title,
                    description: prod.description,
                    img: prod.image_url,
                    price: prod.starting_price, 
                    end_time: prod.endTime,
                    bids: []
                });
                await deadPro.save();
            }
        }
        await productModel.deleteMany({ status_of_product: "Dead" });
    } catch (error) {
        console.error("Cleanup error: ", error);
    }
}, 1000);

app.listen(3000, () => console.log("Listening on port 3000"));
