const express = require("express");
const { createBlog, updateBlog, getBlog, getBlogs, deleteBlog, likeBlog, dislikeBlog } = require("../controllers/blogContorller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/', authMiddleware, isAdmin , createBlog);
router.get('/' , getBlogs);
router.put('/likes', authMiddleware , likeBlog);
router.put('/likes', authMiddleware , dislikeBlog);
router.delete('/', authMiddleware, isAdmin , deleteBlog);
router.put('/:id', authMiddleware, isAdmin , updateBlog);
router.get('/:id' , getBlog);

module.exports = router 