const express = require("express");
const { createCategory, updateCategory, deleteCategory, getCateogry, getAllCateogry } = require("../controllers/blogCategoryContorller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/',authMiddleware,isAdmin, createCategory)
router.put('/:id',authMiddleware,isAdmin, updateCategory)
router.delete('/:id',authMiddleware,isAdmin, deleteCategory)
router.get('/',authMiddleware,isAdmin, getAllCateogry)
router.get('/:id',authMiddleware,isAdmin, getCateogry)
module.exports = router