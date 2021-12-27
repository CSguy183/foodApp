const mongoose = require('mongoose');
let {dbLink} = require('../secrets');
var validator = require('validator');

mongoose.connect(dbLink).then(function(db){
    // console.log(db)
    console.log('connected to db');
}).catch(function(err){
    console.log(err)
});

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    email:{
        type:String,
        required:true,
        validate: function(){
            validator.isEmail(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        validate: function(){
            return this.password == this.confirmPassword
        }
    },
    createdAt:{
        type:String
    },
    token:{
        type:String
    }
});

userSchema.pre('save', function(next){
    this.confirmPassword = undefined;
    next();
})
const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;