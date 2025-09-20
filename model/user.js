const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});
//it automatically adds username and password fields to the user schema and hashing,salting,some methods like setpassword,changepassword etc
userSchema.plugin(passportLocalMongoose);// Enable passport local strategy for user schema

module.exports = mongoose.model('User', userSchema);