const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler")

const createCoupon = asyncHandler(async(req,res)=>{
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon)
    }catch(e){
        throw new Error(e)
    }
}) ;
const getAllCoupons = asyncHandler(async(req,res)=>{
    try{
        const getCoupons = await Coupon.find();
        res.json(getCoupons)
    }catch(e){
        throw new Error(e)
    }
}) ;

const updateCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params ;
    try{
        const updateCoupon1 = await Coupon.findByIdAndUpdate(id, req.body,{
            new:true
        });
        res.json(updateCoupon1)
    }catch(e){
        throw new Error(e)
    }
}) ;
const deleteCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params ;
    try{
        const del = await Coupon.findByIdAndDelete(id)
        res.json(del)
    }catch(e){
        throw new Error(e)
    }
}) ;
module.exports = {
createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon
}