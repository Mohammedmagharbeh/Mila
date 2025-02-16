const mongoose=require('mongoose')

const reservationSchema=new mongoose.Schema({
    username: { type: String, required: true},
carId: { type: mongoose.Schema.Types.ObjectId, ref: 'mila', required: true },
bookingDate: { type: Date,required:true },
endDate:{type:Date,required:true},
phone:{type:Number,required:true}

})
const Reser=mongoose.model('reservations',reservationSchema)
module.exports=Reser;