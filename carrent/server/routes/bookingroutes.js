const express=require('express') 
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();
const {verify}=require('../controller/usercontroller')


const {postbooking,getbooking}=require('../controller/Bookingcontroller')

routes.post('/postbooking',verify,postbooking)
routes.get('/getbooking',verify,getbooking)



module.exports=routes;
