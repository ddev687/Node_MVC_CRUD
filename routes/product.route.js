/**
 * Created by LaNet on 1/23/17.
 */
var productCtrl = require('./../controllers/product.controller');
var express = require('express');
var router = express.Router();

router.route('/')
    .post(productCtrl.create)

    .get(productCtrl.getAll);


router.route('/:minPrice/:maxPrice')

    .get(productCtrl.getByPriceRange);


module.exports = router;

