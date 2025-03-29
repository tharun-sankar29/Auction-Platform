const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true}));
const url = 'mongodb://127.0.0.1:27017/sample';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to mongoDB"))
.catch(err => console.log("Error in connection", err));

const Schema = mongoose.Schema;
const productSchema = new Schema ({
    product_id : {type: String, unique: true},
    seller_id : {type: String, unique: true},
    catogary_id : String,
    title: String,
    description: String,
    starting_price: String,
    image_url: String,
    status_of_product :  String
});

const productModel = mongoose.model('Products', productSchema);

app.post('/proDet', async (req,res) => {
    const {'product-id' : product_id, 'seller-id' : seller_id, catogary, name, description, price, img,
        'end-time': end 
    } = req.body;
    const endTime = end.getTime();
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;
    try {
        const newProduct = new productSchema({product_id: product-id, seller_id : seller-id,
            catogary_id : catogary, title: name, description: description, starting_price : price,
            image_url : img, status_of_product : "Alive"
        });
        const newProductSave = await newProduct.save();
        res.status(201).send("Successful");
    } catch (err) {
        res.status(400).send("Unsuccessful");
        console.log("Error ", err);
    }
    //To automatically delete products if time expires
    setInterval(function() {
        currentTime = Date.now();
        remainingTime = endTime - currentTime;
        if (remainingTime === 0) {
            const updateProduct = Products.find();
            updateProduct.status_of_product = "Dead";
            updateProduct.save();
        }
        if (Prodcuts.find({status_of_product : "Dead"})) {
            const deleteProduct = updateProduct.find({status_of_product: "Dead"});
            deleteProduct.remove();
        }
    }, 1000)
})

