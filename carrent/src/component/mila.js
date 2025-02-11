import React, { useEffect, useState } from 'react'
import { fetchmila, postnwemila, deletcaremila, updatemilacar } from '../back/api'
import { Button, Fab } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationAddSharpIcon from '@mui/icons-material/NotificationAddSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
function Milarent() {
  const [cars, setmilacars] = useState([])
  const [formData, setformData] = useState({ name: '', year: '', price: '', image: '' })
  const [modalstate, setmodalstate] = useState(false)
  const [selececar, setselectcar] = useState(null)
  const navigate = useNavigate() 
  const [user, setuser] = useState([])

  useEffect(() => {
    const getcar = async () => {
      const res = await fetchmila()
      setmilacars(res.data)
    }
    getcar()
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('jwt') 
    if (!token) {
      navigate("/login")
    }

    const invalidToken = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/home', {
          headers: {
            'Auth': 'Baerer ' + token, 
          },
        })

        setuser(res.data.user) 
        if (res.data.user.roul === 'admin') {
          navigate('/')
        } else {
          navigate('/foruser')
        }
      } catch (err) {
        console.log(err.response)
        if (err.response.status === 401) {
          navigate('/Login')
        }
      }
    }

    invalidToken()
  }, [navigate])

  const addcar = async (e) => {
    e.preventDefault()
    const res = await postnwemila(formData)
    setmilacars([...cars, formData])
    setformData({ name: '', year: '', price: '', image: '' })
  }

  const handelinputadd = async (e) => {
    const { name, value } = e.target
    setformData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = function () {
        const imageData = reader.result
        setformData({
          ...formData,
          image: imageData, 
        })
      }
      reader.readAsDataURL(file) 
    } else {
      alert("يرجى اختيار صورة.")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you really want to delete this car?")
    if (confirmDelete) {
      await deletcaremila(id)
      setmilacars(cars.filter((car) => car._id !== car.id)) 
      alert("The car has been deleted successfully.")
    } else {
      alert("Car deletion has been canceled.")
    }
  }

  const updatecarmila = async (e) => {
    e.preventDefault()
    const res = await updatemilacar(selececar._id, formData)
    setmodalstate(false)
    alert('car was updated')
    setformData({ name: "", year: "", price: "", image: "" })
  }

  const handeleditcar = async (car) => {
    setselectcar(car)
    setformData({ name: car.name, year: car.year, price: car.price, image: car.image })
    setmodalstate(true)
  }
  const handelLogOut = ()=>{
    sessionStorage.removeItem('jwt');
    navigate('/login')
  }
  const closeModal = () => {
    setmodalstate(false)
    setformData({ name: "", year: "", price: "", image: "" })
  }

  return (
    <>
      <div className="cars-container">
        {cars.map((car) => (
          <div className="car-card" key={car._id}>
            <h2>{car.name}</h2>
            <p>Year: {car.year}</p>
            <h2>Price: {car.price} JD</h2>
            {car.image && <img src={car.image} alt={car.name} />}
            <button className='delete-button' onClick={() => handleDelete(car._id)}>
              <DeleteIcon />
            </button>
            <button onClick={() => handeleditcar(car)} className='edit'>
              <EditIcon />
            </button>
          </div>
        ))}
      </div>

      <form className="car-form" onSubmit={addcar}>
        <input name='name' value={formData.name} type='text' placeholder='Car Name' onChange={handelinputadd} className="form-input" required />
        <input name='year' value={formData.year} type='number' placeholder='Year' onChange={handelinputadd} className="form-input" required />
        <input name='price' value={formData.price} type='number' placeholder='Price' onChange={handelinputadd} className="form-input" required />
        <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="form-input" required />
        {/* <Button onClick={() => navigate("/user")}>Users</Button> */}
        <button className="submit-button" type='submit'>Add Car</button>
        {/* <Button onClick={() => navigate('/Reservation')}>Reservation</Button> */}
      </form>

      {modalstate && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Car</h2>
            <form onSubmit={updatecarmila}>
              <input name="name" value={formData.name} type="text" placeholder="Car Name" onChange={handelinputadd} required />
              <input name="year" value={formData.year} type="number" placeholder="Year" onChange={handelinputadd} required />
              <input name="price" value={formData.price} type="number" placeholder="Price" onChange={handelinputadd} required />
              <input name="image" type="file" accept="image/*" onChange={handleImageChange} />
              <button type="submit">Update Car</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fab-container">
        
        <Fab color="secondary" aria-label="users" onClick={() => navigate("/user")} className="fab-button">
          
          <AccountCircleIcon/>
        </Fab>
        <Fab color="default" aria-label="reservation" onClick={() => navigate("/Reservation")} className="fab-button">
          <NotificationAddSharpIcon />
        </Fab>
        <Fab
  color="default"
  aria-label="reservation"
  onClick={async () => { await handelLogOut();}}
  className="fab-button">
  <LogoutSharpIcon />
</Fab>

      </div>
    </>
  )
}

export default Milarent
