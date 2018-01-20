var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Product = new Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 10,
        max: 500
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }
});

module.exports = mongoose.model("Product", Product);