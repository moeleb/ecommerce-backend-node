const Blog = require("../models/blogModel");
const User = require("../models/blogModel");
const asyncHandler = require('express-async-handler');
const validateMongoDbID = require("../utils/validateMongoDb");


const createBlog = asyncHandler(async(req,res)=>{
        try{
            const newBlog = await Blog.create(req.body)
            res.json({
                status:"success",
                newBlog,
            })
        } catch(e){
            throw new Error(e)
        }
})

const updateBlog = asyncHandler(async(req,res)=>{
        const {id} = req.params ;
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new:true
        })
        res.json(updateBlog)
    } catch(e){
        throw new Error(e)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch the blog post by id
        const blog = await Blog.findById(id).populate('likes').populate('dislikes');

        // If the blog post does not exist, send a 404 response
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment the numViews by 1 and return the updated document
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { numViews: 1 } },
            { new: true, runValidators: true }
        );

        // Return the updated blog post
        res.json(blog);
    } catch (e) {
        // Handle any errors that occur
        res.status(500).json({ message: e.message });
    }
});

const getBlogs = asyncHandler(async(req,res)=>{
try{
    const getBlogs = await Blog.find()
    res.json(getBlogs)
} catch(e){
    throw new Error(e)
}
})

const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params ;
try{
    const deletedBlog = await Blog.findByIdAnddelete(id)
    res.json(deletedBlog)
} catch(e){
    throw new Error(e)
}
})

const likeBlog = asyncHandler(async(req,res)=>{
    const {blogID} = req.body ;
    validateMongoDbID(blogID);
    const blog = await Blog.findById(blogID);
     const loginUserId = req.user._id ;
     const  isLiked = blog.isLiked
     const alreadyDisliked = blog.disLikes.find(
        userId = userId.toString() === loginUserId.toString()
     )
     if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogID,{
            $pull : {disLikes:loginUserId}, 
            isDisliked:false
        }, {
            new:true
        })
        res.json(blog)
     }
     if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogID,{
            $pull : {ikes:loginUserId}, 
            isLiked:false
        }, {
            new:true
        })
        res.json(blog)
     } else{
        const blog = await Blog.findByIdAndUpdate(blogID,{
            $push : {likes:loginUserId}, 
            isLiked:true
        }, {
            new:true
        })
        res.json(blog)
     }
})

const dislikeBlog = asyncHandler(async(req,res)=>{
    const {blogID} = req.body ;
    validateMongoDbID(blogID);
    const blog = await Blog.findById(blogID);
     const loginUserId = req.user._id ;
     const  isDisLiked = blog.isDisliked
     const alreadyliked = blog.likes.find(
        userId = userId.toString() === loginUserId.toString()
     )
     if(alreadyliked){
        const blog = await Blog.findByIdAndUpdate(blogID,{
            $pull : {likes:loginUserId}, 
            isLiked:false
        }, {
            new:true
        })
        res.json(blog)
     }
     if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogID,{
            $pull : {likes:loginUserId}, 
            isDisliked:false
        }, {
            new:true
        })
        res.json(blog)
     } else{
        const blog = await Blog.findByIdAndUpdate(blogID,{
            $push : {disLikes:loginUserId}, 
            isDisliked:true
        }, {
            new:true
        })
        res.json(blog)
     }
})

module.exports = {createBlog, updateBlog, getBlog, getBlogs, deleteBlog, likeBlog, dislikeBlog};