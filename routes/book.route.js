const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book.controller");
const Joi = require("joi");
const validate = require("express-validation");

//apply validation on request body
const bookValidation = {
    createBook: {
        body: {
            name: Joi.string().required(),
          //  author: Joi.string().required(),
        }
    },
    manageBook: {
        params: {
            bookId: Joi.string().required(),
        },
        body: {
            name: Joi.string().required(),
            author: Joi.string().required(),
        }
    }
};

router.route('/')

    .post(validate(bookValidation.createBook),bookCtrl.create)

    .get(bookCtrl.getAll);

router.route('/:bo  okId')

    .get(bookCtrl.getById)

    .put(bookCtrl.update)

    .delete(bookCtrl.remove);

router.route('/getByString/:str')

    .get(bookCtrl.findByMatchingString);

router.route('/getByName/:str')

    .get(bookCtrl.findByName);

module.exports = router;