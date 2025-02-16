const milarent=require('../models/milarent')
const Reservation=require('../models/Reservationusers')



// مثال على نموذج Reservation يجب أن يحتوي على حقل seen من النوع Boolean مع القيمة الافتراضية false

// جلب جميع الحجوزات مع populate لحقل carId
exports.getReservation = async (req, res) => {
    try {
      const reservations = await Reservation.find().populate('carId');
      res.status(200).json(reservations);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // تحديث جميع الحجوزات لتعليمها بأنها "مشاهدة" (يتم استدعاؤها عند دخول صفحة الحجوزات)
  exports.markReservationsSeen = async (req, res) => {
    try {
      await Reservation.updateMany({ seen: false }, { seen: true });
      res.status(200).json({ message: "تم تعليم الحجوزات كمُشاهدة" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // نقطة نهاية جديدة لإرجاع عدد الحجوزات غير المُشاهدة فقط
  exports.getUnseenReservationsCount = async (req, res) => {
    try {
      const count = await Reservation.countDocuments({ seen: false });
      res.status(200).json({ count });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  


exports.postreservation=async(req,res)=>{
    const{username,carId,endDate,bookingDate,phone}=req.body
    try {
     
     const userRes={username:username,carId:carId,endDate:endDate,bookingDate:bookingDate,phone:phone}
        const newRes=await Reservation.create(userRes)
    //  const newuser=await user.create(adduser)  
     res.status(200).json(newRes)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}