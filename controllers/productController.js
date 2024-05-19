const asyncHandler = require("express-async-handler");
const Product = require("../models/product")
const slugify = require("slugify");
const userModel = require("../models/userModel");
const { cloudinaryUplo } = require("../utils/cloudinary");
const createProduct = asyncHandler(async(req,res)=>{

    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(e){
        throw new Error(e);
    }

});

const getProduct = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params ;
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }catch(e){
        throw new Error(e);
    }
});


const getProducts = asyncHandler(async(req,res)=>{
    
    try{
        const queryObject = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el=>delete queryObject[el]);
        let queryStr = JSON.stringify(queryObject);
        queryStr=queryStr.replace(/\b(gte|gy|lte|lt)\b/g, match=>`$${match}`);
        let query = Product.find(JSON.parse(queryStr));
   
       
        //sorting

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt');
        }

        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        }else{
            query = query.select('-__v');
        }


        // pagination:
        const page = req.query.page; 
        const limit = req.query.limit ;
        const skip = (page-1) * limit ;
        query= query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocument();
            if(skip>=productCount){
                throw new Error('This Page oes not exists');
            }
        }


       
        const product = await query 
        res.json(product);
    }catch(e){
        throw new Error(e);
    }
});

const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params ;
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body,{new:true})
        res.json(updateProduct);
    }catch(e){
        throw new Error(e);
    }
});

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params ;
    try{
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json({
            deleteProduct
        });
    }catch(e){
        throw new Error(e);
    }
});

const addToWishlist = asyncHandler(async(req,res)=>{
    const {_id} = req.user ;
    const {prodId} = req.body ;
    try{
        const user = await userModel.findById(_id);
        const alreadyAdded = user.wishlist.findById((id)=>id.String()===prodID)
        if(alreadyAdded){
            let user = await userModel.findByIdAndUpdate(_id,{
               $pull : {wishlist:prodId}, 
            }, {
                new:true
            })
            res.json(user)
        } else{
            let user = await userModel.findByIdAndUpdate(_id,{
               $push : {wishlist:prodId}, 
            }, {
                new:true
            })
            res.json(user)
            
        }
    } catch(e){
        throw new Error(e)
    }
})
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId } = req.body;
    
    // Fetch the product by ID
    const product = await Product.findById(prodId);
    
    // Check if the user has already rated the product
    let alreadyRated = product.ratings.find(rating => rating.postedBy.toString() === _id.toString());

    if (alreadyRated) {
        // Update the existing rating
        await Product.updateOne(
            { _id: prodId, "ratings.postedBy": _id },
            { $set: { "ratings.$.star": star } },
            { new: true }
        );
        res.json(updateProduct);
    } else {
        // Add a new rating
        await Product.findByIdAndUpdate(
            prodId,
            {
                $push: {
                    ratings: {
                        star: star,
                        postedBy: _id,
                    },
                },
            },
            { new: true }
        );
    }

    // Fetch the updated product
    const updatedProduct = await Product.findById(prodId);
    res.json(updatedProduct);
}
);

const uploadImages = asyncHandler(async(req,res)=>{
        // console.log(req.files);
        const {id} = req.params ;
        try{
            const uploader = (path) =>cloudinaryUplo(path,  "images");
            const url =[]
            const files = req.files; 
            for(const file of files) {
                const{path} = files;
                const newPath = await uploader(path)
                urls.$push(newPath)
            }
            const findProduct = await Product.findByIdAndUpdate(id,{
                images:urls.map((file)=>{
                    return file
                })
            }, {new:true})
        }catch(e){
            throw new Error(e)
        }
})

module.exports = {createProduct,getProduct, getProducts,deleteProduct,updateProduct,addToWishlist,rating,uploadImages};