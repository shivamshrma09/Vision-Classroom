const mongoose = require('mongoose');



const otpSchema = new mongoose.Schema({
    otp:{
        type: String,
        required: true,
        minlength: [ 3, 'name must be at least 3 characters long' ],
    },

    email:{
      type:String,
      required: true,
      unique:true
    },
    

}, { timestamps: true });


const OtpModel = mongoose.model('Otp', otpSchema)
module.exports = OtpModel;