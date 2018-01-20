const Author = require("../models/author.model");
const APIError = require("../helpers/APIError");
/**
 *
 * @param { fullname, emailId }
 * @param res
 *
 */
function create(req, res, next) {
    var author = new Author();
    author.fullName = req.body.fullName;
    author.emailId = req.body.emailId;
    author.gender = req.body.gender;
    author.createdBy = res.locals.session;
    if (req.body.profile)
        author.profile = req.body.profile;
    author.save()
        .then(function () {
            return res.json({message: "Author added."});
        })
        .catch(function (err) {
            //return res.send(err);
            return next(err);
        })
}

function getAll(req, res, next) {
    Author.find().sort({ createdOn: -1 })
        .then(function (author) {
            return res.json(author);
        })
        .catch(function (err) {
            return next(err);
        })
}

/**
 *
 * @param req authorId
 * @param res author detail or error if not found
 * @param next if any error
 */
function getById(req, res, next) {
    Author.getByAuthorId(req.params.authorId)
        .then(function (author) {
            return res.json(author);
        }).catch(function (err) {
        return next(err);
    })
}

/**
 *
 * @param req authorId
 * @param res author detail or error
 */
function remove(req, res, next) {
    Author.getByAuthorId(req.params.authorId)
        .then(function (author) {
            Author.remove({ _id: author._id })
        })
        .then(function (author) {
            return res.json({message: "author successfully deleted."});
        })
        .catch(function (err){
            return next(err);
        })
}

/**
 *
 * @param req authorId and authordetails to update
 * @param res updated message
 * @param next if error
 */
function update(req, res, next) {
    Author.getByAuthorId(req.params.authorId)
        .then(function (author) {
            author.fullName = req.body.fullName || author.fullName;
            author.emailId = req.body.emailId || author.emailId;
            author.gender = req.body.gender || author.gender;
            return author.save()
        })
        .then(function (author) {
            console.log(author);
            return res.json({message: "author successfully updated."});
        })
        .catch(function (err){
            return next(err);
        })
}

// Get all authors by limit
function getByPageNo(req, res, next) {
    let perpage = 5;
    let pageNo = parseInt(req.params.pageNo) || 0;
    let total = 0;
    let totalpage = 0;
    Author.find()
        .then(function (author) {
            total = author.length;
            console.log(total);
            console.log(Math.ceil(total/perpage));
            totalpage = Math.ceil(total/perpage);
            return Author.find().skip(pageNo*perpage).limit(perpage);
        })
        .then(function (author) {
            let data = { pageNo: pageNo, totalPage: totalpage, author: author};
            return res.send(data);
        })
        .catch(function (err) {
            return next(err);
        })
}

module.exports = { create, getAll, getById, remove, update, getByPageNo };