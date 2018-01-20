var Category = require('./../models/category.model');

function create(req, res, next) {
    var category = new Category();
    category.categoryName = req.body.categoryName;
    category.description = req.body.description;
    category.save()
        .then(function (category) {
            res.send(category);
        })
        .catch(function (err) {
            res.send(err);
        })
}

/*
Populate products when get category
 */
function getAll(req, res, next) {
    Category.find().populate('products').exec()
        .then(function (category) {
            return res.send(category);
        })
        .catch(function (err) {
            return next(err);
        })
}

function getById(req, res, next) {
    Category.getCategoryById(req.params.categoryId)
        .then(function (category) {
            return res.send(category);
        })
        .catch(function (err) {
            return next(err);
        })
}

function getByPageNo(req, res, next) {
    let perpage = 5;
    let pageNo = parseInt(req.params.pageNo) || 0;
    let total = 0;
    let totalpage = 0;
    Category.find()
        .then(function (category) {
            console.log("******************");
            total = category.length;
            console.log(total);
            console.log("******************");
            console.log(Math.ceil(total/perpage));
            totalpage = Math.ceil(total/perpage);
            return Category.find().skip(pageNo*perpage).limit(perpage);
        })
        .then(function (category) {
            let data = { pageNo: pageNo, totalPage: totalpage, category: category};
            return res.send(data);
        })
        .catch(function (err) {
            return next(err);
        })
}

/**
 *
 * @param req
 * @param res Get all unique category name
 * @param next
 */
function getUniqueCategory(req, res, next) {
    Category.find().distinct('categoryName')
        .then(function (categories) {
            console.log("Inside get");
            return res.send(categories);
        })
        .catch(function (err) {
            console.log("Inside Err");
            return next(err);
        })
}

module.exports = { create, getAll, getById, getUniqueCategory, getByPageNo };