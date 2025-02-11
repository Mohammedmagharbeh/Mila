const Booking=require('../models/Booking')
const milarent=require('../models/milarent')


exports.getbooking= async(req,res)=>{
    try {
       const booking=await Booking.findOne({userId:req.user});
       res.status(200).json(booking);
    }

    catch(error){
res.status(500).json({error: error.message});
    }
}




exports.postbooking= async(req,res)=>{
    const {carId,bookingDate,endDate,bookingtime,endtime}=req.body;
    const userId=req.user
    try{
        let booking=await Booking.findOne({userId})
        if(!booking){
            booking=new Booking({
                userId,
                carId:[]})
    }
    //بشوف اذا المنتج موجود او لا 
    const cardIndex= booking.cards.findIndex((item)=>item.carId.toString()===carId);
//     if(cardIndex>-1){
//         //اذا بدي اضيف نفس المنتج مره ثانيه في نفس الكرت رح يعدل الكميه فقط
//         // booking.cards[cardIndex].quantity+=quantity;
// }
//اذا المنتج مش موجود رح اضيفه 
    booking.cards.push({carId,bookingDate,endDate,bookingtime,endtime});

await booking.save();
res.status(200).json(booking);

}
    catch(error){
        res.status(500).json({error: error.message});
    
    }
}
