const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbID = require("../utils/validateMongoDb");

const createCategory = asyncHandler(async(req,res)=>{
    try{
        const  newCategory = await Category.create(req.body)
        res.json(newCategory)
    }catch(e){
        throw new Error(e)
    }
})

const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const  updateCategory = await Category.findByIdAndUpdate(id,req.body, {
            new:true,
        })
        res.json(updateCategory)
    }catch(e){
        throw new Error(e)
    }
})
const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const  deletedCategory = await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    }catch(e){
        throw new Error(e)
    }
})

const getCateogry = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const  getACategory = await Category.findById(id)
        res.json(getACategory)
    }catch(e){
        throw new Error(e)
    }
})
const getAllCateogry = asyncHandler(async(req,res)=>{
    try{
        const  getCategories = await Category.findById()
        res.json(getCategories)
    }catch(e){
        throw new Error(e)
    }
})




module.exports ={createCategory, updateCategory, deleteCategory, getCateogry,getAllCateogry}