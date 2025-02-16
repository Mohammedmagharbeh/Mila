import React, { useEffect, useState } from 'react';
import { fetchmila, postnwemila, deletcaremila, updatemilacar } from '../back/api';
import { Button, Fab, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationAddSharpIcon from '@mui/icons-material/NotificationAddSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import '../css/mila.css';

function Milarent() {
  if (window.location.pathname === '/') {
   
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1543465077-db45d34b88a5?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";  // جعل الصورة تغطي الشاشة بالكامل


  }
  
  const [cars, setmilacars] = useState([]);
  const [formData, setformData] = useState({ name: '', year: '', price: '', image: '' });
  const [modalstate, setmodalstate] = useState(false);
  const [selececar, setselectcar] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const navigate = useNavigate();
  const [user, setuser] = useState({});
  const [reservationCount, setReservationCount] = useState(0);

  // جلب قائمة السيارات
  useEffect(() => {
    const getcar = async () => {
      const res = await fetchmila();
      setmilacars(res.data);
    };
    getcar();
  }, []);

  // التحقق من صلاحية التوكن وإعادة التوجيه
  useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const username=sessionStorage.getItem('username')
    console.log(username)
    if (!token) {
      navigate('/login');
      return;
    }

    const invalidToken = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/home', {
          headers: { 'Auth': 'Baerer ' + token },
        });
        if (res.data.user.roul==='admin') {
          navigate('/');
        } else {
          navigate('/foruser')
          setuser(res.data.user);
        }
      } catch (err) {
        console.log(err.response);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    invalidToken();
  }, [navigate]);

  // جلب عدد الحجوزات
  useEffect(() => {
    const fetchReservationsCount = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/gettReservation');
        setReservationCount(res.data.length);
      } catch (error) {
        console.error('Error fetching reservations count:', error);
      }
    };
    fetchReservationsCount();
  },[]);

  // إضافة سيارة جديدة
  const addcar = async (e) => {
    e.preventDefault();
    const res = await postnwemila(formData);
    setmilacars([...cars, res.data]);
    setformData({ name: '', year: '', price: '', image: '' });
  };

  const handelinputadd = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const imageData = reader.result;
        setformData({ ...formData, image: imageData });
      };
      reader.readAsDataURL(file);
    } else {
      alert('يرجى اختيار صورة.');
    }
  };

  // فتح صندوق الحوار للتأكيد على حذف السيارة
  const confirmDeleteDialog = (id) => {
    setCarToDelete(id);
    setDeleteDialogOpen(true);
  };

  // إذا ضغط المستخدم على Yes يتم حذف السيارة
  const handleDeleteConfirm = async () => {
    await deletcaremila(carToDelete);
    setmilacars(cars.filter((car) => car._id !== carToDelete));
    setDeleteDialogOpen(false);
    setCarToDelete(null);
    alert('The car has been deleted successfully.');
  };

  // إلغاء عملية الحذف
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  // تعديل السيارة
  const updatecarmila = async (e) => {
    // e.preventDefault();
    await updatemilacar(selececar._id, formData);
    setmodalstate(false);
    alert('Car was updated');
    setformData({ name: '', year: '', price: '', image: '' });
  };
  

  const handeleditcar = (car) => {
    setselectcar(car);
    setformData({ name: car.name, year: car.year, price: car.price, image: car.image });
    setmodalstate(true);
  };

  const handelLogOut = () => {
    sessionStorage.removeItem('jwt');
    navigate('/login');
  };

  const closeModal = () => {
    setmodalstate(false);
    setformData({ name: '', year: '', price: '', image: '' });
  };

  return (
    <>
       <h1 className="welcome">
   🚗✨ أهلاً بك{sessionStorage.getItem("username")}
</h1>
      <div className="cars-container">
      {cars.map((car) => (
          <div className="car-card" key={car._id}>
            <h2>{car.name}</h2>
            <p>Year: {car.year}</p>
            <h2>Price: {car.price} JD</h2>
            {car.image && <img src={car.image} alt={car.name} />}
            <button
              className="delete-button"
              onClick={() => confirmDeleteDialog(car._id)}
              title="Delete"
            >
              <DeleteIcon />
            </button>
            <button onClick={() => handeleditcar(car)} className="edit" title="Edit">
              <EditIcon />
            </button>
          </div>
        ))}
      </div>

      <form className="car-form" onSubmit={addcar}
      >
        <input
          name="name"
          value={formData.name}
          type="text"
          placeholder="Car Name"
          onChange={handelinputadd}
          className="form-input"
          required
        />
        <input
          name="year"
          value={formData.year}
          type="number"
          placeholder="Year"
          onChange={handelinputadd}
          className="form-input"
          required
        />
        <input
          name="price"
          value={formData.price}
          type="number"
          placeholder="Price"
          onChange={handelinputadd}
          className="form-input"
          required
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
          required
        />
        <button className="submit-button" type="submit">
          Add Car
        </button>
      </form>

      {modalstate && (
        <div className="modal">
          <div className="modal-content">
<h2>
    <span class="car-icon">🚗</span> Edit Car
</h2>
            <form onSubmit={updatecarmila}>
              <input
                name="name"
                value={formData.name}
                type="text"
                placeholder="Car Name"
                onChange={handelinputadd}
                required
              />
              <input
                name="year"
                value={formData.year}
                type="number"
                placeholder="Year"
                onChange={handelinputadd}
                required
              />
              <input
                name="price"
                value={formData.price}
                type="number"
                placeholder="Price"
                onChange={handelinputadd}
                required
              />
              <input name="image" type="file" accept="image/*" onChange={handleImageChange} />
              <button type="submit">Update Car</button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* صندوق الحوار لتأكيد الحذف */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}className="delete-dialog">
        <DialogTitle sx={{ color: "white", fontWeight: "bold" }}>🚗Confirm Deletion🚗</DialogTitle>
        <DialogContent>
        <DialogContentText sx={{ color: "white", fontWeight: "bold" }}>
  Do you really want to delete this car?
</DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            No🚘
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Yes🚗
          </Button>
        </DialogActions>
      </Dialog>

      {/* أزرار الحركة العائمة */}
      <div className="fab-container">
        <Fab color="secondary" aria-label="users" onClick={() => navigate('/user')} className="fab-button">
          <AccountCircleIcon />
        </Fab>
        {user.roul !== 'admin' ? (
          
            <Fab
              color="default"
              aria-label="reservation"
              onClick={() => navigate('/Reservation')}
              className="fab-button"
            >
              <NotificationAddSharpIcon />
            </Fab>
          
        ) : (
          <Fab
            color="default"
            aria-label="reservation"
            onClick={() => navigate('/Reservation')}
            className="fab-button"
          >
            <NotificationAddSharpIcon />
          </Fab>
        )}
        <Fab color="default" aria-label="logout" onClick={handelLogOut} className="fab-button">
          <LogoutSharpIcon />
        </Fab>
      </div>
    </>
  );
}

export default Milarent;
