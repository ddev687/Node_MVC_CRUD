const Book = require("../models/book.model");
const User = require("../models/user.model");
const Author = require("../models/author.model");
const mongoose = require("mongoose");

// when create a book also push to user collection
function create(req, res, next) {
    var book = new Book();
    book.name = req.body.name;
    book.author = mongoose.Types.ObjectId(req.body.author);
    book.owner = res.locals.session;
    book.createdBy = res.locals.session;
    book.save()
        .then(function (book) {
            //console.log(book);
            return User.getByUserId(res.locals.session);
        })
        .then(function (user) {
            // console.log(user);
            user.books.push(book);
            return user.save()
        }).then(function (usersaved) {
            return Author.getByAuthorId(mongoose.Types.ObjectId(req.body.author));
        })
        .then(function (author) {
            // console.log(author);
            author.books.push(book);
            return author.save();
        })
        .then(function () {
            return res.json({message: "Book created."});
        })
        .catch(function (err) {
            // console.log(err);
            return next(err);
        })
}

//Here populate the book details with by whome added and book author details as well
function getAll(req, res, next) {
    Book.find({})
        .populate('owner')
        .populate('author')
        .sort({ createdOn: -1 })
        .exec()
        .then(function (books) {
            return res.json(books);
        })
        .catch(function (e) {
            return next(e);
        })
}

/**
 *
 * @param req bookId
 * @param res book details
 * @param next if any error
 */
function getById(req, res, next) {
    Book.getByBookId(req.params.bookId)
        .then(function (book) {
            return res.json(book);
        })
        .catch(function (e) {
            return next(e);
        })
}

/**
 *
 * @param in Params - BookId and body - Book details
 * @param res updated message
 * @param next if any error
 */
function update(req, res, next) {
    Book.getByBookId(req.params.bookId)
        .then(function (book) {
            book.name = req.body.name || book.name;
            book.author = req.body.author || book.author;
            return book.save()
        })
        .then(function () {
            return res.json({message: "Book update."});
        })
        .catch(function (e) {
            return next(e);
        })
}

/**
 *
 * @param req bookId
 * @param res book details
 * @param next if any error
 */
function remove(req, res, next) {
    Book.getByBookId(req.params.bookId)
        .then(function (book) {
            Book.remove({ _id: book._id })
        })
        .then(function (book) {
            return res.json({message: "successfully deleted."});
        })
        .catch(function (e){
            return next(e);
        })
}

/**
 *
 * @param req -> any string or character
 * @param res -> matching data
 * @param next -> error
 */
function findByMatchingString(req, res, next) {
    // Option i for ignore case
    Book.find({ "name": { "$regex": req.params.str, "$options": "i" }})
    //Book.find().where('name').equals(req.params.str)
        .then(function (books) {
            return res.send(books);
        })
        .catch(function (e){
            return next(e);
        })
}

/**
 *
 * @param req -> book name
 * @param res -> matching books
 * @param next -> error
 */
function findByName(req, res, next) {
    Book.find().where('name').equals(req.params.str)
        .then(function (books) {
            return res.send(books);
        })
        .catch(function (e){
            return next(e);
        })
}

module.exports = { create, getAll, update, getById, remove, findByMatchingString, findByName};