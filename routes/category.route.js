/**
 * Created by LaNet on 1/23/17.
 */
var categoryCtrl = require('./../controllers/category.controller');
var express = require('express');
var router = express.Router();

router.route('/')
    .post(categoryCtrl.create)

    .get(categoryCtrl.getAll);


router.route('/getByPage/:pageNo')
    .get(categoryCtrl.getByPageNo);

router.route('/uniqueCategory')
    .get(categoryCtrl.getUniqueCategory)

router.route('/:categoryId')
    .get(categoryCtrl.getById);




module.exports = router;

