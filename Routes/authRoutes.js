const express = require("express");
const userModel = require('../models/UserModel');
let { jwt_key } = require('../secrets');
const jwt = require('jsonwebtoken');
const emailSender = require("../externalServices/emailSender");

const authRouter = express.Router();

function createdAt(req, res, next) {
    let body = req.body;
    let len = Object.keys(body).length;
    if (len == 0) {
        return res.status(400).json({
            message: "can't create user when body is empty "
        })
    }
    req.body.createdAt = Date().toLocaleLowerCase();
    next();
}

async function signUp(req, res) {
    try {
        const userObj = req.body;
        console.log("userObj", req.body);

        let user = await userModel.create(userObj);

        res.status(200).json({
            message: 'user created',
            createdUser: user
        });
    }
    catch (e) {
        console.log(e);
    }
}

async function logIn(req, res) {
    try {
        let { email, password } = req.body;
        let obj = await userModel.findOne({ email: email });
        if (obj != null) {
            if (password == obj.password) {
                let payload = obj["_id"];
                var token = jwt.sign({ id: payload }, jwt_key);
                res.cookie("jwt_", token, { httpOnly: true });
                res.status(200).json({
                    message: 'user logged in',
                    user: obj
                })
            }
            else {
                res.status(200).json({
                    message: 'wrong password entered',
                })
            }

        }
        else {
            res.status(404).json({
                message: 'user not found',
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}

async function forgetPassword(req, res) {

    let email = req.body.email;
    // console.log(email);
    let ustr = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    try {
        if (email) {
            await userModel.updateOne({ email }, { token: ustr });
            let user = await userModel.findOne({ email });
            await emailSender(ustr);
            console.log(user);
            if (user?.token) {
                return res.status(200).json({
                    message: 'email sent with token' + ustr
                })
            }
            else {
                return res.status(404).json({
                    message: 'user not found'
                })
            }
        }
        else {
            return res.status(400).json({
                message: 'kindly enter email'
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function resetPassword(req, res) {
    let { token, password, confirmPassword } = req.body;
    try {
        if (token) {
            let user = await userModel.findOne({ token });
            console.log(user);
            if (user) {
                user.password = password;
                user.confirmPassword = confirmPassword;
                user.token = undefined;
                await user.save();

                return res.status(200).json({
                    message : 'password reset successful'
                })
            }
            else {
                return res.status(404).json({
                    message: 'incorrect token'
                })
            }
        }
        else {
            return res.status(404).json({
                message: 'user not found'
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'server error'
        })
    }
}

authRouter
    .post('/signup', createdAt, signUp)
    .post('/login', logIn)
    .post('/forgetPassword', forgetPassword)
    .post('/resetPassword', resetPassword)

module.exports = authRouter;