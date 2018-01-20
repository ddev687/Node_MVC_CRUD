const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const Joi = require("joi");
const validate = require("express-validation");
//apply validation on request body
const userValidation = {
    registerUser: {
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            emailId: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    },
    userLogin: {
        body: {
            emailId: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    },
    updateUser: {
        params:{
            userId: Joi.string().required(),
        }
    }
};


router.route('/register')

    .post(validate(userValidation.registerUser),userCtrl.create)

    .get(userCtrl.getAllUser);

router.route('/login')

    .post(validate(userValidation.userLogin),userCtrl.userLogin);

router.route('/user/:userId')

    .delete(userCtrl.remove);

module.exports = router;