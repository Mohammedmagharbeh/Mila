const express=require('express') 
const bodyParse=require('body-parser')
const cors=require('cors')
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const milaroutes=require('./routes/milaroutes')
const userroutes=require('./routes/userroutes')
const postbooking=require('./routes/bookingroutes')
// const Bookingroutes = require('./routes/Bookingroutes');


dotenv.config()
const app=express();
connectDB();

app.use(bodyParse.json())
app.use(cors());
app.use('/api',milaroutes)
app.use('/api',userroutes)
app.use('/api',postbooking)

// app.use('/api', Bookingroutes);






module.exports=app; 