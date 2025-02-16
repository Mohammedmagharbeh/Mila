import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/booking.css';
import { useNavigate } from 'react-router-dom';
import { Button, Fab, Badg,} from '@mui/material';
import EngineeringSharpIcon from '@mui/icons-material/EngineeringSharp';

function UserReservations() {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  // حالات لإدارة عملية التحديث
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedBookingDate, setUpdatedBookingDate] = useState('');
  const [updatedEndDate, setUpdatedEndDate] = useState('');
  const navigate=useNavigate()
  if (window.location.pathname === '/Booking') {
   
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGNhcnxlbnwwfHwwfHx8MA%3D%3D')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";  // جعل الصورة تغطي الشاشة بالكامل
  
  
  }
  useEffect(() => { 
    const token = sessionStorage.getItem('jwt');
    if (!token) {
      console.error("التوكن غير موجود في sessionStorage!");
      setErrorMessage("لم يتم العثور على التوكن، الرجاء تسجيل الدخول مرة أخرى.");
      return;
    }

    const getBookings = async () => {
      try {
        console.log("إرسال التوكن:", token);
        const response = await axios.get('http://127.0.0.1:5000/api/getbooking', {
          headers: {
            Auth: `Baerer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log("الرد من السيرفر:", response.data);

        let reservations = [];

        if (Array.isArray(response.data)) {
          reservations = response.data;
        } else if (response.data && Array.isArray(response.data.cards)) {
          reservations = response.data.cards;
        } else {
          console.error("البيانات المسترجعة ليست بالشكل المتوقع.");
          setErrorMessage("لم يتم العثور على بيانات الحجوزات بالشكل المتوقع.");
          return;
        }

        setBookingInfo(reservations);
      } catch (error) {
        console.error("خطأ في جلب بيانات الحجوزات:", error);
        setErrorMessage("فشل في جلب بيانات الحجوزات. الرجاء التأكد من تسجيل الدخول أو مراجعة الخادم.");
      }
    };

    getBookings();
  }, []);

  // دالة حذف الحجز
  const handleDelete = async (carId, endDate, bookingDate) => {
    const token = sessionStorage.getItem('jwt');
    try {
      const response = await axios.delete('http://127.0.0.1:5000/api/deletebooking', {
        data: { carId, endDate, bookingDate },
        headers: {
          Auth: `Baerer ${token}`,
          "Content-Type": "application/json"
        }
      });
          
      console.log("تم حذف الحجز بنجاح:", response.data);
      // تحديث الحالة لإزالة الحجز المحذوف من القائمة
      setBookingInfo((prevBookings) =>
        prevBookings.filter(
          (item) =>
            !(item.carId?._id === carId && item.endDate === endDate && item.bookingDate === bookingDate)
        )
      );
    } catch (error) {
      console.error("خطأ في حذف الحجز:", error);
      setErrorMessage("فشل في حذف الحجز. الرجاء المحاولة مرة أخرى.");
    }
  };

  // دالة تحديث الحجز (تمديد الحجز)
  const handleUpdate = async (item, index) => {
    const token = sessionStorage.getItem('jwt');
    try {
      const response = await axios.put('http://127.0.0.1:5000/api/updatebooking', {
         carId: item.carId?._id,
         bookingDate: item.bookingDate,
         endDate: item.endDate,
         newBookingDate: updatedBookingDate,
         newEndDate: updatedEndDate,
      }, {
         headers: {
              Auth: `Baerer ${token}`,
              "Content-Type": "application/json"
         }
      });
      console.log("تم تحديث الحجز بنجاح:", response.data);
      // تحديث الحالة مع التواريخ الجديدة
      setBookingInfo((prevBookings) => {
         const updatedBookings = [...prevBookings];
         updatedBookings[index].bookingDate = updatedBookingDate;
         updatedBookings[index].endDate = updatedEndDate;
         return updatedBookings;
      });
      // إعادة تعيين حالة التحديث
      setEditingIndex(null);
      setUpdatedBookingDate('');
      setUpdatedEndDate('');
    } catch (error) {
      console.error("خطأ في تحديث الحجز:", error);
      setErrorMessage("فشل في تحديث الحجز. الرجاء المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="reservations-page">
      <h1 className="page-title">حجوزاتي 🚗✨</h1>

      {errorMessage && (
        <div className="error-message">
          ⚠️ {errorMessage}
        </div>
      )}

<div className="fab-container">
        <Fab color="red" aria-label="users" onClick={() => navigate('/')} className="fab-button" title="Admin page"
          sx={{color:'Darkblue'}}>
          <EngineeringSharpIcon />
        </Fab>
        </div>
      {bookingInfo.length === 0 && !errorMessage ? (
        <div className="empty-state">
          <img src="/no-reservations.svg" alt="No reservations" />
          <p>لا توجد حجوزات لعرضها</p>
          <button className="cta-button">احجز الآن!</button>
        </div>
      ) : (
        <div className="reservations-grid">
          {bookingInfo.map((item, index) => (
            <div
              className={`reservation-card ${new Date(item.endDate) > new Date() ? 'active' : 'expired'}`}
              key={index}
            >
              <div className="card-header">
                <div className="car-image-container">
                  {item.carId?.image ? (
                    <img
                      src={item.carId.image}
                      alt={item.carId.name}
                      className="car-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <i className="fas fa-car-side"></i>
                    </div>
                  )}
                </div>
                <div className="car-info">
                  <h3>{item.carId?.name}</h3>
                  <p className="price">{item.carId?.price} د.أ/ اليوم</p>
                </div>
              </div>

              <div className="card-body">
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>تاريخ الحجز: {new Date(item.bookingDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar-times"></i>
                    <span>تاريخ الانتهاء: {new Date(item.endDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div className="card-actions">
                  {new Date(item.endDate) > new Date() && (
                    <>
                      {editingIndex === index ? (
                        <div className="update-form">
                          <div>
                            <label>تاريخ الاستلام</label>
                            <input
                              type="date"
                              value={updatedBookingDate}
                              onChange={(e) => setUpdatedBookingDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label>تاريخ التسليم</label>
                            <input
                              type="date"
                              value={updatedEndDate}
                              onChange={(e) => setUpdatedEndDate(e.target.value)}
                            />
                          </div>
                          <button className="action-button" onClick={() => handleUpdate(item, index)}>
                            <i className="fas fa-save"></i> حفظ
                          </button>
                          <button
                            className="action-button cancel-button"
                            onClick={() => setEditingIndex(null)}
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          className="action-button"
                          onClick={() => {
                            setEditingIndex(index);
                            setUpdatedBookingDate(item.bookingDate);
                            setUpdatedEndDate(item.endDate);
                          }}
                        >
                          <i className="fas fa-calendar-plus"></i>
                          تمديد الحجز
                        </button>
                      )}
                    </>
                  )}
                  {/* زر حذف الحجز */}
                  <button
                    className="action-button delete-button"
                    onClick={() =>
                      handleDelete(item.carId?._id, item.endDate, item.bookingDate)
                    }
                  >
                    <i className="fas fa-trash-alt"></i>
                    حذف الحجز
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ); 
}

export default UserReservations;
