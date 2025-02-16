import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/reservation.css'
import { useNavigate } from 'react-router-dom';
import { Button, Fab, Badg,} from '@mui/material';
import EngineeringSharpIcon from '@mui/icons-material/EngineeringSharp';



if (window.location.pathname === '/Reservation') {
   
  document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";  // جعل الصورة تغطي الشاشة بالكامل


}
function Reservation() {
  const [reservations, setReservations] = useState([]);
const navigate=useNavigate()
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/gettReservation');
        setReservations(res.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };
    fetchReservations();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'غير محدد' : date.toLocaleDateString('ar-EG');
  };

  return (
    
    <div className="reservation-container">
      <div className="moving-car">🚗</div>
      
      <h1 className="main-title">
        الحجوزات🚗
        <span className="year">2025</span>
      </h1>
      <div className="fab-container">
        <Fab color="red" aria-label="users" onClick={() => navigate('/')} className="fab-button" title="Admin page"
          sx={{color:'Darkblue'}}>
          <EngineeringSharpIcon />
        </Fab>
        </div>
      {reservations.length > 0 ? (
        <div className="cards-grid">
          {reservations.map((reservation) => (
            <div 
              key={reservation._id}
              className="reservation-card"
            >
              <div className="card-header">
                <div className="user-info">
                 
                </div>
                <div className="image-container">
                  {reservation.carId?.image ? (
                    <img
                      src={reservation.carId.image}
                      alt={reservation.carId?.name || 'Car'}
                      className="car-image"
                    />
                  ) : (
                    <div className="car-placeholder">🚗</div>
                  )}
                </div>
              </div>

              <div className="card-details">
                <div className="car-name">
                  <h3>
                    قام ({reservation.username}) بحجز {reservation.carId?.name || reservation.carId}
                  </h3>
                  {reservation.carId?.year && (
                    <p className="car-year">سنة الصنع: {reservation.carId.year}</p>
                  )}
                  <br/>
                  <p className="phone-number">رقم الهاتف: ({reservation.phone})</p>
                  <br/>
                 
                </div>
              </div>

                <div className="date-box start-date">
                  <span>بداية الحجز</span>
                  <strong>{formatDate(reservation.bookingDate)}</strong>
                </div>

                <div className="date-box end-date">
                  <span>نهاية الحجز</span>
                  <strong>{formatDate(reservation.endDate)}</strong>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="loading">
          <p>جارٍ تحميل الحجوزات...</p>
          <div className="loading-car">🚗</div>
        </div>
      )}
    </div>
  );
}

export default Reservation;
