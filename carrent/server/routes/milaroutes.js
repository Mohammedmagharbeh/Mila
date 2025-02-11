const express=require('express') 
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {getmilacar,postmilacar,updatemilacar,deletemila}=require('../controller/milacontroller')

routes.get('/Mila',getmilacar)
routes.post('/postmila',postmilacar)
routes.put('/updatemila/:id',updatemilacar)
routes.delete('/deletemila/:id',deletemila)

module.exports=routes;
