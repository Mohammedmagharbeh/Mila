const mila=require('../models/milarent')

// get methode

exports.getmilacar=async(req,res)=>{
    try {
        const cars=await mila.find()
        res.status(200).json(cars)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

// post method
 exports.postmilacar=async(req,res)=>{
    try {
        const newmila=req.body
        const creatmila=await mila.create(newmila)
        res.status(200).json(creatmila)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
 }

//  update
exports.updatemilacar=async(req,res)=>{
   
    try {
        const id=req.params.id;
        const body=req.body;
        const updatemila=await mila.findByIdAndUpdate(id,body,{new:true})
        res.status(200).json(updatemila)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete
exports.deletemila=async(req,res)=>{
    try {
    const id=req.params.id
    const deletememe=await mila.findByIdAndDelete({_id:id})
        res.status(200).json(deletememe)
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}