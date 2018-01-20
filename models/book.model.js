var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require("lodash");
const boom = require("boom");
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const Book = new Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    author: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

// Pre save the book
// Book.pre('save', function(next) {
//     console.log("call pre save book");
//     return next();
// });

Book.method({

});

//get book by book Id
Book.statics.getByBookId = function (bookId) {
    return this.findById(bookId).populate('owner').exec()
        .then(function (book) {
            if (book) {
                return book;
            }
            const err = new APIError('Book not found"', httpStatus.NOT_FOUND);
            //const err = boom.notFound("Book not found");
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("Book", Book);