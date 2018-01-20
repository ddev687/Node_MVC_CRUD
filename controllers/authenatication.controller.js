const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const passwordHash = require('password-hash');
const boom = require('boom');
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

/**
 *
 * @param req oldPassword, newPassword
 * @param res changed
 * @param next error
 */
function changePassword(req, res, next) {
    User.getByUserId(res.locals.session)
        .then(function (user) {
            if(passwordHash.verify(req.body.oldPassword, user.password)) {
                user.password = req.body.newPassword;
                return user.save()
            }else {
                const err = new APIError("Fail to change your password, please check your current password.", httpStatus.UNAUTHORIZED);
                // const err = boom.unauthorized("Fail to change your password, please check your current password.");
                return Promise.reject(err);
            }
        }).then(function (user) {
        return res.json({ message: "Password successfully changed." });
    })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = { changePassword };