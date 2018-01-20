var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    categoryName: {
        type: String,
        required: true,
    },
    description: {
      type: String,
    },
    categoryImage:{
      type: String,
    },
    createdOn: {
        type: Date,
        detault: Date.now,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]

});

Category.statics.getCategoryById = function (categoryId) {
        return this.findById(categoryId)
            .then(function (category) {
                return category;
            })
            .catch(function (e) {
                const err = { message: "No such category found"};
                new Promise.reject(err);
            })
}
    
module.exports = mongoose.model('Category', Category);