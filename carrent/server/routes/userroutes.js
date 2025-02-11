const express=require('express') 
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();
const {getUsers,postuser,deleteuser,updateuser, userLogin,verify,home}=require('../controller/usercontroller');
routes.get('/users',getUsers);
routes.post('/users/postuser',postuser);
routes.delete('/deleteuser/:id',deleteuser)
routes.put('/updateuser/:id',updateuser)


// for token login page استخدم الرابط هاد
routes.post('/login',userLogin)
routes.get('/jwt',verify)
routes.get('/home',verify,home);


// routes.get('/users/names',getusersnames);
    
module.exports=routes;