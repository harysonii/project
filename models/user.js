const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
   },
    username: {
        type: String,
        required: true
   },
    email: {
        type: String,
        required: true
    },
    password: {
          type: String,
         required:true
          },
	country: {
         type: String,
         required:true
          },
	gender: {
         type: String,
         required:true
          },
	yob: {
         type: Number,
         required:true
          },
	about: {
         type: String,
         required: false
          },
   events: {
        type: String,
        required: false
    }
    
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);