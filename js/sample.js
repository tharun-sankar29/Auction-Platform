const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true}));
const url = 'mongodb://127.0.0.1:27017/sample';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to mongoDB"))
.catch(err => console.log("Error in connection", err));

const SchemaPro = mongoose.Schema;
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
})
const endTime = new Date(end).getTime();
setInterval(async function() {
    const currentTime = Date.now();
    try {
        await productModel.updateMany(
            { endTime: { $lte: currentTime }, status_of_product: "Alive" },
            { $set: { status_of_product: "Dead" } }
        );
        
        await productModel.deleteMany({ status_of_product: "Dead" });
    } catch (error) {
        console.error("Cleanup error: ", error);
    }
}, 1000);



const SchemaAuc = mongoose.Schema({});
app.listen(3000, () => console.log("Listening"));

