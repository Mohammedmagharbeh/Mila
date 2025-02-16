const express=require('express') 
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {postreservation,getReservation}=require('../controller/Reservationcontroller')

routes.post('/postReservation',postreservation)
routes.get('/gettReservation',getReservation)


module.exports=routes;
