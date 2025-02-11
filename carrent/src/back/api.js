import axios from 'axios'
const API=axios.create({
    baseURL:'http://127.0.0.1:5000/api'
})
export const fetchmila=()=>API.get('/Mila')
export const postnwemila=(car)=>API.post('/postmila',car)
export const deletcaremila=(id)=>API.delete(`/deletemila/${id}`)
export const updatemilacar=(id,formData)=>API.put(`updatemila/${id}`,formData)

export const postregitrer = (user) => API.post('/users/postuser', user);
// export const fetchuser=()=>API.get('/users')

export const fetchuser=()=>API.get('/users')
// export const postusers=(user)=>API.post('/users/postnewuser',user)
export const deleteUser=(id)=>API.delete(`/deleteuser/${id}`)
export const updateuser=(id,userUpdate)=>API.put(`/updateuser/${id}`,userUpdate)
export const getbooking=()=>API.get('/getbooking')
export const postbooking=(bookingObj)=>API.post('/postbooking',bookingObj)

// export const getUserBookings = (userId) => API.get(`/bookings/user/${userId}`);


