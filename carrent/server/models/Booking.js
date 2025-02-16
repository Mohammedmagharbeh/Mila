const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    cards:[{ carId: { type: mongoose.Schema.Types.ObjectId, ref: 'mila', required: true },
        bookingDate: { type: Date,required:true },
        endDate:{type:Date,required:true},
       


        // bookingtime:{type:String,required:true},
        // endtime:{type:String,required:true},
    }],

   
    // status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;


