const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    password2: { type: String, required: true },
    roul: { type: String, default: 'user',required: true },

})
const user=mongoose.model('users',userSchema)
module.exports=user;