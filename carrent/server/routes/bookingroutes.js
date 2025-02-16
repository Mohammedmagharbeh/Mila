const express=require('express') 
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();
const {verify}=require('../controller/usercontroller')


const {postbooking,getbooking,deletebooking,updatebooking}=require('../controller/Bookingcontroller')

routes.post('/postNewbooking',verify,postbooking)
routes.get('/getbooking',verify,getbooking)
routes.delete('/deletebooking',verify,deletebooking)
routes.put('/updatebooking',verify,updatebooking)

module.exports=routes;
