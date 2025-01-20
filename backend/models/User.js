// const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }, 
    date:{
        type:String,
        default:Date.now
    }/*
    address:{
        type:String,
        default:"Amaravti"
    } */
    
  });
  const User = mongoose.model('user',UserSchema);

  module.exports = User;