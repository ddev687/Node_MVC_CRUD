var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require("lodash");
const passwordHash = require('password-hash');
const boom = require("boom");
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const User = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        default: '',
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }]
});

/**
 * call before register the user
 */
User.pre('save',function (next) {
        this.password = passwordHash.generate(this.password);
        return next();
});

/**
 * @param emaiId
 * @returns {Promise}
 */
User.statics.getByEmailId = function (emailId) {
    return this.findOne({ emailId: emailId })
        .then(function (user) {
            if (user) {
                return user;
            }
            // const err = boom.notFound("No such user exists, please check emailId");
            const err = new APIError('No such user exists, please check emailId"', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

User.statics.getByUserId = function (userId){
    return this.findById({ _id: userId })
        .then(function (user) {
            if (user) {
                return user;
            }
            // const err = boom.notFound("No such user exists!");
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

User.methods = {
    safeModel : function () {
        return _.omit(this.toObject(), ['password', '__v']);
    }
}

module.exports = mongoose.model("User", User);