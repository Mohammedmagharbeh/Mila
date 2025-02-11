const moongose=require('mongoose')
const milaSchema=new moongose.Schema({
    name:{type:String,require:true},
    year:{type:Number,require:true},
    price:{type:Number,require:true},
    image:{type:String,require:true}
})

const mila=moongose.model('mila',milaSchema)

module.exports=mila;