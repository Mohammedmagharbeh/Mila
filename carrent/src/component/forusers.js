import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchmila } from "../back/api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationAddSharpIcon from '@mui/icons-material/NotificationAddSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { Button, Fab, Modal, Box, TextField, Typography } from '@mui/material';




function Foruser() {
  if (window.location.pathname === '/foruser') {
   
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1739382122928-589c2221853c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";  // جعل الصورة تغطي الشاشة بالكامل
  
  
  } 
  const [cars, setmilacars] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // حالات لحقول تاريخ ووقت بدء الحجز
  const [bookingDatevalue, setBookingDate] = useState('');
  const [bookingTimevalue, setBookingTime] = useState('');
  
  // حالات لحقول تاريخ ووقت انتهاء الحجز
  const [endDatevalue, setEndDate] = useState('');
  const [endTimevalue, setEndTime] = useState('');
  const [phone, setphone] = useState('');

  
  const navigate = useNavigate();

  // دالة تحويل القيمة إلى صيغة ISO Date
  const convertToDate = (value) => {
    if (!value) return null; // إذا كانت القيمة فارغة، لا تحاول تحويلها
    const dateObj = new Date(value);
    return isNaN(dateObj.getTime()) ? null : dateObj.toISOString();
  };

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

  // الدالة لإرسال بيانات الحجز إلى API postReservation دون إرسال token
  const handleReservation = async () => {
    if (!selectedCar) return;
    const reservationObj = {
      carId: selectedCar._id,
      bookingDate: convertToDate(bookingDatevalue),
      endDate: convertToDate(endDatevalue),

      username: sessionStorage.getItem("username"), // تأكد من تخزين اسم المستخدم في sessionStorage
      phone:phone
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/postReservation",
        reservationObj,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Reservation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Reservation error:", error);
    }
  };

  // دالة handleBooking التي تستدعي كل من postNewbooking و postReservation عند تأكيد الحجز
  const handleBooking = async () => {
    if (!selectedCar) return;

    // تجهيز بيانات الحجز
    const bookingObj = {
      carId: selectedCar._id,
      bookingDate: convertToDate(bookingDatevalue),
      endDate: convertToDate(endDatevalue),
      // bookingtime: convertToDate(bookingTimevalue),
      // endtime: convertToDate(endTimevalue)
    };

    const token = sessionStorage.getItem("jwt");

    try {
      console.log("بيانات الحجز:", bookingObj);

      // استدعاء postNewbooking مع إرسال التوكن
      const bookingResponse = await axios.post(
        "http://127.0.0.1:5000/api/postNewbooking",
        bookingObj,
        {
          headers: {
            Auth: `Baerer ${token}`, // انتبه لكلمة "Baerer"؛ قد تكون "Bearer" الصحيح
            'Content-Type': 'application/json'
          },
        }
      );

      // استدعاء دالة postReservation بدون التوكن
      await handleReservation();

      alert(`تم حجز السيارة ${selectedCar.name} بنجاح!`);
      return bookingResponse.data;
    } catch (error) {
      alert("حدث خطأ أثناء الحجز");
      console.error(error);
    }
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
   <h1 className="welcome-message">
    MilaRentCar في {sessionStorage.getItem("username")}  أهلاً بك
</h1>

{/* حاوية السيارة الأولى المتحركة */}
<div className="car-container car1">
  <span className="car">🚗</span>
</div>

{/* حاوية السيارة الثانية المتحركة */}
<div className="car-container car2">
  <span className="car">🚙
    
  </span>
</div>

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
      sx={{
      }}
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ 
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           bgcolor: 'rgba(255, 255, 255, 0.8)', // خلفية بيضاء بشفافية 80%
           padding: '20px',
           borderRadius: '8px',
           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          
        }}>
          <Typography variant="h6" component="h2">تحديد موعد الحجز</Typography>
          <div>
            {/* حقل تاريخ بدء الحجز */}
            <TextField
              
              type="date"
              fullWidth
              value={bookingDatevalue}
              onChange={(e) => setBookingDate(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            {/* حقل تاريخ انتهاء الحجز */}
            <TextField
              type="date"
              fullWidth
              value={endDatevalue}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
          <TextField
  label="07********"
  type="number"
  fullWidth
  value={phone}
  onChange={(e) => {
    const newValue = e.target.value.slice(0, 10); // تقصير الإدخال إلى 10 أرقام فقط
    setphone(newValue);
  }}
  inputProps={{ maxLength: 10 }}
  sx={{ marginBottom: '20px' }}
/>


          </div>
          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleBooking}
             sx={{
              background: "linear-gradient(135deg,rgb(67, 158, 255),rgb(25, 3, 3))",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "50px",
              cursor: "pointer",
              margin: "5px",
              fontSize: "1rem",
              transition: "all 0.4s ease",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px", // تباعد بين النص والسيارة
              "&:hover": {
                background: "linear-gradient(135deg,rgb(119, 107, 255),rgb(71, 74, 255))",
                transform: "scale(1.1)",
                boxShadow: "0 0 15px rgba(127, 107, 255, 0.8)",
                "& .car-icon": {
                  left: "5px", // تحريك السيارة عند التحويم
                },
              },
            }}
          >
            <Box
              className="car-icon"
              sx={{
                position: "absolute",
                left: "-30px",
                top: "50%",
                transform: "translateY(-50%)",
                transition: "left 0.3s ease",
              }}
            >
              🚗
            </Box>
            تأكيد الحجز
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal} style={{ marginLeft: '10px' }}
             sx={{
              background: "linear-gradient(135deg,rgb(255, 67, 67),rgb(19, 16, 16))",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "50px",
              cursor: "pointer",
              margin: "5px",
              fontSize: "1rem",
              transition: "all 0.4s ease",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px", // تباعد بين النص والسيارة
              "&:hover": {
                background: "linear-gradient(135deg,rgb(227, 14, 14),rgb(80, 71, 255))",
                transform: "scale(1.1)",
                boxShadow: "0 0 15px rgba(255, 107, 107, 0.8)",
                "& .car-icon": {
                  left: "5px", // تحريك السيارة عند التحويم
                },
              },
            }}
          >
            <Box
              className="car-icon"
              sx={{
                position: "absolute",
                left: "-30px",
                top: "50%",
                transform: "translateY(-50%)",
                transition: "left 0.3s ease",
              }}
            >
              🚗
            </Box>
              إلغاء
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Foruser;
