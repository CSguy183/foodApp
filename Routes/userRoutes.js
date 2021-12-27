const express = require("express");
const userModel = require('../models/UserModel');
let {jwt_key} = require('../secrets');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

function protectRoute(req, res, next){
    try{
        if(req.cookies.jwt_){
            let isVerified = jwt.verify(req.cookies.jwt_, jwt_key);
            if(isVerified) next();
        }
        else{
            res.status(401).json({
                message : 'not allowed to see users unless signIn'
            })
        }
    }
    catch{
        res.status(500).json({
            messgae: 'server error'
        });
    }
}

async function getUsers(req, res) {
    try {
        let users = await userModel.find();
        res.status(200).json({
            message: 'list of users',
            users: users
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'cannot get users',
            error: e
        })
    }
}

userRouter
    .get('/', getUsers)

module.exports = userRouter;