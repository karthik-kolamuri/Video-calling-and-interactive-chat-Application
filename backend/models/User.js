// const mongoose = require('mongoose');
import mongoose from 'mongoose'; 
// const bycrypt = require('bcryptjs');
import bycrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  bio: {
    type: String,
    default: ''
  },
  nativeLanguage: {
    type: String,
    default: ''
  },
  learningLanguage: {
    type: String,
    default: ''
  },isOnboarded: {
    type: Boolean,
    default: false
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });



userSchema.pre('save', function(next) {
  try{
    if (!this.isModified('password')) {
      return next();
    }
    const salt = bycrypt.genSaltSync(12);
    this.password = bycrypt.hashSync(this.password, salt);
    next();
  }
  catch(err){
    next(err);
  }
});



const User = mongoose.model('User', userSchema);

export default User;