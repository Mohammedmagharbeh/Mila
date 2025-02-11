// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // لاستدعاء التوجيه
// import { fetchmila } from "../back/api";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import NotificationAddSharpIcon from '@mui/icons-material/NotificationAddSharp';
// import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
// import { Button, Fab, Modal, Box, TextField, Typography } from '@mui/material';
// import { postbooking } from "../back/api";
// function Foruser() {
//   const [cars, setmilacars] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedCar, setSelectedCar] = useState(null);
//   const [bookingDate, setBookingDate] = useState('');
//   const [bookingTime, setBookingTime] = useState('');
//   const navigate = useNavigate();

//   const handelLogOut = () => {
//     sessionStorage.removeItem('jwt');
//     navigate('/login');
//   };

//   const handleOpenModal = (car) => {
//     setSelectedCar(car);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleBooking = () => {
//     // هنا يمكن إضافة منطق إرسال الحجز إلى الخادم
//     alert(`تم حجز السيارة ${selectedCar.name} في تاريخ: ${bookingDate} الساعة: ${bookingTime}`);
//     setOpenModal(false);
//   };

//   useEffect(() => {
//     // تحقق من وجود التوكن في sessionStorage
//     const token = sessionStorage.getItem("jwt");

//     if (!token) {
//       // إذا لم يكن التوكن موجودًا، أعد التوجيه إلى صفحة login
//       navigate("/login");
//     } else {
//       const getcar = async () => {
//         const res = await fetchmila();
//         setmilacars(res.data);
//       };
//       getcar();
//     }
//   }, [navigate]);


// const postdata=async()=>{
//     const token = sessionStorage.getItem("jwt");
//     try {
//     const res=await postbooking()
        
//     } catch (error) {
        
//     }
    
// }

//   return (
//     <>

//       <div className="fab-container">

//         <Fab color="secondary" aria-label="reservation" onClick={() => navigate("/Booking")} className="fab-button">
//           <NotificationAddSharpIcon />
//         </Fab>
//         <Fab
//           color="default"
//           aria-label="reservation"
//           onClick={async () => { await handelLogOut(); }}
//           className="fab-button">
//           <LogoutSharpIcon />
//         </Fab>
//       </div>

//       <div className="cars-container">
//         {cars.map((car) => (
//           <div className="car-card" key={car._id}>
//             <h2>{car.name}</h2>
//             <p>Year: {car.year}</p>
//             <h2>Price: {car.price} Jd</h2>
//             {car.image && <img src={car.image} alt={car.name} />}
//             <Button variant="contained" color="primary" onClick={() => handleOpenModal(car)}>
//               حجز السيارة
//             </Button>
            
//           </div>
//         ))}
//       </div>

//       {/* Modal for booking */}
//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={{ 
//           position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
//           bgcolor: 'background.paper', padding: '20px', borderRadius: '8px', boxShadow: 24 }}>
//           <Typography variant="h6" component="h2">تحديد موعد الحجز</Typography>
//           <div>
//             <TextField
//               label="التاريخ"
//               type="date"
//               fullWidth
//               value={bookingDate}
//               onChange={(e) => setBookingDate(e.target.value)}
//               sx={{ marginBottom: '20px' }}
//             />
//             <TextField
//               label="الوقت"
//               type="time"
//               fullWidth
//               value={bookingTime}
//               onChange={(e) => setBookingTime(e.target.value)}
//             />
//           </div>
//           <div style={{ marginTop: '20px' }}>
//             <Button variant="contained" color="primary" onClick={handleBooking}>
//               تأكيد الحجز
//             </Button>
//             <Button variant="outlined" color="secondary" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
//               إلغاء
//             </Button>
//           </div>
//         </Box>
//       </Modal>
//     </>
//   );
// }

// export default Foruser;

import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchmila } from "../back/api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationAddSharpIcon from '@mui/icons-material/NotificationAddSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { Button, Fab, Modal, Box, TextField, Typography } from '@mui/material';

function Foruser() {
  const [cars, setmilacars] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // حالات لحقول تاريخ ووقت بدء الحجز
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  
  // حالات لحقول تاريخ ووقت انتهاء الحجز
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const navigate = useNavigate();

  const handelLogOut = () => {
    sessionStorage.removeItem('jwt');
    navigate('/login');
  };

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleBooking = async () => {
    if (!selectedCar) return;

    // تجهيز كائن البيانات المرسل للخادم مع استخدام "carId" وليس "cardId"
    const bookingObj = {
      carId: selectedCar._id,      // إرسال معرف السيارة كـ carId
      bookingDate:bookingDate,    // تاريخ بدء الحجز
      endDate:endDate,            // تاريخ انتهاء الحجز
      bookingtime:bookingTime,    // وقت بدء الحجز
      endtime:endTime             // وقت انتهاء الحجز
    };
    
    const token = sessionStorage.getItem("jwt");

    try {
      const response = await axios.post(
       "http://127.0.0.1:5000/api/postbooking",
  bookingObj,
        {
          headers: {
            // استخدام الهيدر Authorization مع البادئة Bearer
            Auth: `Bearer ${token}`,
          },
        }
      );
      alert(`تم حجز السيارة ${selectedCar.name} بنجاح!`);
      return response.data;
    } catch (error) {
      alert("حدث خطأ أثناء الحجز");
      console.error(error);
    }
    setOpenModal(false);
  };

  useEffect(() => {
    // التحقق من وجود التوكن وإعادة التوجيه إلى صفحة login إذا لم يكن موجوداً
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    } else {
      const getcar = async () => {
        const res = await fetchmila();
        setmilacars(res.data);
      };
      getcar();
    }
  }, [navigate]);

  return (
    <>
      <div className="fab-container">
        <Fab color="secondary" aria-label="reservation" onClick={() => navigate("/Booking")} className="fab-button">
          <NotificationAddSharpIcon />
        </Fab>
        <Fab
          color="default"
          aria-label="reservation"
          onClick={async () => { await handelLogOut(); }}
          className="fab-button">
          <LogoutSharpIcon />
        </Fab>
      </div>

      <div className="cars-container">
        {cars.map((car) => (
          <div className="car-card" key={car._id}>
            <h2>{car.name}</h2>
            <p>Year: {car.year}</p>
            <h2>Price: {car.price} Jd</h2>
            {car.image && <img src={car.image} alt={car.name} />}
            <Button variant="contained" color="primary" onClick={() => handleOpenModal(car)}>
              حجز السيارة
            </Button>
          </div>
        ))}
      </div>

      {/* Modal لتحديد موعد الحجز */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', padding: '20px', borderRadius: '8px', boxShadow: 24 
        }}>
          <Typography variant="h6" component="h2">تحديد موعد الحجز</Typography>
          <div>
            {/* حقل تاريخ بدء الحجز */}
            <TextField
              label="تاريخ بدء الحجز"
              type="date"
              fullWidth
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            {/* حقل وقت بدء الحجز */}
            <TextField
              label="وقت بدء الحجز"
              type="time"
              fullWidth
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            {/* حقل تاريخ انتهاء الحجز */}
            <TextField
              label="تاريخ انتهاء الحجز"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            {/* حقل وقت انتهاء الحجز */}
            <TextField
              label="وقت انتهاء الحجز"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleBooking}>
              تأكيد الحجز
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
              إلغاء
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Foruser;

