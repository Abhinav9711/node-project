const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
   type: String,
   required: [true, 'userName is required'],
   index: {
    unique: true
   }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    index: {
      unique: true
    }
  },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    createdAt: {
      type: Date,
      required: true
    }
});
module.exports = mongoose.model('user', userSchema);