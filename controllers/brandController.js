const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbID = require("../utils/validateMongoDb");

const createBrand = asyncHandler(async(req,res)=>{
    try{
        const  newBrand = await Brand.create(req.body)
        res.json(newBrand)
    }catch(e){
        throw new Error(e)
    }
})

const updateBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const  updateBrand = await Brand.findByIdAndUpdate(id,req.body, {
            new:true,
        })
        res.json(updateBrand)
    }catch(e){
        throw new Error(e)
    }
})
const deleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const  deletedBrand = await Brand.findByIdAndDelete(id)
        res.json(deletedBrand)
    }catch(e){
        throw new Error(e)
    }
})

const getBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const  getABrand = await Brand.findById(id)
        res.json(getABrand)
    }catch(e){
        throw new Error(e)
    }
})
const getAllBrand = asyncHandler(async(req,res)=>{
    try{
        const  getCategories = await Brand.findById()
        res.json(getCategories)
    }catch(e){
        throw new Error(e)
    }
})




module.exports ={createBrand, updateBrand, deleteBrand, getBrand,getAllBrand}