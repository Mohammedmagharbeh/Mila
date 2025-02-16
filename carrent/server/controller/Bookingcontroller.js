const Booking=require('../models/Booking')
const milarent=require('../models/milarent')



exports.getbooking = async (req, res) => {
    try {
      // نفترض أن في موديل Booking يوجد حقل "cards" وكل عنصر يحتوي على "carId" مرتبط بموديل Car
      const booking = await Booking.findOne({ userId: req.user }).populate('cards.carId');
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
    booking.cards.push({carId,bookingDate,endDate});

await booking.save();
res.status(200).json(booking);

}
    catch(error){
        res.status(500).json({error: error.message});
    
    }
}

exports.deletebooking = async (req, res) => {
    const { carId, endDate, bookingDate } = req.body;
    // التأكد من استخراج معرف المستخدم بالشكل الصحيح
    const userId = req.user && req.user._id ? req.user._id : req.user;
  
    try {
      // البحث عن حجز المستخدم في قاعدة البيانات
      const booking = await Booking.findOne({ userId });
      if (!booking) {
        return res.status(404).json({ error: 'booking not found' });
      }
  
      // البحث عن العنصر المناسب في مصفوفة الحجوزات
      const bookingIndex = booking.cards.findIndex((item) =>
        item.carId.toString() === carId &&
        new Date(item.endDate).toISOString() === new Date(endDate).toISOString() &&
        new Date(item.bookingDate).toISOString() === new Date(bookingDate).toISOString()
      );
  
      if (bookingIndex > -1) {
        // إزالة الحجز من المصفوفة
        booking.cards.splice(bookingIndex, 1);
        await booking.save();
        return res.status(200).json({ message: 'Booking deleted successfully', booking });
      } else {
        return res.status(404).json({ error: 'Booking not found in records' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


  exports.updatebooking = async (req, res) => {
    // نحتاج لتحديد الحجز باستخدام carId والتواريخ القديمة ثم تحديثها
    const { carId, bookingDate, endDate, newBookingDate, newEndDate } = req.body;
    const userId = req.user && req.user._id ? req.user._id : req.user;
    try {
      const booking = await Booking.findOne({ userId });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      const bookingIndex = booking.cards.findIndex((item) =>
        item.carId.toString() === carId &&
        new Date(item.bookingDate).toISOString() === new Date(bookingDate).toISOString() &&
        new Date(item.endDate).toISOString() === new Date(endDate).toISOString()
      );
      if (bookingIndex > -1) {
        // تحديث بيانات الحجز بالتواريخ الجديدة
        booking.cards[bookingIndex].bookingDate = newBookingDate;
        booking.cards[bookingIndex].endDate = newEndDate;
        await booking.save();
        return res.status(200).json({ message: 'Booking updated successfully', booking });
      } else {
        return res.status(404).json({ error: 'Booking not found in records' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };