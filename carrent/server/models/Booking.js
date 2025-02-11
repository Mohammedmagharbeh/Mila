const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    cards:[{ carId: { type: mongoose.Schema.Types.ObjectId, ref: 'milas', required: true },
        bookingDate: { type: Date,required:true },
        endDate:{type:Date,required:true},
        bookingtime:{type:Date,required:true},
        endtime:{type:Date,required:true},}],

   
    // status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

